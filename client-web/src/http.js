import {HttpClient, json} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import configuration from './auth-config';

@inject(AuthService)

export class CustomHttpClient extends HttpClient {
    constructor(auth) {
        super();
        this.configure(config => {
            config
                .withBaseUrl(configuration.baseUrl)
                .withDefaults({
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch'
                    }
                })
                .withInterceptor(auth.tokenInterceptor);
        });
    }
}
