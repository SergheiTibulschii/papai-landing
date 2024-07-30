import {Component} from 'bona';

export default class Modal extends Component {
    constructor() {
        super(...arguments);

        this.showTimeout = 30;
        this.hideTimeout = 600;
        this.dialog = this.el.querySelector('[data-modal-dialog]');

        this.bindCloses();
        this.bindOpens();
    }

    async onEnter() {
        if (window.location.hash && window.location.hash.substring(1) === this.el.id) this.show();
    }

    bindCloses() {
        this.el.querySelectorAll('[data-modal-close]').forEach((el) => {
            el.addEventListener('click', () => this.hide());
        });
    }

    bindOpens() {
        if (!this.el.id) return;

        this.app.queryAll(`[data-modal-open='#${this.el.id}']`).forEach((el) => {
            el.removeAttribute('data-modal-open');
            el.addEventListener('click', () => this.show());
        });
    }

    show() {
        this.trigger('show');
        this.app.trigger('modalShow', this);
        this.el.classList.add('-show');
        document.documentElement.classList.add('modal');
        clearInterval(this.visibleInt);
        this.visibleInt = setTimeout(() => {
            this.el.classList.add('-visible');
            this.trigger('showed');
            this.app.trigger('modalShowed', this);
        }, this.showTimeout);
    }

    hide() {
        this.trigger('hide');
        this.app.trigger('modalHide', this);
        this.el.classList.remove('-visible');
        clearInterval(this.visibleInt);
        this.visibleInt = setTimeout(() => {
            this.el.classList.remove('-show');
            document.documentElement.classList.remove('modal');
            this.trigger('hidden');
            this.app.trigger('modalHidden', this);
        }, this.hideTimeout);
    }
}
