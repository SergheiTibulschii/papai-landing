import {Component} from 'bona';

export default class Navbar extends Component {
    constructor() {
        super(...arguments);

        /** @type {Layout} */
        this.layout = this.app.get('layout');

        this.toggleBtn = this.el.querySelector('.pa-navbar-toggle button');
        this.nav = this.el.querySelectorAll('.pa-navbar-nav');
        this.langToggle = this.el.querySelector('.pa-navbar-nav-toggle');
        this.navDropdown = this.el.querySelector('.pa-navbar-nav.-dropdown');
        this.dropwdown = this.el.querySelector('.pa-navbar-nav-dropdown');

        this.opened = false;

        this.bindToggle();
        this.bindNav();
    }

    bindNav() {
        this.langToggle.addEventListener('click', () => {
            this.langToggle.parentNode.classList.toggle('-visible');
        });

        document.addEventListener('click', (e) => {
            const isClickInside = this.dropwdown.contains(e.target) || this.navDropdown.contains(e.target);

            if(!isClickInside) {
                this.langToggle.parentNode.classList.remove('-visible');
            }
        });
    }

    bindToggle() {
        if (this.toggleBtn) this.toggleBtn.addEventListener('click', () => this.toggle());
        this.nav.forEach((nav) => {
            if(!nav.classList.contains('-dropdown')) {
                nav.addEventListener('click', () => this.hide());
            }
        });
    }

    toggle() {
        if (this.opened) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.opened = true;
        this.el.classList.add('-open');
        document.documentElement.classList.add('menu-open');
        this.layout.scrollDisable();
    }

    hide() {
        this.opened = false;
        this.el.classList.remove('-open');
        document.documentElement.classList.remove('menu-open');
        this.layout.scrollEnable();
    }
}
