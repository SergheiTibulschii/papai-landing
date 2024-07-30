import {Component} from 'bona';
import gsap from 'gsap';
import {itemsAppear, maskTextAppear} from "../lib/transitions";

export default class Hero extends Component {
    constructor() {
        super(...arguments);

        this.header = this.el.querySelector('.pa-hero-header h1');
        this.item = this.el.querySelectorAll('.pa-hero-item');
        this.img = this.el.querySelector('.pa-hero-img');

        this.currentIndex = 0;
    }

    async onInit() {
        this.handleEnter();
        this.textAnimationObserver();
    }

    async onEnter() {
        if (this.enterTl) await this.enterTl.play();
    }

    async onDestroy() {
        this.stopTextAnimation();
    }

    handleEnter() {
        this.enterTl = this.tlEnter();
    }

    tlEnter() {
        const tl = new gsap.timeline({paused: true, delay: 0});

        if(this.header) tl.add(maskTextAppear(this.header), 0);
        if(this.img) itemsAppear(this.img, {position: 0});
        if(this.item.length) tl.add(maskTextAppear(this.item), 0.25);

        return tl;
    }

    textAnimationObserver() {
        this.animationObserver = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) {
                this.stopTextAnimation();
            } else {
                this.startTextAnimation(); }
            }
        );
        this.animationObserver.observe(this.el);
    }

    stopTextAnimation() {
        clearInterval(this.timeoutID);
    }

    startTextAnimation() {
        this.timeoutID = setInterval(() => this.textAnimation(), 2500);
    }

    textAnimation() {
        this.currentIndex++;

        this.item.forEach((item) => {
            item.classList.remove('-active', '-last');
        });

        this.item[this.currentIndex === 0 ? this.item.length - 1 : this.currentIndex - 1].classList.add('-last');
        this.item[this.currentIndex].classList.add('-active');

        if (this.currentIndex === this.item.length - 1) {
            this.currentIndex = -1;
        }
    }
}
