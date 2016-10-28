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
                this.message = data.message;
                if(data.home) {
                    this.home = data.home;
                }
            });
    }

    removeHome() {
        this.http.fetch("/home/" + this.home._id, {
                method: "DELETE"
            })
            .then(response =>  response.json())
            .then(data => {
                this.message = data.message;
                this.router.navigateToRoute("home");
            });
    }

    addRoom() {
        this.http.fetch("/home/" + this.home._id + "/room/newRoom", {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "roomName" : this.newRoomName })
            })
            .then(response =>  response.json())
            .then(data => {
                this.message = data.message;
                if(data.home) {
                    this.home = data.home;
                    this.newRoomName = "";
                }
            });
    }

    removeRoom(roomId) {
        this.http.fetch("/home/" + this.home._id + "/room/" + roomId, {
                method: "DELETE"
            })
            .then(response =>  response.json())
            .then(data => {
                this.message = data.message;
                if(data.home) {
                    this.home = data.home;
                }
            });
    }

    addTerminal(roomId) {
        this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/newTerminal", {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "terminalName" : this.newTerminalName, "terminalType" : this.newTerminalType })
            })
            .then(response =>  response.json())
            .then(data => {
                this.message = data.message;
                if(data.home) {
                    this.home = data.home;
                    this.newTerminalName = "";
                    this.newTerminalType = "";
                }
            });
    }

    removeTerminal(roomId, terminalId) {
        this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId, {
                method: "DELETE"
            })
            .then(response =>  response.json())
            .then(data => {
                this.message = data.message;
                if(data.home) {
                    this.home = data.home;
                }
            });
    }

    setTerminalState(roomId, terminalId, state) {
        this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/" + state, {
                method: "GET"
            })
            .then(response =>  response.json())
            .then(data => {
                this.message = data.message;
                if(data.home) {
                    this.home = data.home;
                }
            });
    }
}
