import {inject, useView} from 'aurelia-framework';
import {CustomHttpClient} from '../http';

@inject(CustomHttpClient)

export class viewHome {

    constructor(http) {
        this.http = http;
    }

    activate(params) {
        this.http.fetch("/home/" + params.homeId)
            .then(response =>  response.json())
            .then(data => {
                this.home = data.home;
            });
    }
}
