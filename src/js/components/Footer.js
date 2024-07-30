import {Component} from 'bona';
import {magicBatchItemsAppear} from "../lib/transitions";

export default class Footer extends Component {
    constructor() {
        super(...arguments);

        this.language = this.el.querySelectorAll('.pa-footer-language');
        this.content = this.el.querySelector('.pa-footer-content');

        this.bindLanguages();
    }

    async onInit() {
        this.magicShow();
    }

    magicShow() {
        if(this.content) magicBatchItemsAppear(this.content, {position: 0});
    }

    bindLanguages() {
        this.language.forEach((lang) => {
            lang.addEventListener('click', () => {
                this.language.forEach((el) => el.classList.remove('-active'));
                lang.classList.add('-active');
            });
        });
    }
}
