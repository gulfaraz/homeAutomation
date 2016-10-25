import {inject, useView} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {CustomHttpClient} from '../http';

@inject(CustomHttpClient, Router)

export class viewHome {

    constructor(http, router) {
        this.http = http;
        this.router = router;
    }

    activate(params) {
        this.http.fetch("/home/" + params.homeId)
            .then(response =>  response.json())
            .then(data => {
                this.home = data.home;
            });
    }

    removeHome() {
        this.http.fetch("/home/" + this.home._id, {
                method: "DELETE"
            })
            .then(response =>  response.json())
            .then(data => {
                console.log(data);
                this.router.navigateToRoute("home");
            });
    }
}
