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
                    title:'Home',
                    auth: true
                },
                {
                    route: 'home/new',
                    name: 'newHome',
                    moduleId: 'home/newHome',
                    title:'Login',
                    auth: true
                },
                {
                    route: 'login',
                    name: 'login',
                    moduleId: 'login/login',
                    title:'Login'
                },
                {
                    route: 'logout',
                    name: 'logout',
                    moduleId: 'logout/logout',
                    title:'Logout'
                }
            ]);
        };

        this.router.configure(appRouterConfig);
    };
}
