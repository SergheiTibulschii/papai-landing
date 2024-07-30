import {Component} from 'bona';
import {magicBatchItemsAppear} from "../lib/transitions";

export default class Feature extends Component {
    constructor() {
        super(...arguments);

        this.item = this.el.querySelectorAll('.pa-feature-item');
    }

    async onInit() {
        this.magicShow();
    }

    magicShow() {
        if(this.item.length) magicBatchItemsAppear(this.item, {position: 0});
    }
}
