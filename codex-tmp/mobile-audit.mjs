const chromeUrl = "http://127.0.0.1:9351";
const baseUrl = "http://127.0.0.1:8174";

const pages = [
  "index.html",
  "digital-strategy.html",
  "seo-marketing.html",
  "performance-marketing.html",
  "social-media-marketing.html",
  "content-marketing.html",
  "web-design.html",
  "privacy-policy.html",
  "terms.html",
  "cookies.html",
];

const widths = [320, 375, 390, 430];

async function requestJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
  let id = 0;
  const callbacks = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const callback = callbacks.get(message.id);
    if (!callback) return;
    callbacks.delete(message.id);
    if (message.error) callback.reject(new Error(message.error.message));
    else callback.resolve(message.result);
  });
  return {
    send(method, params = {}) {
      const callId = ++id;
      ws.send(JSON.stringify({ id: callId, method, params }));
      return new Promise((resolve, reject) => {
        callbacks.set(callId, { resolve, reject });
      });
    },
    close() {
      ws.close();
    },
  };
}

function auditExpression() {
  return `(() => {
    const viewport = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const visibleSelector = [
      "body *:not(script):not(style):not(meta):not(link):not(br)"
    ].join("");
    const nodes = [...document.querySelectorAll(visibleSelector)]
      .filter((el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 1 &&
          rect.height > 1;
      });

    const offenders = nodes
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          cls: String(el.className || "").slice(0, 120),
          id: el.id || "",
          left: Math.round(rect.left * 10) / 10,
          right: Math.round(rect.right * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
          position: style.position,
          text: (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 70),
        };
      })
      .filter((item) => item.right > viewport + 1 || item.left < -1 || item.width > viewport + 1)
      .sort((a, b) => b.width - a.width)
      .slice(0, 12);

    const hugeHeadings = [...document.querySelectorAll("h1,h2,.section-title,.service-hero__title,.hero__title,.legal-hero__title")]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (style.display === "none" || rect.width <= 1 || rect.height <= 1) return false;
        const fontSize = parseFloat(style.fontSize) || 0;
        const lineHeight = parseFloat(style.lineHeight) || fontSize;
        const lines = lineHeight ? rect.height / lineHeight : 0;
        return fontSize > 56 || lines > 4.2 || rect.width > viewport - 20;
      })
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize) || 0;
        const lineHeight = parseFloat(style.lineHeight) || fontSize;
        return {
          tag: el.tagName.toLowerCase(),
          cls: String(el.className || "").slice(0, 120),
          fontSize: Math.round(fontSize * 10) / 10,
          lines: Math.round((rect.height / lineHeight) * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
          text: (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 80),
        };
      })
      .slice(0, 12);

    return {
      viewport,
      scrollWidth,
      overflow: scrollWidth - viewport,
      offenders,
      hugeHeadings,
    };
  })()`;
}

async function auditPage(page, width) {
  const target = await requestJson(`${chromeUrl}/json/new?${encodeURIComponent(`${baseUrl}/${page}`)}`, {
    method: "PUT",
  });
  const client = await connect(target.webSocketDebuggerUrl);
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await client.send("Page.navigate", { url: `${baseUrl}/${page}` });
  await new Promise((resolve) => setTimeout(resolve, 1800));
  const result = await client.send("Runtime.evaluate", {
    expression: auditExpression(),
    returnByValue: true,
  });
  client.close();
  await requestJson(`${chromeUrl}/json/close/${target.id}`).catch(() => null);
  return { page, width, ...result.result.value };
}

const all = [];
for (const width of widths) {
  for (const page of pages) {
    all.push(await auditPage(page, width));
  }
}

const problems = all.filter((entry) => (
  entry.overflow > 1 ||
  entry.offenders.length ||
  entry.hugeHeadings.length
));

console.log(JSON.stringify(problems, null, 2));
console.log(`AUDITED ${all.length} page-width pairs, PROBLEMS ${problems.length}`);

if (problems.some((entry) => entry.overflow > 1 || entry.offenders.length)) {
  process.exitCode = 1;
}
