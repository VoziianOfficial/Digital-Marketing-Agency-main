/* =========================================================
   NEXORA — HOME PAGE
   assets/js/index.js
   ========================================================= */

(() => {
    "use strict";


    /* =====================================================
       LOCAL HELPERS
       ===================================================== */

    const qs = (selector, scope = document) =>
        scope.querySelector(selector);

    const qsa = (selector, scope = document) =>
        Array.from(scope.querySelectorAll(selector));

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const hasFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;


    /* =====================================================
       INIT
       ===================================================== */

    document.addEventListener("DOMContentLoaded", () => {
        initHeroSlider();
        initHeroParallax();

        initServicesSlider();
        initProjectsSlider();
        initTeamSlider();
        initTestimonialsSlider();

        initFaqAccordion();
        initMediaParallax();

        initTrustedTabs();
        initTrustedStats();

        refreshLayoutAfterLoad();
    });


    /* =====================================================
       HERO SLIDER
       ===================================================== */

    function initHeroSlider() {
        const sliderElement = qs(".hero-preview-swiper");

        if (
            !sliderElement ||
            typeof window.Swiper === "undefined"
        ) {
            return;
        }

        const counter = qs("[data-hero-current]");
        const counterValue = counter
            ? qs("span", counter)
            : null;

        let counterTimers = [];


        const clearCounterTimers = () => {
            counterTimers.forEach((timer) => {
                window.clearTimeout(timer);
            });

            counterTimers = [];
        };


        const formatNumber = (index) => {
            return String(index + 1).padStart(2, "0");
        };


        const setCounter = (
            index,
            animate = true
        ) => {
            if (!counter || !counterValue) {
                return;
            }

            const nextValue = formatNumber(index);

            if (
                counterValue.textContent.trim() === nextValue
            ) {
                return;
            }


            clearCounterTimers();


            if (
                !animate ||
                prefersReducedMotion
            ) {
                counter.classList.remove(
                    "is-changing",
                    "is-entering"
                );

                counterValue.textContent = nextValue;

                return;
            }


            counter.classList.remove(
                "is-entering"
            );

            counter.classList.add(
                "is-changing"
            );


            const changeTimer = window.setTimeout(() => {
                counter.classList.remove(
                    "is-changing"
                );

                counterValue.textContent = nextValue;

                counter.classList.add(
                    "is-entering"
                );


                const finishTimer =
                    window.setTimeout(() => {
                        counter.classList.remove(
                            "is-entering"
                        );
                    }, 390);


                counterTimers.push(
                    finishTimer
                );
            }, 245);


            counterTimers.push(
                changeTimer
            );
        };


        new window.Swiper(
            sliderElement,
            {
                slidesPerView: 1,
                slidesPerGroup: 1,

                loop: true,

                speed:
                    prefersReducedMotion
                        ? 0
                        : 900,

                effect: "fade",

                fadeEffect: {
                    crossFade: true
                },

                allowTouchMove: true,

                grabCursor:
                    hasFinePointer,

                watchOverflow: false,

                observer: false,

                observeParents: false,

                updateOnWindowResize: true,

                autoplay: prefersReducedMotion
                    ? false
                    : {
                        delay: 4200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },

                on: {
                    init(swiper) {
                        setCounter(
                            swiper.realIndex,
                            false
                        );
                    },

                    realIndexChange(swiper) {
                        setCounter(
                            swiper.realIndex,
                            true
                        );
                    }
                }
            }
        );
    }


    /* =====================================================
       HERO MOUSE PARALLAX
       ONLY BACKGROUND GEOMETRY MOVES
       ===================================================== */

    function initHeroParallax() {
        const hero = qs(".hero");
        const pattern = qs(
            "[data-hero-parallax]",
            hero
        );

        if (
            !hero ||
            !pattern ||
            !hasFinePointer ||
            prefersReducedMotion
        ) {
            return;
        }


        let targetX = 0;
        let targetY = 0;

        let currentX = 0;
        let currentY = 0;

        let frameId = null;

        const strength = 11;


        const animate = () => {
            currentX +=
                (targetX - currentX) * 0.075;

            currentY +=
                (targetY - currentY) * 0.075;


            pattern.style.translate =
                `${currentX.toFixed(2)}px ` +
                `${currentY.toFixed(2)}px`;


            frameId =
                window.requestAnimationFrame(
                    animate
                );
        };


        hero.addEventListener(
            "pointermove",
            (event) => {
                const rect =
                    hero.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;


                targetX =
                    (x - 0.5) * strength * -1;

                targetY =
                    (y - 0.5) * strength * -1;
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
                animate
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
       SERVICES SWIPER
       ===================================================== */

    function initServicesSlider() {
        const element = qs(".services-swiper");

        if (
            !element ||
            typeof window.Swiper === "undefined"
        ) {
            return;
        }


        new window.Swiper(
            element,
            {
                slidesPerView: 1,
                slidesPerGroup: 1,

                spaceBetween: 16,

                loop: true,

                speed:
                    prefersReducedMotion
                        ? 0
                        : 760,

                watchOverflow: false,

                observer: false,

                observeParents: false,

                updateOnWindowResize: true,

                roundLengths: false,

                grabCursor:
                    hasFinePointer,

                autoplay: prefersReducedMotion
                    ? false
                    : {
                        delay: 3900,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },

                navigation: {
                    prevEl: ".services-prev",
                    nextEl: ".services-next"
                },

                pagination: {
                    el: ".services-progress",
                    type: "progressbar"
                },

                breakpoints: {
                    560: {
                        slidesPerView: 1.45,
                        spaceBetween: 16
                    },

                    760: {
                        slidesPerView: 2,
                        spaceBetween: 18
                    },

                    1080: {
                        slidesPerView: 2.5,
                        spaceBetween: 18
                    },

                    1280: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    }
                }
            }
        );
    }


    /* =====================================================
       PROJECTS SWIPER
       ===================================================== */

    function initProjectsSlider() {
        const element = qs(".projects-swiper");

        if (
            !element ||
            typeof window.Swiper === "undefined"
        ) {
            return;
        }


        new window.Swiper(
            element,
            {
                slidesPerView: 1,
                slidesPerGroup: 1,

                spaceBetween: 16,

                loop: true,

                speed:
                    prefersReducedMotion
                        ? 0
                        : 820,

                watchOverflow: false,

                observer: false,

                observeParents: false,

                updateOnWindowResize: true,

                grabCursor:
                    hasFinePointer,

                autoplay: prefersReducedMotion
                    ? false
                    : {
                        delay: 4400,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },

                navigation: {
                    prevEl: ".projects-prev",
                    nextEl: ".projects-next"
                },

                breakpoints: {
                    560: {
                        slidesPerView: 1.35,
                        spaceBetween: 16
                    },

                    760: {
                        slidesPerView: 2,
                        spaceBetween: 18
                    },

                    1100: {
                        slidesPerView: 2.5,
                        spaceBetween: 20
                    },

                    1320: {
                        slidesPerView: 3,
                        spaceBetween: 22
                    }
                }
            }
        );
    }


    /* =====================================================
       TEAM SWIPER
       MAX 3 VISIBLE SO LOOP REMAINS STABLE
       ===================================================== */

    function initTeamSlider() {
        const element = qs(".team-swiper");

        if (
            !element ||
            typeof window.Swiper === "undefined"
        ) {
            return;
        }


        new window.Swiper(
            element,
            {
                slidesPerView: 1,
                slidesPerGroup: 1,

                spaceBetween: 16,

                loop: true,

                speed:
                    prefersReducedMotion
                        ? 0
                        : 740,

                watchOverflow: false,

                observer: false,

                observeParents: false,

                updateOnWindowResize: true,

                grabCursor:
                    hasFinePointer,

                autoplay: prefersReducedMotion
                    ? false
                    : {
                        delay: 4100,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },

                navigation: {
                    prevEl: ".team-prev",
                    nextEl: ".team-next"
                },

                breakpoints: {
                    540: {
                        slidesPerView: 1.5,
                        spaceBetween: 16
                    },

                    760: {
                        slidesPerView: 2,
                        spaceBetween: 18
                    },

                    1100: {
                        slidesPerView: 2.5,
                        spaceBetween: 18
                    },

                    1280: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    }
                }
            }
        );
    }


    /* =====================================================
       TESTIMONIALS SWIPER
       ===================================================== */

    function initTestimonialsSlider() {
        const element = qs(
            ".testimonials-swiper"
        );

        if (
            !element ||
            typeof window.Swiper === "undefined"
        ) {
            return;
        }


        const avatar = qs(
            "[data-testimonial-avatar]"
        );

        const name = qs(
            "[data-testimonial-name]"
        );

        const role = qs(
            "[data-testimonial-role]"
        );


        let avatarTimer = null;


        const updatePerson = (
            swiper,
            animate = true
        ) => {
            const activeSlide =
                swiper.slides[
                    swiper.activeIndex
                ];

            if (!activeSlide) {
                return;
            }


            const nextAvatar =
                activeSlide.dataset.avatar;

            const nextName =
                activeSlide.dataset.name;

            const nextRole =
                activeSlide.dataset.role;


            if (name && nextName) {
                name.textContent =
                    nextName;
            }


            if (role && nextRole) {
                role.textContent =
                    nextRole;
            }


            if (
                !avatar ||
                !nextAvatar ||
                avatar.getAttribute("src") ===
                    nextAvatar
            ) {
                return;
            }


            if (
                !animate ||
                prefersReducedMotion
            ) {
                avatar.src = nextAvatar;

                return;
            }


            window.clearTimeout(
                avatarTimer
            );


            avatar.classList.add(
                "is-changing"
            );


            avatarTimer =
                window.setTimeout(() => {
                    avatar.src =
                        nextAvatar;


                    const removeFade =
                        () => {
                            avatar.classList.remove(
                                "is-changing"
                            );

                            avatar.removeEventListener(
                                "load",
                                removeFade
                            );
                        };


                    avatar.addEventListener(
                        "load",
                        removeFade
                    );


                    window.setTimeout(
                        removeFade,
                        350
                    );
                }, 180);
        };


        new window.Swiper(
            element,
            {
                slidesPerView: 1,
                slidesPerGroup: 1,

                loop: true,

                speed:
                    prefersReducedMotion
                        ? 0
                        : 760,

                autoHeight: false,

                watchOverflow: false,

                observer: false,

                observeParents: false,

                updateOnWindowResize: true,

                allowTouchMove: true,

                grabCursor:
                    hasFinePointer,

                autoplay: prefersReducedMotion
                    ? false
                    : {
                        delay: 5200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },

                navigation: {
                    prevEl:
                        ".testimonials-prev",

                    nextEl:
                        ".testimonials-next"
                },

                on: {
                    init(swiper) {
                        updatePerson(
                            swiper,
                            false
                        );
                    },

                    slideChangeTransitionStart(
                        swiper
                    ) {
                        updatePerson(
                            swiper,
                            true
                        );
                    }
                }
            }
        );
    }


    /* =====================================================
       FAQ ACCORDION
       ===================================================== */

    function initFaqAccordion() {
        const accordion = qs(
            "[data-accordion]"
        );

        if (!accordion) {
            return;
        }


        const items = qsa(
            ".faq-item",
            accordion
        );


        if (!items.length) {
            return;
        }


        items.forEach((item) => {
            const trigger = qs(
                ".faq-item__trigger",
                item
            );

            const panel = qs(
                ".faq-item__panel",
                item
            );


            if (!trigger || !panel) {
                return;
            }


            if (
                item.classList.contains(
                    "is-open"
                )
            ) {
                panel.hidden = false;

                trigger.setAttribute(
                    "aria-expanded",
                    "true"
                );
            } else {
                panel.hidden = true;

                trigger.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }


            trigger.addEventListener(
                "click",
                () => {
                    const isOpen =
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
                                closeFaqItem(
                                    otherItem
                                );
                            }
                        }
                    );


                    if (isOpen) {
                        closeFaqItem(item);
                    } else {
                        openFaqItem(item);
                    }
                }
            );
        });
    }


    function openFaqItem(item) {
        const trigger = qs(
            ".faq-item__trigger",
            item
        );

        const panel = qs(
            ".faq-item__panel",
            item
        );


        if (!trigger || !panel) {
            return;
        }


        item.classList.add(
            "is-open"
        );

        trigger.setAttribute(
            "aria-expanded",
            "true"
        );


        if (prefersReducedMotion) {
            panel.hidden = false;

            return;
        }


        panel.hidden = false;

        panel.style.height = "0px";
        panel.style.overflow = "hidden";

        panel.style.transition =
            "height 420ms " +
            "cubic-bezier(0.22, 1, 0.36, 1)";


        const targetHeight =
            panel.scrollHeight;


        window.requestAnimationFrame(
            () => {
                panel.style.height =
                    `${targetHeight}px`;
            }
        );


        const onTransitionEnd = (
            event
        ) => {
            if (
                event.propertyName !==
                "height"
            ) {
                return;
            }

            panel.style.height = "auto";
            panel.style.overflow = "";

            panel.removeEventListener(
                "transitionend",
                onTransitionEnd
            );
        };


        panel.addEventListener(
            "transitionend",
            onTransitionEnd
        );
    }


    function closeFaqItem(item) {
        const trigger = qs(
            ".faq-item__trigger",
            item
        );

        const panel = qs(
            ".faq-item__panel",
            item
        );


        if (!trigger || !panel) {
            return;
        }


        item.classList.remove(
            "is-open"
        );

        trigger.setAttribute(
            "aria-expanded",
            "false"
        );


        if (prefersReducedMotion) {
            panel.hidden = true;

            return;
        }


        const currentHeight =
            panel.scrollHeight;


        panel.style.height =
            `${currentHeight}px`;

        panel.style.overflow =
            "hidden";

        panel.style.transition =
            "height 360ms " +
            "cubic-bezier(0.4, 0, 0.2, 1)";


        panel.getBoundingClientRect();


        window.requestAnimationFrame(
            () => {
                panel.style.height =
                    "0px";
            }
        );


        const onTransitionEnd = (
            event
        ) => {
            if (
                event.propertyName !==
                "height"
            ) {
                return;
            }

            panel.hidden = true;

            panel.style.height = "";
            panel.style.overflow = "";

            panel.removeEventListener(
                "transitionend",
                onTransitionEnd
            );
        };


        panel.addEventListener(
            "transitionend",
            onTransitionEnd
        );
    }


    /* =====================================================
       IMAGE PARALLAX
       ===================================================== */

    function initMediaParallax() {
        const wrappers = qsa(
            "[data-parallax-media]"
        );


        if (
            !wrappers.length ||
            prefersReducedMotion
        ) {
            return;
        }


        const media = wrappers
            .map((wrapper) => {
                const image =
                    qs("img", wrapper);

                if (!image) {
                    return null;
                }

                return {
                    wrapper,
                    image
                };
            })
            .filter(Boolean);


        if (!media.length) {
            return;
        }


        let ticking = false;


        const update = () => {
            const viewportHeight =
                window.innerHeight;


            media.forEach(
                ({ wrapper, image }) => {
                    const rect =
                        wrapper.getBoundingClientRect();


                    if (
                        rect.bottom < 0 ||
                        rect.top > viewportHeight
                    ) {
                        return;
                    }


                    const center =
                        rect.top +
                        rect.height / 2;


                    const viewportCenter =
                        viewportHeight / 2;


                    const progress =
                        (
                            center -
                            viewportCenter
                        ) /
                        viewportHeight;


                    const offset =
                        Math.max(
                            -5,
                            Math.min(
                                5,
                                progress * -10
                            )
                        );


                    image.style.transform =
                        `translate3d(0, ` +
                        `${-7 + offset}%, 0)`;
                }
            );


            ticking = false;
        };


        const requestUpdate = () => {
            if (ticking) {
                return;
            }

            ticking = true;

            window.requestAnimationFrame(
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
       TRUSTED TABS
       ===================================================== */

    function initTrustedTabs() {
        const tabsWrap = qs(
            "[data-trusted-tabs]"
        );

        if (!tabsWrap) {
            return;
        }

        const tabs = qsa(
            "[data-trusted-tab]",
            tabsWrap
        );

        const panes = qsa(
            "[data-trusted-pane]"
        );

        if (
            !tabs.length ||
            !panes.length
        ) {
            return;
        }


        tabs.forEach((tab) => {
            tab.addEventListener(
                "click",
                () => {
                    if (
                        tab.classList.contains(
                            "is-active"
                        )
                    ) {
                        return;
                    }

                    const target =
                        tab.dataset.trustedTab;

                    tabs.forEach(
                        (otherTab) => {
                            const active =
                                otherTab === tab;

                            otherTab.classList.toggle(
                                "is-active",
                                active
                            );

                            otherTab.setAttribute(
                                "aria-selected",
                                active
                                    ? "true"
                                    : "false"
                            );
                        }
                    );

                    panes.forEach(
                        (pane) => {
                            const active =
                                pane.dataset.trustedPane ===
                                target;

                            pane.classList.toggle(
                                "is-active",
                                active
                            );

                            pane.hidden = !active;
                        }
                    );
                }
            );
        });
    }


    /* =====================================================
       TRUSTED STATS COUNT-UP
       ===================================================== */

    function initTrustedStats() {
        const values = qsa(
            "[data-count-to]"
        );

        if (!values.length) {
            return;
        }


        const animateValue = (element) => {
            const target = Number(
                element.dataset.countTo
            );

            if (
                !Number.isFinite(target) ||
                element.dataset.counted === "true"
            ) {
                return;
            }

            element.dataset.counted = "true";


            if (prefersReducedMotion) {
                element.textContent =
                    target.toLocaleString("en-US");

                return;
            }


            const duration = 1400;
            const startTime = performance.now();


            const step = (now) => {
                const progress = Math.min(
                    1,
                    (now - startTime) / duration
                );

                const eased =
                    1 - Math.pow(1 - progress, 3);

                const current = Math.round(
                    target * eased
                );

                element.textContent =
                    current.toLocaleString("en-US");

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };

            window.requestAnimationFrame(step);
        };


        if (!("IntersectionObserver" in window)) {
            values.forEach(animateValue);

            return;
        }


        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateValue(entry.target);

                        observer.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.6
            }
        );


        values.forEach((value) => {
            observer.observe(value);
        });
    }


    /* =====================================================
       FINAL LAYOUT REFRESH
       ===================================================== */

    function refreshLayoutAfterLoad() {
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
