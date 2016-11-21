import {inject, useView} from 'aurelia-framework';
import {CustomHttpClient} from '../http';

@inject(CustomHttpClient)

export class Home {
    title = "Choose your home";

    constructor(http) {
        this.http = http;
    }

    activate() {
        this.http.fetch("/home")
            .then(response =>  response.json())
            .then(data => {
                this.homes = data.home;
            });
    }
}
