import {Component} from 'bona';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import MouseFollower from 'mouse-follower';

MouseFollower.registerGSAP(gsap);

export default class Cursor extends Component {
    constructor() {
        super(...arguments);

        this.initFollower();
    }

    async onLeave() {
        if (!this.follower) return;

        this.follower.removeIcon();
        this.follower.removeText();
        this.follower.removeImg();
        this.follower.removeVideo();
        this.follower.removeState('-pointer');
    }

    initFollower() {
        if (ScrollTrigger.isTouch) return;

        this.follower = new MouseFollower({
            className: 'pa-cursor',
            innerClassName: 'pa-cursor-inner',
            textClassName: 'pa-cursor-text',
            mediaClassName: 'pa-cursor-media',
            mediaBoxClassName: 'pa-cursor-media-box',
            iconSvgClassName: 'pa-svgsprite',
            iconSvgSrc: '/assets/sprites/svgsprites.svg'
        });
    }
}
