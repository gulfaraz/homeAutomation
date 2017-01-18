import {inject, useView} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import {CustomHttpClient} from '../http';

@inject(CustomHttpClient, Router)

export class Home {
    title = "Select Home";

    constructor(http, router) {
        this.http = http;
        this.router = router;
    }

    activate() {
        this.http.fetch("/home")
            .then(response =>  response.json())
            .then(data => {
                this.homes = data.home;
            });
    }

    enterHome(homeId) {
        this.router.navigateToRoute("home");
        this.router.navigateToRoute("viewHome", { "homeId" : homeId });
    }
}
