//export class App {
//    configureRouter(config, router) {
//        this.router = router;
//        config.title = "Home Automation";
//        config.map([
//            {
//                route: ["", "home"],
//                name: "home",
//                moduleId: "home/home"
//            },
//            {
//                route: "login",
//                name: "login",
//                moduleId: "login/login"
//            }
//        ]);
//    }
//}


import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {FetchConfig} from 'aurelia-auth';
import AppRouterConfig from 'router-config';

// Using Aurelia's dependency injection, we inject Aurelia's router,
// the aurelia-auth http client config, and our own router config
// with the @inject decorator
@inject(Router, FetchConfig, AppRouterConfig)

export class App {

  constructor(router, fetchConfig, appRouterConfig) {

    this.router = router;

    // Client configuration provided by the aureliauth plugin
    this.fetchConfig = fetchConfig;

    // The application's configuration, including the
    // route definitions that we've declared in router-config.js
    this.appRouterConfig = appRouterConfig;
  };

  activate() {

    // Here we run the configuration when the app loads
    console.log(this.fetchConfig);
    this.fetchConfig.configure();
    this.appRouterConfig.configure();

  };
}