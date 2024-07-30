import {Component} from 'bona';

export default class Loader extends Component {
    constructor() {
        super(...arguments);
    }

    async onInit() {
        await new Promise((resolve) => setTimeout(resolve, 200)); // fake delay before enter
    }

    async onRefresh() {
        await new Promise((resolve) => setTimeout(resolve, 200)); // fake delay on refresh
    }

    async onEnter() {
        requestAnimationFrame(() => this.hide());
    }

    async onLeave() {
        this.show();
        await new Promise((resolve) => setTimeout(resolve, 300)); // fake delay before leave
    }

    show() {
        this.el.classList.add('-visible');
    }

    hide() {
        this.el.classList.remove('-visible');
    }
}
