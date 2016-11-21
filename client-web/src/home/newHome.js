import {inject, useView} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {CustomHttpClient} from '../http';

@inject(CustomHttpClient, Router)

export class newHome {

    title = "Add new home";
    homeName = "";
    address = "";

    constructor(http, router) {
        this.http = http;
        this.router = router;
    }

    add() {
        this.http.fetch("/home/newHome", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "homeName" : this.homeName, "address" : this.address})
            })
            .then(response =>  response.json())
            .then(data => {
                this.message = data.message;
                if(data.home) {
                    this.router.navigateToRoute("viewHome", { homeId: data.home._id });
                }
            });
    }
}
