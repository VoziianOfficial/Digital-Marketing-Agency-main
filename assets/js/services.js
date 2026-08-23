/* =========================================================
   NEXORA — SERVICE PAGES
   assets/js/services.js
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
        initCapabilitiesSlider();
        initRelatedServicesSlider();

        initServiceAccordion();

        initHeroPatternParallax();
        initMediaParallax();
        initServiceFeatureParallax();

        initDecorativeMotion();

        refreshAfterLoad();
    });


    /* =====================================================
       CAPABILITIES SWIPER
       5 slides on all current service pages
       max 3 visible -> loop remains stable
       ===================================================== */

    function initCapabilitiesSlider() {
        const sliders = qsa(
            ".service-capabilities-swiper"
        );


        if (
            !sliders.length ||
            typeof window.Swiper === "undefined"
        ) {
            return;
        }


        sliders.forEach((element) => {

            const section = element.closest(
                ".service-capabilities"
            );


            const prevButton = section
                ? qs(
                    ".service-capabilities-prev",
                    section
                )
                : null;


            const nextButton = section
                ? qs(
                    ".service-capabilities-next",
                    section
                )
                : null;


            const progress = section
                ? qs(
                    ".service-capabilities-progress",
                    section
                )
                : null;


            new window.Swiper(
                element,
                {
                    slidesPerView: 1,
                    slidesPerGroup: 1,

                    spaceBetween: 14,

                    loop: true,

                    loopAdditionalSlides: 2,

                    speed:
                        reducedMotion
                            ? 0
                            : 760,

                    grabCursor:
                        finePointer,

                    allowTouchMove:
                        true,

                    watchOverflow:
                        false,

                    observer:
                        false,

                    observeParents:
                        false,

                    resizeObserver:
                        true,

                    updateOnWindowResize:
                        true,

                    roundLengths:
                        false,

                    autoplay:
                        reducedMotion
                            ? false
                            : {
                                delay: 4200,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            },

                    navigation: {
                        prevEl: prevButton,
                        nextEl: nextButton
                    },

                    pagination: progress
                        ? {
                            el: progress,
                            type: "progressbar"
                        }
                        : undefined,

                    breakpoints: {
                        540: {
                            slidesPerView: 1.45,
                            spaceBetween: 14
                        },

                        720: {
                            slidesPerView: 2,
                            spaceBetween: 16
                        },

                        1040: {
                            slidesPerView: 2.5,
                            spaceBetween: 17
                        },

                        1280: {
                            slidesPerView: 3,
                            spaceBetween: 18
                        }
                    }
                }
            );

        });
    }


    /* =====================================================
       RELATED SERVICES SWIPER
       4 slides on current service pages
       max 3 visible
       ===================================================== */

    function initRelatedServicesSlider() {
        const sliders = qsa(
            ".related-services-swiper"
        );


        if (
            !sliders.length ||
            typeof window.Swiper === "undefined"
        ) {
            return;
        }


        sliders.forEach((element) => {

            const section = element.closest(
                ".related-services"
            );


            const prevButton = section
                ? qs(
                    ".related-services-prev",
                    section
                )
                : null;


            const nextButton = section
                ? qs(
                    ".related-services-next",
                    section
                )
                : null;


            new window.Swiper(
                element,
                {
                    slidesPerView: 1,
                    slidesPerGroup: 1,

                    spaceBetween: 14,

                    loop: true,

                    loopAdditionalSlides: 1,

                    speed:
                        reducedMotion
                            ? 0
                            : 780,

                    grabCursor:
                        finePointer,

                    allowTouchMove:
                        true,

                    watchOverflow:
                        false,

                    observer:
                        false,

                    observeParents:
                        false,

                    resizeObserver:
                        true,

                    updateOnWindowResize:
                        true,

                    roundLengths:
                        false,

                    autoplay:
                        reducedMotion
                            ? false
                            : {
                                delay: 4700,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            },

                    navigation: {
                        prevEl: prevButton,
                        nextEl: nextButton
                    },

                    breakpoints: {
                        540: {
                            slidesPerView: 1.35,
                            spaceBetween: 14
                        },

                        720: {
                            slidesPerView: 2,
                            spaceBetween: 16
                        },

                        1050: {
                            slidesPerView: 2.5,
                            spaceBetween: 17
                        },

                        1280: {
                            slidesPerView: 3,
                            spaceBetween: 18
                        }
                    }
                }
            );

        });
    }


    /* =====================================================
       SERVICE FAQ
       ===================================================== */

    function initServiceAccordion() {
        const accordions = qsa(
            "[data-service-accordion]"
        );


        if (!accordions.length) {
            return;
        }


        accordions.forEach((accordion) => {

            const items = qsa(
                ".service-faq-item",
                accordion
            );


            items.forEach((item) => {

                const trigger = qs(
                    ".service-faq-item__trigger",
                    item
                );


                const panel = qs(
                    ".service-faq-item__panel",
                    item
                );


                if (
                    !trigger ||
                    !panel
                ) {
                    return;
                }


                const open =
                    item.classList.contains(
                        "is-open"
                    );


                trigger.setAttribute(
                    "aria-expanded",
                    open
                        ? "true"
                        : "false"
                );


                panel.hidden = !open;


                trigger.addEventListener(
                    "click",
                    () => {

                        const currentlyOpen =
                            item.classList.contains(
                                "is-open"
                            );


                        items.forEach(
                            (otherItem) => {

                                if (
                                    otherItem !== item &&
                                    otherItem.classList.contains(
                                        "is-open"
                                    )
                                ) {
                                    closeAccordionItem(
                                        otherItem
                                    );
                                }

                            }
                        );


                        if (currentlyOpen) {
                            closeAccordionItem(
                                item
                            );
                        } else {
                            openAccordionItem(
                                item
                            );
                        }

                    }
                );

            });

        });
    }


    /* =====================================================
       OPEN FAQ
       ===================================================== */

    function openAccordionItem(item) {
        const trigger = qs(
            ".service-faq-item__trigger",
            item
        );


        const panel = qs(
            ".service-faq-item__panel",
            item
        );


        if (
            !trigger ||
            !panel
        ) {
            return;
        }


        item.classList.add(
            "is-open"
        );


        trigger.setAttribute(
            "aria-expanded",
            "true"
        );


        panel.hidden = false;


        if (reducedMotion) {
            panel.style.height = "";
            panel.style.overflow = "";
            panel.style.transition = "";

            return;
        }


        panel.style.height = "0px";
        panel.style.overflow = "hidden";

        panel.style.transition =
            "height 420ms " +
            "cubic-bezier(0.22, 1, 0.36, 1)";


        const targetHeight =
            panel.scrollHeight;


        requestAnimationFrame(() => {
            panel.style.height =
                `${targetHeight}px`;
        });


        const finishOpen = (event) => {

            if (
                event.propertyName !==
                "height"
            ) {
                return;
            }


            panel.style.height = "auto";
            panel.style.overflow = "";
            panel.style.transition = "";


            panel.removeEventListener(
                "transitionend",
                finishOpen
            );

        };


        panel.addEventListener(
            "transitionend",
            finishOpen
        );
    }


    /* =====================================================
       CLOSE FAQ
       ===================================================== */

    function closeAccordionItem(item) {
        const trigger = qs(
            ".service-faq-item__trigger",
            item
        );


        const panel = qs(
            ".service-faq-item__panel",
            item
        );


        if (
            !trigger ||
            !panel
        ) {
            return;
        }


        item.classList.remove(
            "is-open"
        );


        trigger.setAttribute(
            "aria-expanded",
            "false"
        );


        if (reducedMotion) {
            panel.hidden = true;

            panel.style.height = "";
            panel.style.overflow = "";
            panel.style.transition = "";

            return;
        }


        const startHeight =
            panel.scrollHeight;


        panel.style.height =
            `${startHeight}px`;

        panel.style.overflow =
            "hidden";

        panel.style.transition =
            "height 360ms " +
            "cubic-bezier(0.4, 0, 0.2, 1)";


        panel.getBoundingClientRect();


        requestAnimationFrame(() => {
            panel.style.height =
                "0px";
        });


        const finishClose = (event) => {

            if (
                event.propertyName !==
                "height"
            ) {
                return;
            }


            panel.hidden = true;

            panel.style.height = "";
            panel.style.overflow = "";
            panel.style.transition = "";


            panel.removeEventListener(
                "transitionend",
                finishClose
            );

        };


        panel.addEventListener(
            "transitionend",
            finishClose
        );
    }


    /* =====================================================
       HERO BACKGROUND MOUSE PARALLAX
       Only thin geometric background moves.
       Text and whole hero stay fixed.
       ===================================================== */

    function initHeroPatternParallax() {
        const hero = qs(
            ".service-hero"
        );


        const pattern = qs(
            "[data-service-hero-pattern]",
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

        const strengthX = 11;
        const strengthY = 8;


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
                requestAnimationFrame(
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


                const relativeX =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width;


                const relativeY =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height;


                targetX =
                    (
                        relativeX - 0.5
                    ) *
                    strengthX *
                    -1;


                targetY =
                    (
                        relativeY - 0.5
                    ) *
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
            requestAnimationFrame(
                render
            );


        window.addEventListener(
            "pagehide",
            () => {

                if (frameId) {
                    cancelAnimationFrame(
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
       HERO / OVERVIEW IMAGE PARALLAX
       ===================================================== */

    function initMediaParallax() {
        const wrappers = qsa(
            "[data-parallax-media]"
        );


        if (
            !wrappers.length ||
            reducedMotion
        ) {
            return;
        }


        const mediaItems = wrappers
            .map((wrapper) => {

                const image = qs(
                    "img",
                    wrapper
                );


                if (!image) {
                    return null;
                }


                return {
                    wrapper,
                    image
                };

            })
            .filter(Boolean);


        if (!mediaItems.length) {
            return;
        }


        let ticking = false;


        const update = () => {

            const viewportHeight =
                window.innerHeight;


            mediaItems.forEach(
                ({
                    wrapper,
                    image
                }) => {

                    const rect =
                        wrapper.getBoundingClientRect();


                    if (
                        rect.bottom < -100 ||
                        rect.top >
                            viewportHeight + 100
                    ) {
                        return;
                    }


                    const wrapperCenter =
                        rect.top +
                        rect.height / 2;


                    const viewportCenter =
                        viewportHeight / 2;


                    const distance =
                        (
                            wrapperCenter -
                            viewportCenter
                        ) /
                        viewportHeight;


                    const offset =
                        clamp(
                            distance * -7,
                            -4,
                            4
                        );


                    image.style.transform =
                        `translate3d(` +
                        `0, ` +
                        `${(-7 + offset).toFixed(2)}%, ` +
                        `0)`;


                }
            );


            ticking = false;
        };


        const requestUpdate = () => {

            if (ticking) {
                return;
            }


            ticking = true;


            requestAnimationFrame(
                update
            );
        };


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


        update();
    }


    /* =====================================================
       FULL-WIDTH FEATURE IMAGE PARALLAX
       ===================================================== */

    function initServiceFeatureParallax() {
        const wrappers = qsa(
            "[data-service-parallax]"
        );


        if (
            !wrappers.length ||
            reducedMotion
        ) {
            return;
        }


        const items = wrappers
            .map((wrapper) => {

                const image = qs(
                    "img",
                    wrapper
                );


                if (!image) {
                    return null;
                }


                return {
                    wrapper,
                    image
                };

            })
            .filter(Boolean);


        if (!items.length) {
            return;
        }


        let scheduled = false;


        const render = () => {

            const viewportHeight =
                window.innerHeight;


            items.forEach(
                ({
                    wrapper,
                    image
                }) => {

                    const rect =
                        wrapper.getBoundingClientRect();


                    if (
                        rect.bottom < -150 ||
                        rect.top >
                            viewportHeight + 150
                    ) {
                        return;
                    }


                    const progress =
                        (
                            (
                                rect.top +
                                rect.height / 2
                            ) -
                            viewportHeight / 2
                        ) /
                        viewportHeight;


                    const offset =
                        clamp(
                            progress * -9,
                            -5,
                            5
                        );


                    image.style.transform =
                        `translate3d(` +
                        `0, ` +
                        `${(-7 + offset).toFixed(2)}%, ` +
                        `0)`;

                }
            );


            scheduled = false;
        };


        const requestRender = () => {

            if (scheduled) {
                return;
            }


            scheduled = true;


            requestAnimationFrame(
                render
            );
        };


        window.addEventListener(
            "scroll",
            requestRender,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            requestRender,
            {
                passive: true
            }
        );


        render();
    }


    /* =====================================================
       DECORATIVE PREMIUM MOTION
       Small hero cards move independently.
       No layout shift because only transform is used.
       ===================================================== */

    function initDecorativeMotion() {
        if (
            reducedMotion ||
            !finePointer
        ) {
            return;
        }


        const hero = qs(
            ".service-hero"
        );


        if (!hero) {
            return;
        }


        const elements = qsa(
            [
                ".service-hero__stamp",
                ".service-hero__signal",
                ".seo-hero-query",
                ".performance-hero-board",
                ".social-hero-stack",
                ".content-hero-editorial",
                ".web-hero-window"
            ].join(","),
            hero
        );


        if (!elements.length) {
            return;
        }


        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;

        let frameId = null;


        const render = () => {

            currentX +=
                (mouseX - currentX) *
                0.055;


            currentY +=
                (mouseY - currentY) *
                0.055;


            elements.forEach(
                (element, index) => {

                    const depth =
                        0.26 +
                        index * 0.075;


                    const x =
                        currentX *
                        depth;


                    const y =
                        currentY *
                        depth;


                    element.style.translate =
                        `${x.toFixed(2)}px ` +
                        `${y.toFixed(2)}px`;

                }
            );


            frameId =
                requestAnimationFrame(
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


                mouseX =
                    (x - 0.5) * 10;


                mouseY =
                    (y - 0.5) * 7;

            },
            {
                passive: true
            }
        );


        hero.addEventListener(
            "pointerleave",
            () => {
                mouseX = 0;
                mouseY = 0;
            }
        );


        frameId =
            requestAnimationFrame(
                render
            );


        window.addEventListener(
            "pagehide",
            () => {

                if (frameId) {
                    cancelAnimationFrame(
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
       CLAMP
       ===================================================== */

    function clamp(
        value,
        min,
        max
    ) {
        return Math.min(
            Math.max(
                value,
                min
            ),
            max
        );
    }


    /* =====================================================
       LOAD REFRESH
       ===================================================== */

    function refreshAfterLoad() {

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
