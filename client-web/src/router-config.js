import {AuthorizeStep} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)

export default class {

    constructor(router) {
        this.router = router;
    };

    configure() {

        var appRouterConfig = function(config) {
            config.title = 'Home Automation';
            config.addPipelineStep('authorize', AuthorizeStep);
            config.map([
                {
                    route: ['','home'],
                    name: 'home',
                    moduleId: 'home/home',
                    title: 'Home',
                    auth: true
                },
                {
                    route: 'home/new',
                    name: 'newHome',
                    moduleId: 'home/newHome',
                    title: 'Add Home',
                    auth: true
                },
                {
                    route: 'home/:homeId',
                    name: 'viewHome',
                    moduleId: 'home/viewHome',
                    title: 'View Home',
                    auth: true
                },
                {
                    route: 'login',
                    name: 'login',
                    moduleId: 'login/login',
                    title: 'Login'
                },
                {
                    route: 'logout',
                    name: 'logout',
                    moduleId: 'logout/logout',
                    title: 'Logout'
                },
                {
                    route: 'device',
                    name: 'device',
                    moduleId: 'device/device',
                    title: 'Device'
                },
                {
                    route: 'contact',
                    name: 'contact',
                    moduleId: 'contact/contact',
                    title: 'Contact'
                },
                {
                    route: 'privacy',
                    name: 'privacy',
                    moduleId: 'privacy/privacy',
                    title: 'Privacy Policy'
                },
                {
                    route: 'faq',
                    name: 'faq',
                    moduleId: 'faq/faq',
                    title: 'FAQ'
                }
            ]);
        };

        this.router.configure(appRouterConfig);
    };
}
