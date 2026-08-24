import http from 'node:http';

const host = '127.0.0.1';
const port = 9337;
const site = 'http://127.0.0.1:8055/';
const pages = [
  'index.html',
  'digital-strategy.html',
  'seo-marketing.html',
  'performance-marketing.html',
  'social-media-marketing.html',
  'content-marketing.html',
  'web-design.html',
];

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({ host, port, path }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function post(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host, port, path, method: 'PUT' }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data.toString());
      if (msg.id && pending.has(msg.id)) {
        const { resolve: done, reject: fail } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) fail(new Error(msg.error.message));
        else done(msg.result);
      }
    });

    ws.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          const callId = ++id;
          ws.send(JSON.stringify({ id: callId, method, params }));
          return new Promise((done, fail) => pending.set(callId, { resolve: done, reject: fail }));
        },
        close() {
          ws.close();
        },
      });
    });
    ws.addEventListener('error', reject);
  });
}

const results = [];

for (const page of pages) {
  const target = await post(`/json/new?${encodeURIComponent(site + page)}`);
  const client = await connect(target.webSocketDebuggerUrl);
  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await new Promise((resolve) => setTimeout(resolve, 2200));
  await client.send('Runtime.evaluate', {
    awaitPromise: true,
    expression: `(async () => {
      const step = Math.max(480, Math.floor(innerHeight * 0.75));
      for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
        scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 180));
      }
      scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 600));
    })()`,
  });
  const evaluation = await client.send('Runtime.evaluate', {
    returnByValue: true,
    awaitPromise: true,
    expression: `(async () => {
      const images = [...document.images].map((img) => {
        const r = img.getBoundingClientRect();
        return {
          src: img.getAttribute('src') || img.currentSrc,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      });
      const loadChecks = await Promise.all([...new Set(images.map((img) => img.src).filter(Boolean))].map((src) => {
        return new Promise((resolve) => {
          const probe = new Image();
          probe.onload = () => resolve({ src, ok: true, naturalWidth: probe.naturalWidth, naturalHeight: probe.naturalHeight });
          probe.onerror = () => resolve({ src, ok: false, naturalWidth: 0, naturalHeight: 0 });
          probe.src = src;
        });
      }));
      return {
        imageCount: images.length,
        unloadedInDom: images.filter((img) => img.naturalWidth === 0),
        networkBroken: loadChecks.filter((img) => !img.ok),
        zero: images.filter((img) => img.width === 0 || img.height === 0),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    })()`,
  });
  results.push({ page, ...evaluation.result.value });
  client.close();
}

console.log(JSON.stringify(results, null, 2));
