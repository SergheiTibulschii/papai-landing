import {Component} from 'bona';
import {magicMaskTextAppear, magicBatchItemsAppear} from "../lib/transitions";

export default class Brief extends Component {
    constructor() {
        super(...arguments);

        this.header = this.el.querySelector('.pa-brief-header');
        this.img = this.el.querySelector('.pa-brief-img');
        this.action = this.el.querySelector('.pa-brief-action');
    }

    async onInit() {
        // this.magicShow();
    }

    magicShow() {
        if(this.header) magicMaskTextAppear(this.header, {position: 0});
        if(this.img) magicBatchItemsAppear(this.img, {position: 0.1});
        if(this.action) magicBatchItemsAppear(this.action, {position: 0.1});
    }
}
