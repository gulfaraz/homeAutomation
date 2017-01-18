import {inject, useView} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import dialogPolyfill from 'dialog-polyfill';
import {CustomHttpClient} from '../http';

@inject(CustomHttpClient, Router, dialogPolyfill)

export class viewHome {

    show = {
        roomList : {},
        setRoom : (roomId, show) => {
            this.show.roomList[roomId] = show;
            return this.show.roomList[roomId];
        },
        toggleRoom : (roomId) => {
            this.show.roomList[roomId] = !this.show.roomList[roomId];
            return this.show.roomList[roomId];
        }
    };

    confirm = {
        message : "",
        warn : "",
        button : {
            label : "Confirm",
            action : () => {}
        }
    };

    constructor(http, router, dialogPolyfill) {
        this.http = http;
        this.router = router;
        this.dialogPolyfill = dialogPolyfill;
    }

    activate(params) {
        this.http.fetch("/home/" + params.homeId)
            .then(response =>  response.json())
            .then(data => {
                this.showMessage(data.message);
                if(data.home) {
                    this.home = data.home;
                }
            });
    }

    attached() {
        this.dialogPolyfill.registerDialog(this.addRoomDialog);
        this.dialogPolyfill.registerDialog(this.addTerminalDialog);
        this.dialogPolyfill.registerDialog(this.confirmDialog);
    }

    removeHome() {
        this.http.fetch("/home/" + this.home._id, {
                method: "DELETE"
            })
            .then(response =>  response.json())
            .then(data => {
                this.showMessage(data.message);
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
                this.showMessage(data.message);
                if(data.home) {
                    this.home = data.home;
                    this.newRoomName = "";
                    this.closeAddRoomDialog();
                }
            });
    }

    removeRoom(roomId) {
        this.http.fetch("/home/" + this.home._id + "/room/" + roomId, {
                method: "DELETE"
            })
            .then(response =>  response.json())
            .then(data => {
                this.showMessage(data.message);
                if(data.home) {
                    this.home = data.home;
                    this.confirmDialog.close();
                }
            });
    }

    addTerminal() {
        this.http.fetch("/home/" + this.home._id + "/room/" + this.currentRoom + "/terminal/newTerminal", {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "terminalName" : this.newTerminalName, "terminalType" : this.newTerminalType })
            })
            .then(response =>  response.json())
            .then(data => {
                this.showMessage(data.message);
                if(data.home) {
                    this.home = data.home;
                    this.newTerminalName = "";
                    this.newTerminalType = "";
                    this.closeAddTerminalDialog();
                }
            });
    }

    unlinkTerminal(roomId, terminalId) {
        this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/unlink", {
                method: "GET"
            })
            .then(response =>  response.json())
            .then(data => {
                this.showMessage(data.message);
                if(data.home) {
                    this.home = data.home;
                    this.confirmDialog.close();
                }
            });
    }

    refreshTerminal(roomId, terminalId) {
        this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/refresh", {
                method: "GET"
            })
            .then(response =>  response.json())
            .then(data => {
                this.showMessage(data.message);
                if(data.home) {
                    this.home = data.home;
                }
            });
    }

    removeTerminal(roomId, terminalId) {
        this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId, {
                method: "DELETE"
            })
            .then(response =>  response.json())
            .then(data => {
                this.showMessage(data.message);
                if(data.home) {
                    this.home = data.home;
                    this.confirmDialog.close();
                }
            });
    }

    setTerminalState(roomId, terminalId, state) {
        this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/" + state, {
                method: "GET"
            })
            .then(response =>  response.json())
            .then(data => {
                this.showMessage(data.message);
                if(data.home) {
                    this.home = data.home;
                }
            });
    }

    toggleTerminalState(roomId, terminal) {
        terminal.state = !terminal.state;
        this.setTerminalState(roomId, terminal._id, (terminal.state ? "on" : "off"));
    }

    showAddTerminalDialog(roomId) {
        this.currentRoom = roomId;
        this.addTerminalDialog.showModal();
    }

    closeAddTerminalDialog() {
        this.currentRoom = null;
        this.newTerminalName = "";
        this.newTerminalType = "";
        this.addTerminalDialog.close();
    }

    closeAddRoomDialog() {
        this.newRoomName = "";
        this.addRoomDialog.close();
    }

    showConfirmDialog(type, object) {
        let that = this;
        if(type === "home") {
            this.confirm = {
                message : "Are you sure you want to delete Home " + object.homeName + " ?",
                warn : "This action cannot be undone. You will lose access to all rooms and terminals assigned to this Home.",
                button : {
                    label : "DELETE",
                    action : ((that) => {
                        return (() => {
                            that.removeHome();
                        });
                    })(that)
                }
            };
        } else if(type === "room") {
            this.confirm = {
                message : "Are you sure you want to delete Room " + object.roomName + " ?",
                warn : "This action cannot be undone. You will lose access to all terminals assigned to this Room.",
                button : {
                    label : "DELETE",
                    action : ((that, roomId) => {
                        return (() => {
                            that.removeRoom(roomId);
                        });
                    })(that, object._id)
                }
            };
        } else if (type === "terminal-unlink") {
            this.confirm = {
                message : "Are you sure you want to unlink Terminal " + object.terminal.terminalName + " (" + object.terminal.type + ") ?",
                warn : "This action cannot be undone. You will lose access to the switch from this Terminal.",
                button : {
                    label : "UNLINK",
                    action : ((that, roomId, terminalId) => {
                        return (() => {
                            that.unlinkTerminal(roomId, terminalId)
                        });
                    })(that, object.room._id, object.terminal._id)
                }
            };
        } else if (type === "terminal-remove") {
            this.confirm = {
                message : "Are you sure you want to delete Terminal " + object.terminal.terminalName + " (" + object.terminal.type + ") ?",
                warn : "This action cannot be undone. You will lose access to the switch from this Terminal.",
                button : {
                    label : "DELETE",
                    action : ((that, roomId, terminalId) => {
                        return (() => {
                            this.removeTerminal(roomId, terminalId);
                        });
                    })(that, object.room._id, object.terminal._id)
                }
            };
        }
        this.confirmDialog.showModal();
    }

    closeConfirmDialog() {
        this.confirmDialog.close();
    }

    showMessage(message) {
        if(this.toastContainer) {
            this.toastContainer.MaterialSnackbar.showSnackbar({ message : message });
        }
    }
}
