import {inject, useView} from 'aurelia-framework';
import {CustomHttpClient} from '../http';

@inject(CustomHttpClient)

export class Home {
    title = "Networks";
    networkName = "";
    password = "";

    constructor(http) {
        this.http = http;
    }

    activate() {
        this.loadNetworks();
        setInterval(this.loadNetworks, 5000);
    }

    loadNetworks = (function (that) {
        return (function () {
            that.loading = true;
            that.http.fetch("/network")
                .then(response =>  response.json())
                .then(data => {
                    that.networks = data.networks.sort(function (a, b) {
                        return ((a.linked) ? -1 : ((b.linked) ? 1 : (a.ssid > b.ssid)));
                    });
                    that.loading = false;
                });
        });
    })(this);

    confirmNetworkLink(network) {
        this.networkName = network.ssid;
        this.password = null;
        this.showNetworkLinkForm = true;
    }

    cancelNetworkLink() {
        this.networkName = null;
        this.password = null;
        this.showNetworkLinkForm = false;
    }

    confirmNetworkUnlink(network) {
        this.networkName = network.ssid;
        this.networkId = network.id;
        this.showNetworkUnlinkForm = true;
    }

    cancelNetworkUnlink() {
        this.networkName = null;
        this.networkId = null;
        this.showNetworkUnlinkForm = false;
    }

    linkNetwork() {
        this.http.fetch("/network/link", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "networkName" : this.networkName, "password" : this.password })
            })
            .then(response =>  response.json())
            .then(data => {
                this.message = data.message;
                this.showNetworkLinkForm = false;
                if(!this.loading) {
                    this.loadNetworks();
                }
            });
    }

    unlinkNetwork() {
        this.http.fetch("/network/" + this.networkId, {
                method: "DELETE"
            })
            .then(response =>  response.json())
            .then(data => {
                this.message = data.message;
                this.showNetworkUnlinkForm = false;
                if(!this.loading) {
                    this.loadNetworks();
                }
            });
    }
}
