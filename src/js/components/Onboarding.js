import {Component} from 'bona';
import {magicBatchItemsAppear} from "../lib/transitions";

export default class Onboarding extends Component {
    constructor() {
        super(...arguments);

        this.header = this.el.querySelector('.pa-onboarding-header');
        this.item = this.el.querySelectorAll('.pa-onboarding-item');
    }

    async onInit() {
        this.magicShow();
    }

    magicShow() {
        if(this.header) magicBatchItemsAppear(this.header, {position: 0});
        if(this.item.length) magicBatchItemsAppear(this.item, {position: 0});
    }
}
