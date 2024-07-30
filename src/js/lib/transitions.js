import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from '../vendor/gsap/SplitText';

gsap.registerPlugin(SplitText);

export const maskTextAppear = (el, options = {}) => {
    const opts = {
        type: 'words',
        duration: 2,
        stagger: {amount: 0.3},
        ease: 'expo.out',
        ...options,
    };
    const tl = new gsap.timeline();
    const split = new SplitText(el, {type: opts.type});
    const splitInner = new SplitText(split[opts.type], {type: opts.type});

    gsap.set(split[opts.type], {
        overflow: 'hidden',
        verticalAlign: 'top',
        padding: '0.10em',
        margin: '-0.10em',
    });

    gsap.set(splitInner[opts.type], {
        y: '110%',
    });

    tl.set(splitInner[opts.type], {
        willChange: 'transform',
    }, 0);

    tl.fromTo(splitInner[opts.type], {
        y: '120%',
    }, {
        y: '0%',
        duration: opts.duration,
        stagger: opts.stagger,
        ease: opts.ease,
    }, 0);

    tl.set(splitInner[opts.type], {
        willChange: 'auto',
    });

    return tl;
};

export const magicMaskTextAppear = (el, options = {}) => {
    return ScrollTrigger.create({
        trigger: el,
        animation: maskTextAppear(el, options),
        start: options.start ?? "top bottom"
    });
};

export const itemsAppear = (el, options = {}) => {
    const opts = {
        position: 0,
        y: 60,
        duration: 2.6,
        stagger: {amount: 0.2},
        ease: 'expo.out',
        ...options,
    };
    const tl = new gsap.timeline();

    tl.set(el, {
        willChange: 'transform',
    }, 0);

    tl.fromTo(el, {
        y: opts.y,
        opacity: 0,
    }, {
        y: 0,
        opacity: 1,
        duration: opts.duration,
        stagger: opts.stagger,
        ease: opts.ease,
    }, opts.position);

    tl.set(el, {
        willChange: 'auto',
    });

    return tl;
};

export const magicBatchItemsAppear = (els, options = {}, batchOptions = {}) => {
    if (els.length) gsap.set(els, {opacity: 0});
    return ScrollTrigger.batch(els, {
        onEnter: (el) => itemsAppear(el, options),
        once: true,
        ...batchOptions,
    });
};

export const imageAppear = (el, options = {}) => {
    const tl = new gsap.timeline();

    tl.fromTo(el, {
        opacity: 0,
    }, {
        opacity: 1,
        duration: options.duration ?? 1.6,
        ease: 'expo.out',
    }, options.position ?? 0);

    return tl;
};

export const magicImageAppear = (el, options = {}) => {
    return ScrollTrigger.create({
        trigger: el ?? options.triggerEl,
        animation: imageAppear(el, options),
        start: options.start ?? "top bottom"
    });
};
