import {Component} from 'bona';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import Lenis from '@studio-freight/lenis';
import i18next from "i18next";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default class Layout extends Component {
    constructor() {
        super(...arguments);

        this.initLenis();
        this.bindScrollToElements();
    }

    async onEnter() {
        ScrollTrigger.refresh();
    }

    async onComplete() {
        this.loadLazyMedia();
    }

    async onLeave() {
        this.scrollEnable();
    }

    async onRefresh() {
        this.flushLenis();
        ScrollTrigger.clearMatchMedia();
        ScrollTrigger.killAll();
        ScrollTrigger.clearScrollMemory();
    }

    bindScrollToElements() {
        document.body.addEventListener('click', (e) => {
            for (let target = e.target; target && target !== document.body; target = target.parentNode) {
                if (target.dataset.scrollTo || target.dataset.scrollToTarget) {
                    const options = target.dataset.scrollToOptions ? JSON.parse(target.dataset.scrollToOptions) : undefined;
                    if (target.dataset.scrollToTarget) {
                        if (this.scrollToTarget(target.dataset.scrollToTarget, options)) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    } else {
                        if (this.scrollTo(target.dataset.scrollTo, 0, options)) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    }
                }
            }
        });
    }

    initLenis() {
        this.lenis = new Lenis({
            autoResize: true,
            duration: 2,
            wheelMultiplier: 0.75,
            touchInertiaMultiplier: 0.75,
            touchMultiplier: 0.75,
        });
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => this.lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    flushLenis() {
        if (!this.lenis) return;

        this.lenis.stop();
        this.lenis.start();
    }

    scrollEnable() {
        if (this.lenis) this.lenis.start();
        document.documentElement.classList.remove('no-scroll');
    }

    scrollDisable() {
        if (this.lenis) this.lenis.stop();
        document.documentElement.classList.add('no-scroll');
    }

    scrollTop() {
        return this.lenis ? this.lenis.actualScroll : window.scrollY;
    }

    scrollLeft() {
        return window.scrollX;
    }

    scrollHeight() {
        return this.lenis ? this.lenis.limit : document.documentElement.scrollHeight;
    }

    scrollWidth() {
        return document.documentElement.scrollWidth;
    }

    scrollTo(y, x = 0, options = {}) {
        const opts = {
            offsetY: 0,
            offsetX: 0,
            duration: 1,
            ...options,
        };

        y += opts.offsetY;
        x += opts.offsetX;

        this.flushLenis();

        if (opts.duration) {
            gsap.to(window, {
                scrollTo: {y, x, autoKill: false},
                ease: opts.ease,
                duration: opts.duration,
                onComplete: opts.onComplete,
            });
        } else {
            window.scrollTo({top: y, left: x, behavior: 'instant'});
        }

        return true;
    }

    scrollToTarget(selector, options) {
        const target = this.app.query(selector);

        if (!target) return false;

        const cs = getComputedStyle(target);
        const rect = target.getBoundingClientRect();
        const y = rect.top + this.scrollTop() - parseInt(cs.scrollMarginTop);
        const x = rect.left + this.scrollLeft() - parseInt(cs.scrollMarginLeft);

        return this.scrollTo(y, x, options);
    }

    loadLazyMedia() {
        this.app.queryAll('[loading=lazy]').forEach((el) => el.setAttribute('loading', 'eager'));
    }
}
