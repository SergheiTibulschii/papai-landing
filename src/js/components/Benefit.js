import {Component} from 'bona';
import {magicBatchItemsAppear, magicMaskTextAppear} from "../lib/transitions";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';

export default class Benefit extends Component {
    constructor() {
        super(...arguments);

        this.header = this.el.querySelectorAll('.pa-benefit-header');
        this.body = this.el.querySelector('.pa-benefit-body');
        this.emojis = this.el.querySelector('.pa-benefit-emojis');
        this.emoji = this.emojis.querySelectorAll('g.emoji-group');
        this.emojiText = this.emojis.querySelectorAll('g:not(.emoji-group)');

        this.mm = gsap.matchMedia();
    }

    async onInit() {
        this.magicShow();
        this.mm.add('(min-width:768px)', () => {
            this.magicParallax();
            this.bindMagnetic();
        });
    }

    bindMagnetic() {
        this.emojiText.forEach((emoji) => {
            emoji.addEventListener('mouseenter', () => {
                this.rect = emoji.getBoundingClientRect();
                this.x = this.rect.left;
                this.y = this.rect.top;
            });

            emoji.addEventListener('mousemove', (e) => {
                const deltaX = (this.x + this.rect.width / 2) - e.clientX;
                const deltaY = (this.y + this.rect.height / 2) - e.clientY;

                this.move(emoji, deltaX, deltaY, 0.5);
            });

            emoji.addEventListener('mouseleave', (e) => {
                gsap.to(emoji, {
                    y: 0,
                    x: 0,
                    overwrite: true,
                    duration: 1,
                    ease: 'power3.out',
                });
            });
        });
    }

    move(elem, x, y, speed) {
        gsap.to(elem, {
            y: -y * 0.8,
            x: -x * 0.8,
            overwrite: true,
            duration: speed,
            ease: 'power2.out'
        });
    }

    magicShow() {
        if(this.header) magicMaskTextAppear(this.header, {position: 0});
        if(this.body) magicBatchItemsAppear(this.body, {position: 0});
    }

    magicParallax() {
        ScrollTrigger.create({
            trigger: this.emojis,
            animation: this.tlParallax(),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
        });
    }

    tlParallax() {
        const tl = new gsap.timeline();

        this.emoji.forEach((item, index) => {
            tl.set(item, {willChange: 'transform'}, 0);

            tl.fromTo(item, {
                y: index > (this.emoji.length / 2) ? '30%' : '-30%'
            }, {
                y: index > (this.emoji.length / 2) ? '-30%' : '30%',
                ease: 'none'
            }, 0);

            tl.set(item, {willChange: 'auto'});
        });

        return tl;
    }
}
