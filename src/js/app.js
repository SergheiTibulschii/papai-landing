import Bona from 'bona';
//import {Ajax} from 'bona';

import Layout from './components/Layout';
//import Cursor from './components/Cursor';
import Loader from './components/Loader';
import Button from './components/Button';
//import Modal from './components/Modal';
import Navbar from './components/Navbar';

import Hero from './components/Hero';
import Feature from './components/Feature';
import Brief from './components/Brief';
import Onboarding from './components/Onboarding';
import Benefit from './components/Benefit';
import Footer from './components/Footer';

const app = new Bona({
    define: [
        // {
        //     namespace: 'ajax',
        //     component: Ajax,
        //     options: {
        //         updateSelectors: ['title', 'meta', '#view-main']
        //     }
        // },
        {
            namespace: 'layout',
            component: Layout,
        },
        // {
        //     namespace: 'cursor',
        //     component: Cursor
        // },
        {
            namespace: 'loader',
            assign: '.pa-loader',
            component: Loader,
        },
        {
            namespace: 'button',
            assign: '.pa-btn',
            component: Button,
        },
        // {
        //     namespace: 'modal',
        //     assign: '.pa-modal',
        //     component: Modal,
        // },
        {
            namespace: 'navbar',
            assign: '.pa-navbar',
            component: Navbar,
        },
        {
            namespace: 'hero',
            assign: '.pa-hero',
            component: Hero,
        },
        {
            namespace: 'feature',
            assign: '.pa-feature',
            component: Feature,
        },
        {
            namespace: 'brief',
            assign: '.pa-brief',
            component: Brief,
        },
        {
            namespace: 'onboarding',
            assign: '.pa-onboarding',
            component: Onboarding,
        },
        {
            namespace: 'benefit',
            assign: '.pa-benefit',
            component: Benefit,
        },
        {
            namespace: 'footer',
            assign: '.pa-footer',
            component: Footer,
        }
    ]
});
