/* =========================================================
   LLC Advantshield — GLOBAL
   assets/js/global.js
   ========================================================= */

"use strict";


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (selector, scope = document) => scope.querySelector(selector);

const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

const SITE = window.SITE_CONFIG || {};

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
);


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    applySiteConfig();
    buildPrimaryNavigation();
    buildBurgerNavigation();
    buildFooterNavigation();

    initBurgerMenu();
    initSiteSearch();
    initCustomCursor();
    initSectionDock();
    initCookieCard();
    initBackToTop();
    initWorkTeaserReveal();
    initSyncPanels();
    initContactForms();
    initAOS();
});


/* =========================================================
   APPLY SITE CONFIG
   ========================================================= */

function applySiteConfig() {
    const {
        brandName,
        brandTagline,
        logo,
        favicon,
        email,
        address,
        disclaimer,
        cookieNotice,
        pages,
        footer,
        burger,
        formEndpoint
    } = SITE;


    /* Brand */

    if (brandName) {
        $$("[data-brand-name]").forEach((element) => {
            element.textContent = brandName;
        });

        $$("[data-footer-copyright-name]").forEach((element) => {
            element.textContent = brandName;
        });
    }


    if (brandTagline) {
        $$("[data-brand-tagline]").forEach((element) => {
            element.textContent = brandTagline;
        });
    }


    /* Logo */

    if (logo) {
        $$("[data-site-logo]").forEach((image) => {
            image.src = logo;
        });
    }


    /* Favicon */

    if (favicon) {
        $$("[data-site-favicon]").forEach((link) => {
            link.href = favicon;
        });
    }


    /* Email */

    if (email) {
        $$("[data-site-email]").forEach((element) => {
            element.textContent = email;
        });

        $$("[data-site-email-link]").forEach((link) => {
            link.href = `mailto:${email}`;
        });
    }


    /* Address */

    if (address) {
        $$("[data-site-address]").forEach((element) => {
            element.textContent = address;
        });
    }


    /* Disclaimer */

    if (disclaimer) {
        $$("[data-site-disclaimer]").forEach((element) => {
            element.textContent = disclaimer;
        });
    }


    /* Cookie notice */

    if (cookieNotice) {
        $$("[data-cookie-notice]").forEach((element) => {
            element.textContent = cookieNotice;
        });
    }


    /* Footer description */

    if (footer?.description) {
        $$("[data-footer-description]").forEach((element) => {
            element.textContent = footer.description;
        });
    }


    /* Burger description */

    if (burger?.description) {
        $$("[data-burger-description]").forEach((element) => {
            element.textContent = burger.description;
        });
    }


    /* Burger CTA */

    if (burger?.ctaText || burger?.ctaHref) {
        $$("[data-burger-cta]").forEach((link) => {
            const text = $("span", link);

            if (burger?.ctaText && text) {
                text.textContent = burger.ctaText;
            }

            if (burger?.ctaHref) {
                link.href = burger.ctaHref;
            }
        });
    }


    /* Form endpoint */

    if (formEndpoint) {
        $$("[data-contact-form]").forEach((form) => {
            form.action = formEndpoint;
        });
    }


    /* Browser title */

    const pageKey = document.body?.dataset.page;

    if (pageKey && pages?.[pageKey]?.title) {
        document.title = pages[pageKey].title;
    } else if (SITE.browserTitle) {
        document.title = SITE.browserTitle;
    }


    /* Current year */

    $$("[data-current-year]").forEach((element) => {
        element.textContent = "2026";
    });
}


/* =========================================================
   PRIMARY NAVIGATION
   ========================================================= */

function buildPrimaryNavigation() {
    const nav = $("[data-primary-nav]");

    if (!nav || !Array.isArray(SITE.navigation)) {
        return;
    }

    nav.replaceChildren();

    SITE.navigation.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.className = "site-nav__item";

        const link = document.createElement("a");
        link.className = "site-nav__link";
        link.href = item.href;
        link.textContent = item.label;

        const isServices =
            item.label?.trim().toLowerCase() === "services";

        if (isServices && Array.isArray(SITE.services)) {
            const chevron = createChevronIcon();

            chevron.classList.add("site-nav__chevron");

            link.append(chevron);
            listItem.append(link);

            const dropdown = document.createElement("div");
            dropdown.className = "site-nav__dropdown";

            const dropdownList = document.createElement("ul");
            dropdownList.className = "site-nav__dropdown-list";

            SITE.services.forEach((service) => {
                const serviceItem = document.createElement("li");
                serviceItem.className = "site-nav__dropdown-item";

                const serviceLink = document.createElement("a");
                serviceLink.className = "site-nav__dropdown-link";
                serviceLink.href = service.href;
                serviceLink.textContent = service.title;

                serviceItem.append(serviceLink);
                dropdownList.append(serviceItem);
            });

            dropdown.append(dropdownList);
            listItem.append(dropdown);
        } else {
            listItem.append(link);
        }

        nav.append(listItem);
    });

    updateMainNavigationState();
}


/* =========================================================
   BURGER NAVIGATION
   ========================================================= */

function buildBurgerNavigation() {
    const container = $("[data-burger-nav]");

    if (!container || !Array.isArray(SITE.navigation)) {
        return;
    }

    container.replaceChildren();

    const list = document.createElement("ul");
    list.className = "burger-nav__list";

    SITE.navigation.forEach((item) => {
        const navItem = document.createElement("li");
        navItem.className = "burger-nav__item";

        const link = document.createElement("a");
        link.className = "burger-nav__link";
        link.href = item.href;
        link.textContent = item.label;

        navItem.append(link);


        const isServices =
            item.label?.trim().toLowerCase() === "services";


        if (isServices && Array.isArray(SITE.services)) {
            const serviceList = document.createElement("div");
            serviceList.className = "burger-nav__services";

            SITE.services.forEach((service) => {
                const serviceLink = document.createElement("a");

                serviceLink.className =
                    "burger-nav__service-link";

                serviceLink.href = service.href;
                serviceLink.textContent = service.title;

                serviceList.append(serviceLink);
            });

            navItem.append(serviceList);
        }

        list.append(navItem);
    });

    container.append(list);
}


/* =========================================================
   FOOTER NAVIGATION
   ========================================================= */

function buildFooterNavigation() {
    buildFooterList(
        "[data-footer-nav]",
        SITE.navigation
    );

    buildFooterList(
        "[data-footer-services]",
        SITE.services
    );

    buildFooterList(
        "[data-footer-legal]",
        SITE.legal
    );
}


function buildFooterList(selector, items) {
    const container = $(selector);

    if (!container || !Array.isArray(items)) {
        return;
    }

    container.replaceChildren();

    items.forEach((item) => {
        const li = document.createElement("li");
        const link = document.createElement("a");

        link.href = item.href;
        link.textContent = item.label || item.title;

        li.append(link);
        container.append(li);
    });
}


/* =========================================================
   ICON HELPERS
   ========================================================= */

function createChevronIcon() {
    const namespace = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(namespace, "svg");
    const path = document.createElementNS(namespace, "path");

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    path.setAttribute(
        "d",
        "m7 9 5 5 5-5"
    );

    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.8");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    svg.append(path);

    return svg;
}


/* =========================================================
   BURGER MENU
   ========================================================= */

function initBurgerMenu() {
    const panel = $("[data-burger-panel]");
    const overlay = $("[data-burger-overlay]");
    const openButton = $("[data-burger-open]");
    const closeButton = $("[data-burger-close]");

    if (
        !panel ||
        !overlay ||
        !openButton ||
        !closeButton
    ) {
        return;
    }

    let previousFocus = null;
    let overlayTimer = null;


    const openBurger = () => {
        if (document.body.classList.contains("is-burger-open")) {
            return;
        }

        closeSearchImmediately();

        previousFocus = document.activeElement;

        clearTimeout(overlayTimer);

        overlay.hidden = false;

        requestAnimationFrame(() => {
            document.body.classList.add("is-burger-open");

            panel.setAttribute("aria-hidden", "false");
            openButton.setAttribute("aria-expanded", "true");

            closeButton.focus({
                preventScroll: true
            });
        });
    };


    const closeBurger = ({
        restoreFocus = true
    } = {}) => {
        if (!document.body.classList.contains("is-burger-open")) {
            return;
        }

        document.body.classList.remove("is-burger-open");

        panel.setAttribute("aria-hidden", "true");
        openButton.setAttribute("aria-expanded", "false");

        clearTimeout(overlayTimer);

        overlayTimer = window.setTimeout(() => {
            if (
                !document.body.classList.contains("is-burger-open")
            ) {
                overlay.hidden = true;
            }
        }, 720);

        if (
            restoreFocus &&
            previousFocus instanceof HTMLElement
        ) {
            previousFocus.focus({
                preventScroll: true
            });
        }
    };


    openButton.addEventListener("click", openBurger);

    closeButton.addEventListener("click", () => {
        closeBurger();
    });

    overlay.addEventListener("click", () => {
        closeBurger();
    });


    panel.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (!link) {
            return;
        }

        closeBurger({
            restoreFocus: false
        });
    });


    document.addEventListener("keydown", (event) => {
        if (!document.body.classList.contains("is-burger-open")) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeBurger();
            return;
        }

        if (event.key === "Tab") {
            trapFocus(event, panel);
        }
    });
}


/* =========================================================
   SEARCH DATA
   ========================================================= */

function getSearchItems() {
    const results = [];


    if (Array.isArray(SITE.navigation)) {
        SITE.navigation.forEach((item) => {
            results.push({
                title: item.label,
                type: "Navigation",
                href: item.href
            });
        });
    }


    if (Array.isArray(SITE.services)) {
        SITE.services.forEach((service) => {
            results.push({
                title: service.title,
                type: "Service",
                href: service.href
            });
        });
    }


    if (Array.isArray(SITE.legal)) {
        SITE.legal.forEach((item) => {
            results.push({
                title: item.label,
                type: "Legal",
                href: item.href
            });
        });
    }


    const uniqueResults = new Map();

    results.forEach((item) => {
        const key = `${item.title}|${item.href}`;

        if (!uniqueResults.has(key)) {
            uniqueResults.set(key, item);
        }
    });

    return Array.from(uniqueResults.values());
}


/* =========================================================
   SITE SEARCH
   ========================================================= */

function initSiteSearch() {
    const search = $("[data-search]");
    const openButton = $("[data-search-open]");
    const input = $("[data-search-input]");
    const results = $("[data-search-results]");

    if (
        !search ||
        !openButton ||
        !input ||
        !results
    ) {
        return;
    }

    const closeElements = $$(
        "[data-search-close]",
        search
    );

    const searchItems = getSearchItems();

    let previousFocus = null;


    const renderResults = (query = "") => {
        const cleanQuery = normaliseSearchText(query);

        results.replaceChildren();

        let matches;

        if (!cleanQuery) {
            matches = searchItems.slice(0, 8);
        } else {
            matches = searchItems.filter((item) => {
                const searchable = normaliseSearchText(
                    `${item.title} ${item.type}`
                );

                return searchable.includes(cleanQuery);
            });
        }


        if (!matches.length) {
            const empty = document.createElement("p");

            empty.className = "site-search__empty";
            empty.textContent =
                SITE.search?.emptyText ||
                "No matching results found.";

            results.append(empty);

            return;
        }


        matches.slice(0, 10).forEach((item) => {
            const link = document.createElement("a");

            link.className = "site-search__result";
            link.href = item.href;


            const copy = document.createElement("div");

            const title = document.createElement("strong");
            title.textContent = item.title;

            const type = document.createElement("span");
            type.textContent = item.type;

            copy.append(title, type);


            const mark = document.createElement("i");
            mark.className = "site-search__result-mark";
            mark.setAttribute("aria-hidden", "true");

            link.append(copy, mark);

            results.append(link);
        });
    };


    const openSearch = () => {
        closeBurgerImmediately();

        previousFocus = document.activeElement;

        document.body.classList.add("is-search-open");

        search.classList.add("is-open");
        search.setAttribute("aria-hidden", "false");

        openButton.setAttribute("aria-expanded", "true");

        renderResults("");

        window.setTimeout(() => {
            input.focus({
                preventScroll: true
            });
        }, 80);
    };


    const closeSearch = ({
        restoreFocus = true
    } = {}) => {
        if (!search.classList.contains("is-open")) {
            return;
        }

        search.classList.remove("is-open");
        search.setAttribute("aria-hidden", "true");

        document.body.classList.remove("is-search-open");

        openButton.setAttribute("aria-expanded", "false");

        input.value = "";

        if (
            restoreFocus &&
            previousFocus instanceof HTMLElement
        ) {
            previousFocus.focus({
                preventScroll: true
            });
        }
    };


    openButton.addEventListener("click", openSearch);


    closeElements.forEach((element) => {
        element.addEventListener("click", () => {
            closeSearch();
        });
    });


    input.addEventListener("input", () => {
        renderResults(input.value);
    });


    results.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            closeSearch({
                restoreFocus: false
            });
        }
    });


    document.addEventListener("keydown", (event) => {
        if (!search.classList.contains("is-open")) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();

            closeSearch();

            return;
        }

        if (event.key === "Tab") {
            trapFocus(
                event,
                $(".site-search__dialog", search)
            );
        }
    });


    renderResults("");
}


/* =========================================================
   SEARCH HELPERS
   ========================================================= */

function normaliseSearchText(value) {
    return String(value || "")
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


/* =========================================================
   IMMEDIATE PANEL CLOSE HELPERS
   ========================================================= */

function closeBurgerImmediately() {
    const panel = $("[data-burger-panel]");
    const overlay = $("[data-burger-overlay]");
    const openButton = $("[data-burger-open]");

    document.body.classList.remove("is-burger-open");

    if (panel) {
        panel.setAttribute("aria-hidden", "true");
    }

    if (openButton) {
        openButton.setAttribute("aria-expanded", "false");
    }

    if (overlay) {
        overlay.hidden = true;
    }
}


function closeSearchImmediately() {
    const search = $("[data-search]");
    const openButton = $("[data-search-open]");

    document.body.classList.remove("is-search-open");

    if (search) {
        search.classList.remove("is-open");
        search.setAttribute("aria-hidden", "true");
    }

    if (openButton) {
        openButton.setAttribute("aria-expanded", "false");
    }
}


/* =========================================================
   FOCUS TRAP
   ========================================================= */

function trapFocus(event, container) {
    if (!container) {
        return;
    }

    const focusable = $$(
        [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(","),
        container
    ).filter((element) => {
        return (
            element.offsetWidth > 0 ||
            element.offsetHeight > 0
        );
    });


    if (!focusable.length) {
        event.preventDefault();
        return;
    }


    const first = focusable[0];
    const last = focusable[focusable.length - 1];


    if (
        event.shiftKey &&
        document.activeElement === first
    ) {
        event.preventDefault();
        last.focus();
    } else if (
        !event.shiftKey &&
        document.activeElement === last
    ) {
        event.preventDefault();
        first.focus();
    }
}


/* =========================================================
   CUSTOM CURSOR
   ========================================================= */

function initCustomCursor() {
    const cursor = $("[data-cursor]");
    const dot = $(".cursor__dot", cursor);
    const follower = $(".cursor__follower", cursor);

    if (
        !cursor ||
        !dot ||
        !follower ||
        !finePointer.matches ||
        reducedMotion.matches
    ) {
        if (cursor) {
            cursor.style.display = "none";
        }

        return;
    }


    enableNativeCursorReplacement();


    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let followerX = mouseX;
    let followerY = mouseY;

    let frameId = null;


    const render = () => {
        followerX += (mouseX - followerX) * 0.16;
        followerY += (mouseY - followerY) * 0.16;


        dot.style.transform =
            `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;


        follower.style.transform =
            `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;


        frameId = requestAnimationFrame(render);
    };


    const setCursorState = (target) => {
        const interactive = target.closest(
            [
                "a",
                "button",
                "input",
                "textarea",
                "select",
                ".service-card",
                ".project-card",
                ".team-card",
                ".about__media",
                ".why-us__media",
                "[data-cursor-state]"
            ].join(",")
        );

        cursor.classList.toggle(
            "is-active",
            Boolean(interactive)
        );


        const largeTarget = target.closest(
            [
                '[data-cursor-state="large"]',
                ".project-card",
                ".about__media",
                ".why-us__media"
            ].join(",")
        );

        cursor.classList.toggle(
            "is-large",
            Boolean(largeTarget)
        );
    };


    document.addEventListener(
        "pointermove",
        (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            cursor.classList.remove("is-hidden");

            setCursorState(event.target);
        },
        {
            passive: true
        }
    );


    document.documentElement.addEventListener(
        "mouseleave",
        () => {
            cursor.classList.add("is-hidden");
        }
    );


    document.documentElement.addEventListener(
        "mouseenter",
        () => {
            cursor.classList.remove("is-hidden");
        }
    );


    frameId = requestAnimationFrame(render);


    window.addEventListener(
        "pagehide",
        () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        },
        {
            once: true
        }
    );
}


/* =========================================================
   HIDE STANDARD CURSOR ON DESKTOP
   ========================================================= */

function enableNativeCursorReplacement() {
    document.documentElement.classList.add(
        "has-custom-cursor"
    );

    if ($("#custom-cursor-runtime-style")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "custom-cursor-runtime-style";

    style.textContent = `
        @media (hover: hover) and (pointer: fine) {
            html.has-custom-cursor,
            html.has-custom-cursor body,
            html.has-custom-cursor body * {
                cursor: none !important;
            }
        }
    `;

    document.head.append(style);
}


/* =========================================================
   SECTION DOCK
   ========================================================= */

function initSectionDock() {
    const dock = $("[data-section-dock]");

    if (!dock) {
        return;
    }

    const sections = $$("[data-section]");

    const dockLinks = $$(
        "[data-section-link]",
        dock
    );

    if (!sections.length || !dockLinks.length) {
        return;
    }


    const setActive = (sectionId) => {
        dockLinks.forEach((link) => {
            const active =
                link.dataset.sectionLink === sectionId;

            link.classList.toggle(
                "is-active",
                active
            );

            if (active) {
                link.setAttribute(
                    "aria-current",
                    "location"
                );
            } else {
                link.removeAttribute(
                    "aria-current"
                );
            }
        });

        updateMainNavigationState(sectionId);
    };


    if ("IntersectionObserver" in window) {
        const visibleSections = new Map();


        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleSections.set(
                            entry.target,
                            entry.intersectionRatio
                        );
                    } else {
                        visibleSections.delete(
                            entry.target
                        );
                    }
                });


                if (!visibleSections.size) {
                    return;
                }


                const activeSection =
                    Array.from(visibleSections.entries())
                        .sort(
                            (a, b) =>
                                b[1] - a[1]
                        )[0][0];


                const sectionId =
                    activeSection.dataset.section;


                if (sectionId) {
                    setActive(sectionId);
                }
            },
            {
                root: null,
                rootMargin: "-30% 0px -48% 0px",
                threshold: [
                    0,
                    0.1,
                    0.25,
                    0.5,
                    0.75
                ]
            }
        );


        sections.forEach((section) => {
            observer.observe(section);
        });
    }


    dockLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const target =
                link.dataset.sectionLink;

            if (target) {
                setActive(target);
            }
        });
    });
}


/* =========================================================
   MAIN NAV ACTIVE STATE
   ========================================================= */

function updateMainNavigationState(
    currentSection = ""
) {
    const items = $$(".site-nav__item");

    if (!items.length) {
        return;
    }


    items.forEach((item) => {
        const link = $(".site-nav__link", item);

        if (!link) {
            return;
        }

        let active = false;


        if (currentSection) {
            try {
                const url = new URL(
                    link.href,
                    window.location.href
                );

                active =
                    url.hash === `#${currentSection}`;
            } catch {
                active = false;
            }
        } else {
            const currentPath =
                normalisePath(window.location.pathname);

            try {
                const url = new URL(
                    link.href,
                    window.location.href
                );

                const linkPath =
                    normalisePath(url.pathname);

                active =
                    linkPath === currentPath &&
                    (!url.hash || url.hash === window.location.hash);
            } catch {
                active = false;
            }
        }


        item.classList.toggle(
            "is-active",
            active
        );
    });
}


function normalisePath(pathname) {
    const cleaned = pathname
        .replace(/\/+/g, "/")
        .replace(/\/$/, "");

    return cleaned || "/";
}


/* =========================================================
   COOKIE CARD
   ========================================================= */

function initCookieCard() {
    const card = $("[data-cookie-card]");
    const acceptButton = $("[data-cookie-accept]");

    if (!card || !acceptButton) {
        return;
    }


    const storageKey = "advantshield-cookie-consent-v1";


    let accepted = false;


    try {
        accepted =
            localStorage.getItem(storageKey) === "accepted";
    } catch {
        accepted = false;
    }


    if (!accepted) {
        window.setTimeout(() => {
            card.hidden = false;
        }, reducedMotion.matches ? 0 : 650);
    }


    acceptButton.addEventListener("click", () => {
        try {
            localStorage.setItem(
                storageKey,
                "accepted"
            );
        } catch {
            /* Storage can be disabled by browser settings. */
        }

        card.hidden = true;
    });
}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function initBackToTop() {
    const button = $("[data-back-to-top]");

    if (!button) {
        return;
    }


    let ticking = false;


    const updateVisibility = () => {
        button.classList.toggle(
            "is-visible",
            window.scrollY > 650
        );

        ticking = false;
    };


    window.addEventListener(
        "scroll",
        () => {
            if (ticking) {
                return;
            }

            ticking = true;

            requestAnimationFrame(
                updateVisibility
            );
        },
        {
            passive: true
        }
    );


    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior:
                reducedMotion.matches
                    ? "auto"
                    : "smooth"
        });
    });


    updateVisibility();
}


/* =========================================================
   FEATURED WORK REVEAL
   Photos fade/clip/scale in one by one, once, the first
   time the grid enters the viewport.
   ========================================================= */

function initWorkTeaserReveal() {
    const grid = $("[data-work-teaser-grid]");

    if (!grid) {
        return;
    }

    const photos = $$(".work-teaser__photo", grid);

    if (!photos.length) {
        return;
    }


    if (
        reducedMotion.matches ||
        !("IntersectionObserver" in window)
    ) {
        grid.classList.add("is-revealed");
        return;
    }


    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                grid.classList.add("is-revealed");
                obs.unobserve(entry.target);
            });
        },
        {
            root: null,
            threshold: 0.2,
            rootMargin: "0px 0px -10% 0px"
        }
    );


    observer.observe(grid);
}


/* =========================================================
   SYNC PANEL
   Swiper on the left, accordion on the right, kept in
   sync both ways: dragging the slider opens the matching
   accordion item, clicking an item drives the slider.
   ========================================================= */

function initSyncPanels() {
    const panels = $$("[data-sync-panel]");

    if (
        !panels.length ||
        typeof window.Swiper === "undefined"
    ) {
        return;
    }


    panels.forEach((panel) => {
        const swiperEl = $(
            "[data-sync-swiper]",
            panel
        );

        const items = $$(
            "[data-sync-item]",
            panel
        );

        if (
            !swiperEl ||
            !items.length
        ) {
            return;
        }


        const slideLabels = $$(
            ".sync-panel-slide",
            swiperEl
        ).map(
            (slide) => slide.dataset.slideLabel || ""
        );


        /*
         * Swiper's loop mode needs more real slides than a
         * short 3-4 item panel provides, or it disables
         * itself (with a console warning) at the wrap
         * boundary. Swiper's own fix is to duplicate slides,
         * so we clone the set once and map the doubled
         * realIndex back with % items.length below.
         */

        const wrapperEl = $(
            ".swiper-wrapper",
            swiperEl
        );

        if (
            wrapperEl &&
            items.length < 6
        ) {
            $$(".sync-panel-slide", swiperEl).forEach((slide) => {
                wrapperEl.appendChild(slide.cloneNode(true));
            });
        }


        const labelEl = $(
            "[data-sync-label]",
            panel
        );

        const currentEl = $(
            "[data-sync-current]",
            panel
        );

        const totalEl = $(
            "[data-sync-total]",
            panel
        );

        const progressEl = $(
            "[data-sync-progress]",
            panel
        );

        const prevBtn = $(
            "[data-sync-prev]",
            panel
        );

        const nextBtn = $(
            "[data-sync-next]",
            panel
        );


        if (totalEl) {
            totalEl.textContent =
                String(items.length).padStart(2, "0");
        }


        const setActive = (rawIndex) => {
            const index = rawIndex % items.length;

            items.forEach((item, i) => {
                const isOpen = i === index;

                item.classList.toggle(
                    "is-open",
                    isOpen
                );

                const trigger = $(
                    ".sync-panel-item__trigger",
                    item
                );

                if (trigger) {
                    trigger.setAttribute(
                        "aria-expanded",
                        isOpen ? "true" : "false"
                    );
                }
            });

            if (currentEl) {
                currentEl.textContent =
                    String(index + 1).padStart(2, "0");
            }

            if (
                labelEl &&
                slideLabels[index]
            ) {
                labelEl.textContent =
                    slideLabels[index];
            }
        };


        const swiper = new window.Swiper(
            swiperEl,
            {
                loop: true,
                loopAdditionalSlides: 2,

                slidesPerView: 1,
                spaceBetween: 20,

                speed:
                    reducedMotion.matches
                        ? 0
                        : 620,

                grabCursor:
                    finePointer.matches,

                watchOverflow: false,

                autoplay:
                    reducedMotion.matches
                        ? false
                        : {
                            delay: 5400,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        },

                navigation: {
                    prevEl: prevBtn,
                    nextEl: nextBtn
                },

                pagination: progressEl
                    ? {
                        el: progressEl,
                        type: "progressbar"
                    }
                    : undefined,

                on: {
                    slideChange(activeSwiper) {
                        setActive(
                            activeSwiper.realIndex
                        );
                    }
                }
            }
        );


        setActive(swiper.realIndex);


        items.forEach((item, i) => {
            const trigger = $(
                ".sync-panel-item__trigger",
                item
            );

            if (!trigger) {
                return;
            }

            trigger.addEventListener(
                "click",
                () => {
                    swiper.slideToLoop(i);
                }
            );
        });
    });
}


/* =========================================================
   CONTACT FORMS
   ========================================================= */

function initContactForms() {
    const forms = $$("[data-contact-form]");

    if (!forms.length) {
        return;
    }


    forms.forEach((form) => {
        const status = $(
            "[data-form-status]",
            form
        );

        const submitButton = $(
            '[type="submit"]',
            form
        );


        form.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();


                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }


                if (submitButton) {
                    submitButton.disabled = true;
                }


                setFormStatus(
                    status,
                    "",
                    ""
                );


                try {
                    const response = await fetch(
                        form.action,
                        {
                            method:
                                form.method?.toUpperCase() ||
                                "POST",

                            body:
                                new FormData(form),

                            headers: {
                                "X-Requested-With":
                                    "XMLHttpRequest"
                            }
                        }
                    );


                    let data = null;


                    try {
                        data = await response.json();
                    } catch {
                        data = null;
                    }


                    const successful =
                        response.ok &&
                        data?.success !== false;


                    if (!successful) {
                        throw new Error(
                            data?.message ||
                            "Form submission failed."
                        );
                    }


                    setFormStatus(
                        status,
                        data?.message ||
                            SITE.form?.successMessage ||
                            "Thank you. Your message has been successfully sent.",

                        "success"
                    );


                    form.reset();
                } catch (error) {
                    setFormStatus(
                        status,
                        SITE.form?.errorMessage ||
                            "Something went wrong. Please try again.",

                        "error"
                    );

                    console.error(
                        "Contact form error:",
                        error
                    );
                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                }
            }
        );
    });
}


function setFormStatus(
    element,
    message,
    state
) {
    if (!element) {
        return;
    }

    element.classList.remove(
        "is-success",
        "is-error"
    );

    element.textContent = message;


    if (state === "success") {
        element.classList.add("is-success");
    }


    if (state === "error") {
        element.classList.add("is-error");
    }
}


/* =========================================================
   AOS
   ========================================================= */

function initAOS() {
    if (typeof window.AOS === "undefined") {
        return;
    }


    window.AOS.init({
        duration: reducedMotion.matches
            ? 0
            : 720,

        easing:
            "ease-out-cubic",

        once:
            true,

        mirror:
            false,

        offset:
            36,

        anchorPlacement:
            "top-bottom",

        disable: () =>
            reducedMotion.matches
    });


    document.documentElement.classList.add(
        "aos-ready"
    );


    window.addEventListener(
        "load",
        () => {
            window.AOS.refreshHard();
        },
        {
            once: true
        }
    );
}


/* =========================================================
   REFRESH AOS AFTER DYNAMIC CONTENT
   ========================================================= */

window.addEventListener(
    "pageshow",
    () => {
        if (
            typeof window.AOS !== "undefined" &&
            document.documentElement.classList.contains(
                "aos-ready"
            )
        ) {
            window.AOS.refresh();
        }
    }
);
