/* =========================================================
   NEXORA — LEGAL PAGES
   assets/js/legal.js
   ========================================================= */

(() => {
    "use strict";


    /* =====================================================
       HELPERS
       ===================================================== */

    const qs = (selector, scope = document) =>
        scope.querySelector(selector);

    const qsa = (selector, scope = document) =>
        Array.from(scope.querySelectorAll(selector));


    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;


    /* =====================================================
       INIT
       ===================================================== */

    document.addEventListener("DOMContentLoaded", () => {
        initLegalHeroParallax();
        initLegalNavigation();
        refreshLegalLayout();
    });


    /* =====================================================
       LEGAL HERO PARALLAX
       Only background geometry moves.
       Content and hero section stay fixed.
       ===================================================== */

    function initLegalHeroParallax() {
        const hero = qs(".legal-hero");
        const pattern = qs(
            "[data-legal-pattern]",
            hero
        );


        if (
            !hero ||
            !pattern ||
            !finePointer ||
            reducedMotion
        ) {
            return;
        }


        let targetX = 0;
        let targetY = 0;

        let currentX = 0;
        let currentY = 0;

        let frameId = null;


        const strengthX = 10;
        const strengthY = 7;


        const render = () => {
            currentX +=
                (targetX - currentX) *
                0.065;

            currentY +=
                (targetY - currentY) *
                0.065;


            pattern.style.translate =
                `${currentX.toFixed(2)}px ` +
                `${currentY.toFixed(2)}px`;


            frameId =
                window.requestAnimationFrame(
                    render
                );
        };


        hero.addEventListener(
            "pointermove",
            (event) => {
                const rect =
                    hero.getBoundingClientRect();


                if (
                    !rect.width ||
                    !rect.height
                ) {
                    return;
                }


                const x =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width;


                const y =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height;


                targetX =
                    (x - 0.5) *
                    strengthX *
                    -1;


                targetY =
                    (y - 0.5) *
                    strengthY *
                    -1;
            },
            {
                passive: true
            }
        );


        hero.addEventListener(
            "pointerleave",
            () => {
                targetX = 0;
                targetY = 0;
            }
        );


        frameId =
            window.requestAnimationFrame(
                render
            );


        window.addEventListener(
            "pagehide",
            () => {
                if (frameId) {
                    window.cancelAnimationFrame(
                        frameId
                    );
                }
            },
            {
                once: true
            }
        );
    }


    /* =====================================================
       LEGAL LOCAL NAVIGATION
       Automatically highlights current article section.
       ===================================================== */

    function initLegalNavigation() {
        const nav = qs(".legal-nav nav");

        if (!nav) {
            return;
        }


        const links = qsa(
            'a[href^="#"]',
            nav
        );


        if (!links.length) {
            return;
        }


        const entries = links
            .map((link) => {
                const hash =
                    link.getAttribute("href");

                if (
                    !hash ||
                    hash === "#"
                ) {
                    return null;
                }


                let section = null;


                try {
                    section = document.querySelector(
                        hash
                    );
                } catch {
                    section = null;
                }


                if (!section) {
                    return null;
                }


                return {
                    link,
                    section,
                    hash
                };
            })
            .filter(Boolean);


        if (!entries.length) {
            return;
        }


        let ticking = false;
        let activeHash = "";


        const getHeaderOffset = () => {
            const header =
                qs("[data-header]");


            const headerHeight = header
                ? header.getBoundingClientRect().height
                : 0;


            return headerHeight + 72;
        };


        const setActive = (hash) => {
            if (
                !hash ||
                activeHash === hash
            ) {
                return;
            }


            activeHash = hash;


            entries.forEach(
                ({
                    link,
                    hash: itemHash
                }) => {
                    const active =
                        itemHash === hash;


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
                }
            );
        };


        const updateActiveSection = () => {
            const offset =
                getHeaderOffset();


            const currentPosition =
                window.scrollY +
                offset;


            let currentEntry =
                entries[0];


            for (
                let index = 0;
                index < entries.length;
                index += 1
            ) {
                const entry =
                    entries[index];


                const sectionTop =
                    entry.section
                        .getBoundingClientRect()
                        .top +
                    window.scrollY;


                if (
                    sectionTop <=
                    currentPosition
                ) {
                    currentEntry =
                        entry;
                } else {
                    break;
                }
            }


            /*
             * When user is very close to the bottom,
             * force the final section active.
             */

            const nearBottom =
                window.innerHeight +
                window.scrollY >=
                document.documentElement
                    .scrollHeight -
                24;


            if (nearBottom) {
                currentEntry =
                    entries[
                        entries.length - 1
                    ];
            }


            setActive(
                currentEntry.hash
            );


            ticking = false;
        };


        const requestUpdate = () => {
            if (ticking) {
                return;
            }


            ticking = true;


            window.requestAnimationFrame(
                updateActiveSection
            );
        };


        links.forEach((link) => {
            link.addEventListener(
                "click",
                () => {
                    const hash =
                        link.getAttribute(
                            "href"
                        );


                    if (hash) {
                        setActive(hash);
                    }
                }
            );
        });


        window.addEventListener(
            "scroll",
            requestUpdate,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            requestUpdate,
            {
                passive: true
            }
        );


        window.addEventListener(
            "hashchange",
            () => {
                const hash =
                    window.location.hash;


                const matchingEntry =
                    entries.find(
                        (entry) =>
                            entry.hash === hash
                    );


                if (matchingEntry) {
                    setActive(
                        matchingEntry.hash
                    );
                }


                requestUpdate();
            }
        );


        /*
         * Respect a direct URL such as:
         * privacy-policy.html#data-security
         */

        const initialHash =
            window.location.hash;


        const initialEntry =
            entries.find(
                (entry) =>
                    entry.hash === initialHash
            );


        if (initialEntry) {
            setActive(
                initialEntry.hash
            );
        } else {
            setActive(
                entries[0].hash
            );
        }


        updateActiveSection();
    }


    /* =====================================================
       FINAL REFRESH
       ===================================================== */

    function refreshLegalLayout() {
        window.addEventListener(
            "load",
            () => {
                if (
                    typeof window.AOS !==
                    "undefined"
                ) {
                    window.AOS.refresh();
                }


                window.dispatchEvent(
                    new Event("resize")
                );
            },
            {
                once: true
            }
        );
    }

})();
