define('app',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-auth', 'router-config'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaAuth, _routerConfig) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    var _routerConfig2 = _interopRequireDefault(_routerConfig);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _aureliaAuth.FetchConfig, _routerConfig2.default), _dec(_class = function () {
        function App(router, fetchConfig, appRouterConfig) {
            _classCallCheck(this, App);

            this.router = router;
            this.fetchConfig = fetchConfig;
            this.appRouterConfig = appRouterConfig;
        }

        App.prototype.activate = function activate() {
            this.fetchConfig.configure();
            this.appRouterConfig.configure();
        };

        return App;
    }()) || _class);
});
define('auth-config',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var config = {
        baseUrl: 'http://raidms.com:8080',
        loginUrl: 'login',
        tokenName: 'token',
        loginRedirect: '#/'
    };

    exports.default = config;
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('http',['exports', 'aurelia-fetch-client', 'aurelia-framework', 'aurelia-auth', './auth-config'], function (exports, _aureliaFetchClient, _aureliaFramework, _aureliaAuth, _authConfig) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.CustomHttpClient = undefined;

    var _authConfig2 = _interopRequireDefault(_authConfig);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _dec, _class;

    var CustomHttpClient = exports.CustomHttpClient = (_dec = (0, _aureliaFramework.inject)(_aureliaAuth.AuthService), _dec(_class = function (_HttpClient) {
        _inherits(CustomHttpClient, _HttpClient);

        function CustomHttpClient(auth) {
            _classCallCheck(this, CustomHttpClient);

            var _this = _possibleConstructorReturn(this, _HttpClient.call(this));

            _this.configure(function (config) {
                config.withBaseUrl(_authConfig2.default.baseUrl).withDefaults({
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch'
                    }
                }).withInterceptor(auth.tokenInterceptor);
            });
            return _this;
        }

        return CustomHttpClient;
    }(_aureliaFetchClient.HttpClient)) || _class);
});
define('main',['exports', './environment', './auth-config', 'material-design-lite'], function (exports, _environment, _authConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  var _authConfig2 = _interopRequireDefault(_authConfig);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().plugin('aurelia-auth', function (baseConfig) {
      baseConfig.configure(_authConfig2.default);
    }).plugin('aurelia-mdl-plugin').feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('router-config',['exports', 'aurelia-auth', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaAuth, _aureliaFramework, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var _default = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
        function _default(router) {
            _classCallCheck(this, _default);

            this.router = router;
        }

        _default.prototype.configure = function configure() {

            var appRouterConfig = function appRouterConfig(config) {
                config.title = 'Home Automation';
                config.addPipelineStep('authorize', _aureliaAuth.AuthorizeStep);
                config.map([{
                    route: ['', 'home'],
                    name: 'home',
                    moduleId: 'home/home',
                    title: 'Home',
                    auth: true
                }, {
                    route: 'home/new',
                    name: 'newHome',
                    moduleId: 'home/newHome',
                    title: 'Add Home',
                    auth: true
                }, {
                    route: 'home/:homeId',
                    name: 'viewHome',
                    moduleId: 'home/viewHome',
                    title: 'View Home',
                    auth: true
                }, {
                    route: 'login',
                    name: 'login',
                    moduleId: 'login/login',
                    title: 'Login'
                }, {
                    route: 'logout',
                    name: 'logout',
                    moduleId: 'logout/logout',
                    title: 'Logout'
                }, {
                    route: 'device',
                    name: 'device',
                    moduleId: 'device/device',
                    title: 'Device'
                }, {
                    route: 'contact',
                    name: 'contact',
                    moduleId: 'contact/contact',
                    title: 'Contact'
                }, {
                    route: 'privacy',
                    name: 'privacy',
                    moduleId: 'privacy/privacy',
                    title: 'Privacy Policy'
                }, {
                    route: 'faq',
                    name: 'faq',
                    moduleId: 'faq/faq',
                    title: 'FAQ'
                }]);
            };

            this.router.configure(appRouterConfig);
        };

        return _default;
    }()) || _class);

    exports.default = _default;
});
define('contact/contact',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Contact = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Contact = exports.Contact = function Contact() {
        _classCallCheck(this, Contact);

        this.title = "Talk to us!";
    };
});
define('device/device',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Device = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Device = exports.Device = function Device() {
        _classCallCheck(this, Device);

        this.title = "Configure Your HomeConnect Device";
    };
});
define('faq/faq',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Faq = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Faq = exports.Faq = function Faq() {
        _classCallCheck(this, Faq);

        this.title = "Frequently Asked Questions";
        this.faqs = [{
            question: "What is HomeConnect ?",
            answer: "HomeConnect is a home automation system built by Gulfaraz Yasin because the fat in his body has taken control of his body and mind.",
            link: {}
        }, {
            question: "What is Home Automation ?",
            answer: "Click the following link to discover home automation",
            link: {
                url: "https://en.wikipedia.org/wiki/Home_automation",
                title: "Home Automation"
            }
        }, {
            question: "What to eat ?",
            answer: "Follow the link below",
            link: {
                url: "http://www.reciperoulette.tv/",
                title: "Recipe Roulette"
            }
        }];
    };
});
define('home/home',['exports', 'aurelia-framework', 'aurelia-router', '../http'], function (exports, _aureliaFramework, _aureliaRouter, _http) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Home = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_http.CustomHttpClient, _aureliaRouter.Router), _dec(_class = function () {
        function Home(http, router) {
            _classCallCheck(this, Home);

            this.title = "Select Home";

            this.http = http;
            this.router = router;
        }

        Home.prototype.activate = function activate() {
            var _this = this;

            this.http.fetch("/home").then(function (response) {
                return response.json();
            }).then(function (data) {
                _this.homes = data.home;
            });
        };

        Home.prototype.enterHome = function enterHome(homeId) {
            this.router.navigateToRoute("home");
            this.router.navigateToRoute("viewHome", { "homeId": homeId });
        };

        return Home;
    }()) || _class);
});
define('home/newHome',['exports', 'aurelia-framework', 'aurelia-router', '../http'], function (exports, _aureliaFramework, _aureliaRouter, _http) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.newHome = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var newHome = exports.newHome = (_dec = (0, _aureliaFramework.inject)(_http.CustomHttpClient, _aureliaRouter.Router), _dec(_class = function () {
        function newHome(http, router) {
            _classCallCheck(this, newHome);

            this.title = "Add Home";
            this.homeName = "";
            this.address = "";

            this.http = http;
            this.router = router;
        }

        newHome.prototype.add = function add() {
            var _this = this;

            this.http.fetch("/home/newHome", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "homeName": this.homeName, "address": this.address })
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this.message = data.message;
                if (data.home) {
                    _this.router.navigateToRoute("viewHome", { homeId: data.home._id });
                }
                _this.dialog.showModal();
            });
        };

        newHome.prototype.closeDialog = function closeDialog() {
            this.message = "";
            this.dialog.close();
        };

        return newHome;
    }()) || _class);
});
define('home/viewHome',['exports', 'aurelia-framework', 'aurelia-router', 'dialog-polyfill', '../http'], function (exports, _aureliaFramework, _aureliaRouter, _dialogPolyfill, _http) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.viewHome = undefined;

    var _dialogPolyfill2 = _interopRequireDefault(_dialogPolyfill);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var viewHome = exports.viewHome = (_dec = (0, _aureliaFramework.inject)(_http.CustomHttpClient, _aureliaRouter.Router, _dialogPolyfill2.default), _dec(_class = function () {
        function viewHome(http, router, dialogPolyfill) {
            var _this = this;

            _classCallCheck(this, viewHome);

            this.show = {
                roomList: {},
                setRoom: function setRoom(roomId, show) {
                    _this.show.roomList[roomId] = show;
                    return _this.show.roomList[roomId];
                },
                toggleRoom: function toggleRoom(roomId) {
                    _this.show.roomList[roomId] = !_this.show.roomList[roomId];
                    return _this.show.roomList[roomId];
                }
            };
            this.confirm = {
                message: "",
                warn: "",
                button: {
                    label: "Confirm",
                    action: function action() {}
                }
            };

            this.http = http;
            this.router = router;
            this.dialogPolyfill = dialogPolyfill;
        }

        viewHome.prototype.activate = function activate(params) {
            var _this2 = this;

            this.http.fetch("/home/" + params.homeId).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this2.showMessage(data.message);
                if (data.home) {
                    _this2.home = data.home;
                }
            });
        };

        viewHome.prototype.attached = function attached() {
            this.dialogPolyfill.registerDialog(this.addRoomDialog);
            this.dialogPolyfill.registerDialog(this.addTerminalDialog);
            this.dialogPolyfill.registerDialog(this.confirmDialog);
        };

        viewHome.prototype.removeHome = function removeHome() {
            var _this3 = this;

            this.http.fetch("/home/" + this.home._id, {
                method: "DELETE"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this3.showMessage(data.message);
                _this3.router.navigateToRoute("home");
            });
        };

        viewHome.prototype.addRoom = function addRoom() {
            var _this4 = this;

            this.http.fetch("/home/" + this.home._id + "/room/newRoom", {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "roomName": this.newRoomName })
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this4.showMessage(data.message);
                if (data.home) {
                    _this4.home = data.home;
                    _this4.newRoomName = "";
                    _this4.closeAddRoomDialog();
                }
            });
        };

        viewHome.prototype.removeRoom = function removeRoom(roomId) {
            var _this5 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId, {
                method: "DELETE"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this5.showMessage(data.message);
                if (data.home) {
                    _this5.home = data.home;
                    _this5.confirmDialog.close();
                }
            });
        };

        viewHome.prototype.addTerminal = function addTerminal() {
            var _this6 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + this.currentRoom + "/terminal/newTerminal", {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "terminalName": this.newTerminalName, "terminalType": this.newTerminalType })
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this6.showMessage(data.message);
                if (data.home) {
                    _this6.home = data.home;
                    _this6.newTerminalName = "";
                    _this6.newTerminalType = "";
                    _this6.closeAddTerminalDialog();
                }
            });
        };

        viewHome.prototype.unlinkTerminal = function unlinkTerminal(roomId, terminalId) {
            var _this7 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/unlink", {
                method: "GET"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this7.showMessage(data.message);
                if (data.home) {
                    _this7.home = data.home;
                    _this7.confirmDialog.close();
                }
            });
        };

        viewHome.prototype.refreshTerminal = function refreshTerminal(roomId, terminalId) {
            var _this8 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/refresh", {
                method: "GET"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this8.showMessage(data.message);
                if (data.home) {
                    _this8.home = data.home;
                }
            });
        };

        viewHome.prototype.removeTerminal = function removeTerminal(roomId, terminalId) {
            var _this9 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId, {
                method: "DELETE"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this9.showMessage(data.message);
                if (data.home) {
                    _this9.home = data.home;
                    _this9.confirmDialog.close();
                }
            });
        };

        viewHome.prototype.setTerminalState = function setTerminalState(roomId, terminalId, state) {
            var _this10 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/" + state, {
                method: "GET"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this10.showMessage(data.message);
                if (data.home) {
                    _this10.home = data.home;
                }
            });
        };

        viewHome.prototype.toggleTerminalState = function toggleTerminalState(roomId, terminal) {
            terminal.state = !terminal.state;
            this.setTerminalState(roomId, terminal._id, terminal.state ? "on" : "off");
        };

        viewHome.prototype.showAddTerminalDialog = function showAddTerminalDialog(roomId) {
            this.currentRoom = roomId;
            this.addTerminalDialog.showModal();
        };

        viewHome.prototype.closeAddTerminalDialog = function closeAddTerminalDialog() {
            this.currentRoom = null;
            this.newTerminalName = "";
            this.newTerminalType = "";
            this.addTerminalDialog.close();
        };

        viewHome.prototype.closeAddRoomDialog = function closeAddRoomDialog() {
            this.newRoomName = "";
            this.addRoomDialog.close();
        };

        viewHome.prototype.showConfirmDialog = function showConfirmDialog(type, object) {
            var _this11 = this;

            var that = this;
            if (type === "home") {
                this.confirm = {
                    message: "Are you sure you want to delete Home " + object.homeName + " ?",
                    warn: "This action cannot be undone. You will lose access to all rooms and terminals assigned to this Home.",
                    button: {
                        label: "DELETE",
                        action: function (that) {
                            return function () {
                                that.removeHome();
                            };
                        }(that)
                    }
                };
            } else if (type === "room") {
                this.confirm = {
                    message: "Are you sure you want to delete Room " + object.roomName + " ?",
                    warn: "This action cannot be undone. You will lose access to all terminals assigned to this Room.",
                    button: {
                        label: "DELETE",
                        action: function (that, roomId) {
                            return function () {
                                that.removeRoom(roomId);
                            };
                        }(that, object._id)
                    }
                };
            } else if (type === "terminal-unlink") {
                this.confirm = {
                    message: "Are you sure you want to unlink Terminal " + object.terminal.terminalName + " (" + object.terminal.type + ") ?",
                    warn: "This action cannot be undone. You will lose access to the switch from this Terminal.",
                    button: {
                        label: "UNLINK",
                        action: function (that, roomId, terminalId) {
                            return function () {
                                that.unlinkTerminal(roomId, terminalId);
                            };
                        }(that, object.room._id, object.terminal._id)
                    }
                };
            } else if (type === "terminal-remove") {
                this.confirm = {
                    message: "Are you sure you want to delete Terminal " + object.terminal.terminalName + " (" + object.terminal.type + ") ?",
                    warn: "This action cannot be undone. You will lose access to the switch from this Terminal.",
                    button: {
                        label: "DELETE",
                        action: function (that, roomId, terminalId) {
                            return function () {
                                _this11.removeTerminal(roomId, terminalId);
                            };
                        }(that, object.room._id, object.terminal._id)
                    }
                };
            }
            this.confirmDialog.showModal();
        };

        viewHome.prototype.closeConfirmDialog = function closeConfirmDialog() {
            this.confirmDialog.close();
        };

        viewHome.prototype.showMessage = function showMessage(message) {
            if (this.toastContainer) {
                this.toastContainer.MaterialSnackbar.showSnackbar({ message: message });
            }
        };

        return viewHome;
    }()) || _class);
});
define('login/login',['exports', 'aurelia-auth', 'aurelia-framework'], function (exports, _aureliaAuth, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Login = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaAuth.AuthService), _dec(_class = function () {
        function Login(auth) {
            _classCallCheck(this, Login);

            this.title = "Home Connect Account";
            this.userName = "";
            this.password = "";
            this.error = "";

            this.auth = auth;
        }

        Login.prototype.login = function login() {
            var _this = this;

            return this.auth.login({ userName: this.userName, password: this.password }).then(function (response) {
                console.log("Login response: " + response);
            }).catch(function (error) {
                _this.error = error.statusText;
                _this.dialog.showModal();
            });
        };

        Login.prototype.closeDialog = function closeDialog() {
            this.error = "";
            this.dialog.close();
        };

        return Login;
    }()) || _class);
});
define('logout/logout',['exports', 'aurelia-auth', 'aurelia-framework'], function (exports, _aureliaAuth, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Logout = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_aureliaAuth.AuthService), _dec(_class = function () {
        function Logout(authService) {
            _classCallCheck(this, Logout);

            this.authService = authService;
        }

        Logout.prototype.activate = function activate() {
            this.authService.logout("#/").then(function (response) {
                console.log("Logged Out");
            }).catch(function (err) {
                console.log("Error Logging Out");
            });
        };

        return Logout;
    }()) || _class);
});
define('nav-bar/nav-bar',['exports', 'aurelia-framework', 'aurelia-auth'], function (exports, _aureliaFramework, _aureliaAuth) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.NavBar = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var NavBar = exports.NavBar = (_dec = (0, _aureliaFramework.inject)(_aureliaAuth.AuthService), _dec(_class = (_class2 = function () {
        function NavBar(auth) {
            _classCallCheck(this, NavBar);

            this._isAuthenticated = false;

            _initDefineProp(this, 'router', _descriptor, this);

            this.auth = auth;
        }

        _createClass(NavBar, [{
            key: 'isAuthenticated',
            get: function get() {
                return this.auth.isAuthenticated();
            }
        }]);

        return NavBar;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'router', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return null;
        }
    })), _class2)) || _class);
});
define('privacy/privacy',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Privacy = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Privacy = exports.Privacy = function Privacy() {
        _classCallCheck(this, Privacy);

        this.title = "Terms and Conditions";
    };
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('side-bar/side-bar',['exports', 'aurelia-framework', 'aurelia-auth'], function (exports, _aureliaFramework, _aureliaAuth) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SideBar = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var SideBar = exports.SideBar = (_dec = (0, _aureliaFramework.inject)(_aureliaAuth.AuthService), _dec(_class = (_class2 = function () {
        function SideBar(auth) {
            _classCallCheck(this, SideBar);

            this._isAuthenticated = false;

            _initDefineProp(this, 'router', _descriptor, this);

            this.auth = auth;
        }

        _createClass(SideBar, [{
            key: 'isAuthenticated',
            get: function get() {
                return this.auth.isAuthenticated();
            }
        }]);

        return SideBar;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'router', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: function initializer() {
            return null;
        }
    })), _class2)) || _class);
});
define('aurelia-auth/auth-service',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', './authentication', './base-config', './oAuth1', './oAuth2', './auth-utilities'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator, _authentication, _baseConfig, _oAuth, _oAuth2, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthService = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthService = exports.AuthService = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication, _oAuth.OAuth1, _oAuth2.OAuth2, _baseConfig.BaseConfig, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AuthService(http, auth, oAuth1, oAuth2, config, eventAggregator) {
      _classCallCheck(this, AuthService);

      this.http = http;
      this.auth = auth;
      this.oAuth1 = oAuth1;
      this.oAuth2 = oAuth2;
      this.config = config.current;
      this.tokenInterceptor = auth.tokenInterceptor;
      this.eventAggregator = eventAggregator;
    }

    AuthService.prototype.getMe = function getMe() {
      var profileUrl = this.auth.getProfileUrl();
      return this.http.fetch(profileUrl).then(_authUtilities.status);
    };

    AuthService.prototype.isAuthenticated = function isAuthenticated() {
      return this.auth.isAuthenticated();
    };

    AuthService.prototype.getTokenPayload = function getTokenPayload() {
      return this.auth.getPayload();
    };

    AuthService.prototype.setToken = function setToken(token) {
      this.auth.setToken(Object.defineProperty({}, this.config.tokenName, { value: token }));
    };

    AuthService.prototype.signup = function signup(displayName, email, password) {
      var _this = this;

      var signupUrl = this.auth.getSignupUrl();
      var content = void 0;
      if (_typeof(arguments[0]) === 'object') {
        content = arguments[0];
      } else {
        content = {
          'displayName': displayName,
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(signupUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.loginOnSignup) {
          _this.auth.setToken(response);
        } else if (_this.config.signupRedirect) {
          window.location.href = _this.config.signupRedirect;
        }
        _this.eventAggregator.publish('auth:signup', response);
        return response;
      });
    };

    AuthService.prototype.login = function login(email, password) {
      var _this2 = this;

      var loginUrl = this.auth.getLoginUrl();
      var content = void 0;
      if (typeof arguments[1] !== 'string') {
        content = arguments[0];
      } else {
        content = {
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(loginUrl, {
        method: 'post',
        headers: typeof content === 'string' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
        body: typeof content === 'string' ? content : (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        _this2.auth.setToken(response);
        _this2.eventAggregator.publish('auth:login', response);
        return response;
      });
    };

    AuthService.prototype.logout = function logout(redirectUri) {
      var _this3 = this;

      return this.auth.logout(redirectUri).then(function () {
        _this3.eventAggregator.publish('auth:logout');
      });
    };

    AuthService.prototype.authenticate = function authenticate(name, redirect, userData) {
      var _this4 = this;

      var provider = this.oAuth2;
      if (this.config.providers[name].type === '1.0') {
        provider = this.oAuth1;
      }

      return provider.open(this.config.providers[name], userData || {}).then(function (response) {
        _this4.auth.setToken(response, redirect);
        _this4.eventAggregator.publish('auth:authenticate', response);
        return response;
      });
    };

    AuthService.prototype.unlink = function unlink(provider) {
      var _this5 = this;

      var unlinkUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

      if (this.config.unlinkMethod === 'get') {
        return this.http.fetch(unlinkUrl + provider).then(_authUtilities.status).then(function (response) {
          _this5.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      } else if (this.config.unlinkMethod === 'post') {
        return this.http.fetch(unlinkUrl, {
          method: 'post',
          body: (0, _aureliaFetchClient.json)(provider)
        }).then(_authUtilities.status).then(function (response) {
          _this5.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      }
    };

    return AuthService;
  }()) || _class);
});
define('aurelia-auth/authentication',['exports', 'aurelia-dependency-injection', './base-config', './storage', './auth-utilities'], function (exports, _aureliaDependencyInjection, _baseConfig, _storage, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Authentication = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var Authentication = exports.Authentication = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _baseConfig.BaseConfig), _dec(_class = function () {
    function Authentication(storage, config) {
      _classCallCheck(this, Authentication);

      this.storage = storage;
      this.config = config.current;
      this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
      this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
    }

    Authentication.prototype.getLoginRoute = function getLoginRoute() {
      return this.config.loginRoute;
    };

    Authentication.prototype.getLoginRedirect = function getLoginRedirect() {
      return this.initialUrl || this.config.loginRedirect;
    };

    Authentication.prototype.getLoginUrl = function getLoginUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
    };

    Authentication.prototype.getSignupUrl = function getSignupUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
    };

    Authentication.prototype.getProfileUrl = function getProfileUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
    };

    Authentication.prototype.getToken = function getToken() {
      return this.storage.get(this.tokenName);
    };

    Authentication.prototype.getPayload = function getPayload() {
      var token = this.storage.get(this.tokenName);
      return this.decomposeToken(token);
    };

    Authentication.prototype.decomposeToken = function decomposeToken(token) {
      if (token && token.split('.').length === 3) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        try {
          return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        } catch (error) {
          return null;
        }
      }
    };

    Authentication.prototype.setInitialUrl = function setInitialUrl(url) {
      this.initialUrl = url;
    };

    Authentication.prototype.setToken = function setToken(response, redirect) {
      var accessToken = response && response[this.config.responseTokenProp];
      var tokenToStore = void 0;

      if (accessToken) {
        if ((0, _authUtilities.isObject)(accessToken) && (0, _authUtilities.isObject)(accessToken.data)) {
          response = accessToken;
        } else if ((0, _authUtilities.isString)(accessToken)) {
          tokenToStore = accessToken;
        }
      }

      if (!tokenToStore && response) {
        tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
      }

      if (tokenToStore) {
        this.storage.set(this.tokenName, tokenToStore);
      }

      var idToken = response && response[this.config.responseIdTokenProp];

      if (idToken) {
        this.storage.set(this.idTokenName, idToken);
      }

      if (this.config.loginRedirect && !redirect) {
        window.location.href = this.getLoginRedirect();
      } else if (redirect && (0, _authUtilities.isString)(redirect)) {
        window.location.href = window.encodeURI(redirect);
      }
    };

    Authentication.prototype.removeToken = function removeToken() {
      this.storage.remove(this.tokenName);
    };

    Authentication.prototype.isAuthenticated = function isAuthenticated() {
      var token = this.storage.get(this.tokenName);

      if (!token) {
        return false;
      }

      if (token.split('.').length !== 3) {
        return true;
      }

      var exp = void 0;
      try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        exp = JSON.parse(window.atob(base64)).exp;
      } catch (error) {
        return false;
      }

      if (exp) {
        return Math.round(new Date().getTime() / 1000) <= exp;
      }

      return true;
    };

    Authentication.prototype.logout = function logout(redirect) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.storage.remove(_this.tokenName);

        if (_this.config.logoutRedirect && !redirect) {
          window.location.href = _this.config.logoutRedirect;
        } else if ((0, _authUtilities.isString)(redirect)) {
          window.location.href = redirect;
        }

        resolve();
      });
    };

    _createClass(Authentication, [{
      key: 'tokenInterceptor',
      get: function get() {
        var config = this.config;
        var storage = this.storage;
        var auth = this;
        return {
          request: function request(_request) {
            if (auth.isAuthenticated() && config.httpInterceptor) {
              var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
              var token = storage.get(tokenName);

              if (config.authHeader && config.authToken) {
                token = config.authToken + ' ' + token;
              }

              _request.headers.set(config.authHeader, token);
            }
            return _request;
          }
        };
      }
    }]);

    return Authentication;
  }()) || _class);
});
define('aurelia-auth/base-config',['exports', './auth-utilities'], function (exports, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BaseConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BaseConfig = exports.BaseConfig = function () {
    BaseConfig.prototype.configure = function configure(incomingConfig) {
      (0, _authUtilities.merge)(this._current, incomingConfig);
    };

    _createClass(BaseConfig, [{
      key: 'current',
      get: function get() {
        return this._current;
      }
    }]);

    function BaseConfig() {
      _classCallCheck(this, BaseConfig);

      this._current = {
        httpInterceptor: true,
        loginOnSignup: true,
        baseUrl: '/',
        loginRedirect: '#/',
        logoutRedirect: '#/',
        signupRedirect: '#/login',
        loginUrl: '/auth/login',
        signupUrl: '/auth/signup',
        profileUrl: '/auth/me',
        loginRoute: '/login',
        signupRoute: '/signup',
        tokenRoot: false,
        tokenName: 'token',
        idTokenName: 'id_token',
        tokenPrefix: 'aurelia',
        responseTokenProp: 'access_token',
        responseIdTokenProp: 'id_token',
        unlinkUrl: '/auth/unlink/',
        unlinkMethod: 'get',
        authHeader: 'Authorization',
        authToken: 'Bearer',
        withCredentials: true,
        platform: 'browser',
        storage: 'localStorage',
        providers: {
          identSrv: {
            name: 'identSrv',
            url: '/auth/identSrv',

            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'openid'],
            responseType: 'code',
            scopePrefix: '',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope', 'nonce'],
            optionalUrlParams: ['display', 'state'],
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            display: 'popup',
            type: '2.0',
            clientId: 'jsClient',
            nonce: function nonce() {
              var val = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
              return encodeURIComponent(val);
            },
            popupOptions: { width: 452, height: 633 }
          },
          google: {
            name: 'google',
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'email'],
            scopePrefix: 'openid',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display', 'state'],
            display: 'popup',
            type: '2.0',
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            popupOptions: {
              width: 452,
              height: 633
            }
          },
          facebook: {
            name: 'facebook',
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
            redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
            scope: ['email'],
            scopeDelimiter: ',',
            nonce: function nonce() {
              return Math.random();
            },
            requiredUrlParams: ['nonce', 'display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 580,
              height: 400
            }
          },
          linkedin: {
            name: 'linkedin',
            url: '/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['state'],
            scope: ['r_emailaddress'],
            scopeDelimiter: ' ',
            state: 'STATE',
            type: '2.0',
            popupOptions: {
              width: 527,
              height: 582
            }
          },
          github: {
            name: 'github',
            url: '/auth/github',
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            optionalUrlParams: ['scope'],
            scope: ['user:email'],
            scopeDelimiter: ' ',
            type: '2.0',
            popupOptions: {
              width: 1020,
              height: 618
            }
          },
          yahoo: {
            name: 'yahoo',
            url: '/auth/yahoo',
            authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: [],
            scopeDelimiter: ',',
            type: '2.0',
            popupOptions: {
              width: 559,
              height: 519
            }
          },
          twitter: {
            name: 'twitter',
            url: '/auth/twitter',
            authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
            type: '1.0',
            popupOptions: {
              width: 495,
              height: 645
            }
          },
          live: {
            name: 'live',
            url: '/auth/live',
            authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['wl.emails'],
            scopeDelimiter: ' ',
            requiredUrlParams: ['display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 500,
              height: 560
            }
          },
          instagram: {
            name: 'instagram',
            url: '/auth/instagram',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['scope'],
            scope: ['basic'],
            scopeDelimiter: '+',
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 550,
              height: 369
            }
          }
        }
      };
    }

    return BaseConfig;
  }();
});
define('aurelia-auth/auth-utilities',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.status = status;
  exports.isDefined = isDefined;
  exports.camelCase = camelCase;
  exports.parseQueryString = parseQueryString;
  exports.isString = isString;
  exports.isObject = isObject;
  exports.isFunction = isFunction;
  exports.joinUrl = joinUrl;
  exports.isBlankObject = isBlankObject;
  exports.isArrayLike = isArrayLike;
  exports.isWindow = isWindow;
  exports.extend = extend;
  exports.merge = merge;
  exports.forEach = forEach;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var slice = [].slice;

  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }

  function baseExtend(dst, objs, deep) {
    var h = dst.$$hashKey;

    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!isObject(obj) && !isFunction(obj)) continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src = obj[key];

        if (deep && isObject(src)) {
          if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        } else {
          dst[key] = src;
        }
      }
    }

    setHashKey(dst, h);
    return dst;
  }

  function status(response) {
    if (response.status >= 200 && response.status < 400) {
      return response.json().catch(function (error) {
        return null;
      });
    }

    throw response;
  }

  function isDefined(value) {
    return typeof value !== 'undefined';
  }

  function camelCase(name) {
    return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }

  function parseQueryString(keyValue) {
    var key = void 0;
    var value = void 0;
    var obj = {};

    forEach((keyValue || '').split('&'), function (kv) {
      if (kv) {
        value = kv.split('=');
        key = decodeURIComponent(value[0]);
        obj[key] = isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
      }
    });

    return obj;
  }

  function isString(value) {
    return typeof value === 'string';
  }

  function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function joinUrl(baseUrl, url) {
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
      return url;
    }

    var joined = [baseUrl, url].join('/');
    var normalize = function normalize(str) {
      return str.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/\#/g, '#').replace(/\:\//g, '://');
    };

    return normalize(joined);
  }

  function isBlankObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Object.getPrototypeOf(value);
  }

  function isArrayLike(obj) {
    if (obj === null || isWindow(obj)) {
      return false;
    }
  }

  function isWindow(obj) {
    return obj && obj.window === obj;
  }

  function extend(dst) {
    return baseExtend(dst, slice.call(arguments, 1), false);
  }

  function merge(dst) {
    return baseExtend(dst, slice.call(arguments, 1), true);
  }

  function forEach(obj, iterator, context) {
    var key = void 0;
    var length = void 0;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key !== 'prototype' && key !== 'length' && key !== 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (Array.isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object';
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === 'function') {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }
});
define('aurelia-auth/storage',['exports', 'aurelia-dependency-injection', './base-config'], function (exports, _aureliaDependencyInjection, _baseConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Storage = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Storage = exports.Storage = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Storage(config) {
      _classCallCheck(this, Storage);

      this.config = config.current;
      this.storage = this._getStorage(this.config.storage);
    }

    Storage.prototype.get = function get(key) {
      return this.storage.getItem(key);
    };

    Storage.prototype.set = function set(key, value) {
      return this.storage.setItem(key, value);
    };

    Storage.prototype.remove = function remove(key) {
      return this.storage.removeItem(key);
    };

    Storage.prototype._getStorage = function _getStorage(type) {
      if (type === 'localStorage') {
        if ('localStorage' in window && window.localStorage !== null) return localStorage;
        throw new Error('Local Storage is disabled or unavailable.');
      } else if (type === 'sessionStorage') {
        if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
        throw new Error('Session Storage is disabled or unavailable.');
      }

      throw new Error('Invalid storage type specified: ' + type);
    };

    return Storage;
  }()) || _class);
});
define('aurelia-auth/oAuth1',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth1 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth1 = exports.OAuth1 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig), _dec(_class = function () {
    function OAuth1(storage, popup, http, config) {
      _classCallCheck(this, OAuth1);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.defaults = {
        url: null,
        name: null,
        popupOptions: null,
        redirectUri: null,
        authorizationEndpoint: null
      };
    }

    OAuth1.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);
      var serverUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;

      if (this.config.platform !== 'mobile') {
        this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
      }
      return this.http.fetch(serverUrl, {
        method: 'post'
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.platform === 'mobile') {
          _this.popup = _this.popup.open([current.authorizationEndpoint, _this.buildQueryString(response)].join('?'), current.name, current.popupOptions, current.redirectUri);
        } else {
          _this.popup.popupWindow.location = [current.authorizationEndpoint, _this.buildQueryString(response)].join('?');
        }

        var popupListener = _this.config.platform === 'mobile' ? _this.popup.eventListener(current.redirectUri) : _this.popup.pollPopup();
        return popupListener.then(function (result) {
          return _this.exchangeForToken(result, userData, current);
        });
      });
    };

    OAuth1.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, oauthData);
      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth1.prototype.buildQueryString = function buildQueryString(obj) {
      var str = [];
      (0, _authUtilities.forEach)(obj, function (value, key) {
        return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      });
      return str.join('&');
    };

    return OAuth1;
  }()) || _class);
});
define('aurelia-auth/popup',['exports', './auth-utilities', './base-config', 'aurelia-dependency-injection'], function (exports, _authUtilities, _baseConfig, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Popup = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Popup = exports.Popup = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Popup(config) {
      _classCallCheck(this, Popup);

      this.config = config.current;
      this.popupWindow = null;
      this.polling = null;
      this.url = '';
    }

    Popup.prototype.open = function open(url, windowName, options, redirectUri) {
      this.url = url;
      var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
      this.popupWindow = window.open(url, windowName, optionsString);
      if (this.popupWindow && this.popupWindow.focus) {
        this.popupWindow.focus();
      }

      return this;
    };

    Popup.prototype.eventListener = function eventListener(redirectUri) {
      var self = this;
      var promise = new Promise(function (resolve, reject) {
        self.popupWindow.addEventListener('loadstart', function (event) {
          if (event.url.indexOf(redirectUri) !== 0) {
            return;
          }

          var parser = document.createElement('a');
          parser.href = event.url;

          if (parser.search || parser.hash) {
            var queryParams = parser.search.substring(1).replace(/\/$/, '');
            var hashParams = parser.hash.substring(1).replace(/\/$/, '');
            var hash = (0, _authUtilities.parseQueryString)(hashParams);
            var qs = (0, _authUtilities.parseQueryString)(queryParams);

            (0, _authUtilities.extend)(qs, hash);

            if (qs.error) {
              reject({
                error: qs.error
              });
            } else {
              resolve(qs);
            }

            self.popupWindow.close();
          }
        });

        popupWindow.addEventListener('exit', function () {
          reject({
            data: 'Provider Popup was closed'
          });
        });

        popupWindow.addEventListener('loaderror', function () {
          deferred.reject({
            data: 'Authorization Failed'
          });
        });
      });
      return promise;
    };

    Popup.prototype.pollPopup = function pollPopup() {
      var _this = this;

      var self = this;
      var promise = new Promise(function (resolve, reject) {
        _this.polling = setInterval(function () {
          try {
            var documentOrigin = document.location.host;
            var popupWindowOrigin = self.popupWindow.location.host;

            if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
              var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
              var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
              var hash = (0, _authUtilities.parseQueryString)(hashParams);
              var qs = (0, _authUtilities.parseQueryString)(queryParams);

              (0, _authUtilities.extend)(qs, hash);

              if (qs.error) {
                reject({
                  error: qs.error
                });
              } else {
                resolve(qs);
              }

              self.popupWindow.close();
              clearInterval(self.polling);
            }
          } catch (error) {}

          if (!self.popupWindow) {
            clearInterval(self.polling);
            reject({
              data: 'Provider Popup Blocked'
            });
          } else if (self.popupWindow.closed) {
            clearInterval(self.polling);
            reject({
              data: 'Problem poll popup'
            });
          }
        }, 35);
      });
      return promise;
    };

    Popup.prototype.prepareOptions = function prepareOptions(options) {
      var width = options.width || 500;
      var height = options.height || 500;
      return (0, _authUtilities.extend)({
        width: width,
        height: height,
        left: window.screenX + (window.outerWidth - width) / 2,
        top: window.screenY + (window.outerHeight - height) / 2.5
      }, options);
    };

    Popup.prototype.stringifyOptions = function stringifyOptions(options) {
      var parts = [];
      (0, _authUtilities.forEach)(options, function (value, key) {
        parts.push(key + '=' + value);
      });
      return parts.join(',');
    };

    return Popup;
  }()) || _class);
});
define('aurelia-auth/oAuth2',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', './authentication', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _authentication, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth2 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth2 = exports.OAuth2 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig, _authentication.Authentication), _dec(_class = function () {
    function OAuth2(storage, popup, http, config, auth) {
      _classCallCheck(this, OAuth2);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.auth = auth;
      this.defaults = {
        url: null,
        name: null,
        state: null,
        scope: null,
        scopeDelimiter: null,
        redirectUri: null,
        popupOptions: null,
        authorizationEndpoint: null,
        responseParams: null,
        requiredUrlParams: null,
        optionalUrlParams: null,
        defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
        responseType: 'code'
      };
    }

    OAuth2.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);

      var stateName = current.name + '_state';

      if ((0, _authUtilities.isFunction)(current.state)) {
        this.storage.set(stateName, current.state());
      } else if ((0, _authUtilities.isString)(current.state)) {
        this.storage.set(stateName, current.state);
      }

      var nonceName = current.name + '_nonce';

      if ((0, _authUtilities.isFunction)(current.nonce)) {
        this.storage.set(nonceName, current.nonce());
      } else if ((0, _authUtilities.isString)(current.nonce)) {
        this.storage.set(nonceName, current.nonce);
      }

      var url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

      var openPopup = void 0;
      if (this.config.platform === 'mobile') {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
      } else {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
      }

      return openPopup.then(function (oauthData) {
        if (oauthData.state && oauthData.state !== _this.storage.get(stateName)) {
          return Promise.reject('OAuth 2.0 state parameter mismatch.');
        }

        if (current.responseType.toUpperCase().indexOf('TOKEN') !== -1) {
          if (!_this.verifyIdToken(oauthData, current.name)) {
            return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
          }

          return oauthData;
        }

        return _this.exchangeForToken(oauthData, userData, current);
      });
    };

    OAuth2.prototype.verifyIdToken = function verifyIdToken(oauthData, providerName) {
      var idToken = oauthData && oauthData[this.config.responseIdTokenProp];
      if (!idToken) return true;
      var idTokenObject = this.auth.decomposeToken(idToken);
      if (!idTokenObject) return true;
      var nonceFromToken = idTokenObject.nonce;
      if (!nonceFromToken) return true;
      var nonceInStorage = this.storage.get(providerName + '_nonce');
      if (nonceFromToken !== nonceInStorage) {
        return false;
      }
      return true;
    };

    OAuth2.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, {
        code: oauthData.code,
        clientId: current.clientId,
        redirectUri: current.redirectUri
      });

      if (oauthData.state) {
        data.state = oauthData.state;
      }

      (0, _authUtilities.forEach)(current.responseParams, function (param) {
        return data[param] = oauthData[param];
      });

      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth2.prototype.buildQueryString = function buildQueryString(current) {
      var _this2 = this;

      var keyValuePairs = [];
      var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

      (0, _authUtilities.forEach)(urlParams, function (params) {
        (0, _authUtilities.forEach)(current[params], function (paramName) {
          var camelizedName = (0, _authUtilities.camelCase)(paramName);
          var paramValue = (0, _authUtilities.isFunction)(current[paramName]) ? current[paramName]() : current[camelizedName];

          if (paramName === 'state') {
            var stateName = current.name + '_state';
            paramValue = encodeURIComponent(_this2.storage.get(stateName));
          }

          if (paramName === 'nonce') {
            var nonceName = current.name + '_nonce';
            paramValue = encodeURIComponent(_this2.storage.get(nonceName));
          }

          if (paramName === 'scope' && Array.isArray(paramValue)) {
            paramValue = paramValue.join(current.scopeDelimiter);

            if (current.scopePrefix) {
              paramValue = [current.scopePrefix, paramValue].join(current.scopeDelimiter);
            }
          }

          keyValuePairs.push([paramName, paramValue]);
        });
      });

      return keyValuePairs.map(function (pair) {
        return pair.join('=');
      }).join('&');
    };

    return OAuth2;
  }()) || _class);
});
define('aurelia-auth/authorize-step',['exports', 'aurelia-dependency-injection', 'aurelia-router', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaRouter, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthorizeStep = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthorizeStep = exports.AuthorizeStep = (_dec = (0, _aureliaDependencyInjection.inject)(_authentication.Authentication), _dec(_class = function () {
    function AuthorizeStep(auth) {
      _classCallCheck(this, AuthorizeStep);

      this.auth = auth;
    }

    AuthorizeStep.prototype.run = function run(routingContext, next) {
      var isLoggedIn = this.auth.isAuthenticated();
      var loginRoute = this.auth.getLoginRoute();

      if (routingContext.getAllInstructions().some(function (i) {
        return i.config.auth;
      })) {
        if (!isLoggedIn) {
          this.auth.setInitialUrl(window.location.href);
          return next.cancel(new _aureliaRouter.Redirect(loginRoute));
        }
      } else if (isLoggedIn && routingContext.getAllInstructions().some(function (i) {
        return i.fragment === loginRoute;
      })) {
        var loginRedirect = this.auth.getLoginRedirect();
        return next.cancel(new _aureliaRouter.Redirect(loginRedirect));
      }

      return next();
    };

    return AuthorizeStep;
  }()) || _class);
});
define('aurelia-auth/auth-fetch-config',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FetchConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var FetchConfig = exports.FetchConfig = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication), _dec(_class = function () {
    function FetchConfig(httpClient, authService) {
      _classCallCheck(this, FetchConfig);

      this.httpClient = httpClient;
      this.auth = authService;
    }

    FetchConfig.prototype.configure = function configure() {
      var _this = this;

      this.httpClient.configure(function (httpConfig) {
        httpConfig.withDefaults({
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).withInterceptor(_this.auth.tokenInterceptor);
      });
    };

    return FetchConfig;
  }()) || _class);
});
define('aurelia-auth/auth-filter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AuthFilterValueConverter = exports.AuthFilterValueConverter = function () {
    function AuthFilterValueConverter() {
      _classCallCheck(this, AuthFilterValueConverter);
    }

    AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
      return routes.filter(function (r) {
        return r.config.auth === undefined || r.config.auth === isAuthenticated;
      });
    };

    return AuthFilterValueConverter;
  }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\">\n    <require from=\"material-design-lite/material.min.css\"></require>\n    <require from=\"dialog-polyfill/dialog-polyfill.css\"></require>\n    <require from='nav-bar/nav-bar'></require>\n    <require from='side-bar/side-bar'></require>\n    <require from=\"./app.css\"></require>\n    <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header home-layout mdl-layout--no-desktop-drawer-button\">\n        <header class=\"app-header mdl-layout__header mdl-layout__header--seamed\">\n            <div class=\"mdl-layout__header-row\">\n                <a class=\"mdl-layout-title\" route-href=\"route: home\">Home Connect</a>\n                <div class=\"mdl-layout-spacer\"></div>\n                <nav-bar router.bind=\"router\"></nav-bar>\n            </div>\n        </header>\n        <div class=\"mdl-layout__drawer\">\n            <span class=\"mdl-layout-title\">Home Connect</span>\n            <side-bar router.bind=\"router\"></side-bar>\n        </div>\n        <main class=\"mdl-layout__content\">\n            <div class=\"page-content\">\n                <div class=\"container\">\n                    <router-view></router-view>\n                </div>\n            </div>\n        </main>\n        <footer class=\"footer mdl-mini-footer\">\n            <div class=\"mdl-mini-footer__left-section\">\n                <div class=\"footer-copyright mdl-logo\">&copy; Gulfaraz Yasin</div>\n            </div>\n            <div class=\"mdl-mini-footer__right-section\">\n                <ul class=\"mdl-mini-footer__link-list\">\n                    <li><a route-href=\"route: faq\" class=\"footer-link\">FAQ</a></li>\n                    <li><a route-href=\"route: privacy\" class=\"footer-link\">Privacy</a></li>\n                    <li><a route-href=\"route: contact\" class=\"footer-link\">Contact</a></li>\n                </ul>\n            </div>\n        </footer>\n    </div>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "body {\n  min-width: 300px;\n  position: relative; }\n\n.home-layout {\n  background: url(\"/assets/home.jpg\") center/cover; }\n  .home-layout .app-header {\n    background-color: #424242; }\n\n.mdl-button.mdl-button--colored {\n  color: #424242; }\n\n.mdl-dialog__title {\n  font-size: 2rem; }\n\n.mdl-textfield .mdl-textfield__input {\n  color: rgba(0, 0, 0, 0.87); }\n\n.mdl-textfield .mdl-textfield__label:after {\n  background: gray; }\n\n.mdl-textfield.mdl-textfield--floating-label .mdl-textfield__label {\n  color: gray; }\n\n.mdl-layout-title {\n  cursor: pointer; }\n\n.mdl-layout__header-row .mdl-layout-title {\n  cursor: pointer;\n  line-height: 64px;\n  text-decoration: none;\n  color: white; }\n\n.mdl-navigation .mdl-navigation__link {\n  cursor: pointer;\n  color: rgba(255, 255, 255, 0.54); }\n  .mdl-navigation .mdl-navigation__link:hover {\n    color: #424242;\n    background-color: rgba(255, 255, 255, 0.54); }\n\n.input-dropdown-container .input-dropdown-label {\n  font-size: 12px;\n  color: gray; }\n\n.input-dropdown-container .input-dropdown {\n  width: 100%;\n  background-color: white;\n  color: #747474;\n  position: relative;\n  height: 36px;\n  line-height: 36px;\n  font-size: 16px;\n  outline: 0; }\n\ndialog[open] {\n  position: fixed;\n  top: 50%;\n  transform: translateY(-50%); }\n\n.mdl-snackbar {\n  bottom: 70px; }\n\n.footer {\n  z-index: 1;\n  height: 70px;\n  min-height: 70px;\n  padding: 16px;\n  box-sizing: border-box; }\n  .footer ul, .footer ol {\n    line-height: 36px; }\n  .footer .footer-copyright {\n    color: #d6d6d6; }\n  .footer .footer-link {\n    color: #d6d6d6;\n    cursor: pointer; }\n    .footer .footer-link:hover, .footer .footer-link:active {\n      color: #fff; }\n\n@media only screen and (max-width: 480px) {\n  .footer {\n    height: 160px; }\n    .footer .mdl-mini-footer__left-section,\n    .footer .mdl-mini-footer__right-section {\n      width: 100%; } }\n"; });
define('text!contact/contact.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./contact.css\"></require>\n    <div class=\"mdl-card mdl-shadow--2dp contact-card\">\n        <div class=\"mdl-card__title contact-card-header\">\n            <h2 class=\"mdl-card__title-text contact-card-title\">${title}</h2>\n        </div>\n        <div class=\"mdl-card__supporting-text contact-card-text\">\n            <p>We would love to hear from you</p>\n            <p>Please view the <a route-href=\"route: faq\" title=\"Frequently Asked Questions\">FAQ</a> section before sending us a query</p>\n            <div>Send us a mail at <a href=\"mailto:hi@homeconnect.com\" target=\"_top\">hi@homeconnect.com</a></div>\n        </div>\n        <div class=\"mdl-card__actions mdl-card--border\">\n            <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" route-href=\"route: home\" title=\"Go Home\">Home</a>\n        </div>\n    </div>\n</template>\n"; });
define('text!contact/contact.css', ['module'], function(module) { module.exports = ".contact-card {\n  width: 80%;\n  max-width: 800px;\n  margin: 5% auto; }\n  .contact-card .contact-card-text {\n    font-size: 16px;\n    line-height: 24px; }\n    .contact-card .contact-card-text li {\n      font-size: 14px; }\n    .contact-card .contact-card-text p {\n      margin: 0 0 20px;\n      font-size: 16px; }\n"; });
define('text!device/device.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./device.css\"></require>\n    <div class=\"mdl-card mdl-shadow--2dp device-card\">\n        <div class=\"mdl-card__title device-card-header\">\n            <h2 class=\"mdl-card__title-text device-card-title\">${title}</h2>\n        </div>\n        <div class=\"mdl-card__supporting-text device-card-text\">\n            <div>You will need to install HomeConnect on your computer to configure your devices</div>\n            <div>The following are the steps required before you use HomeConnect Device Configurator</div>\n            <ol>\n                <li>Create your Home</li>\n                <li>Add Rooms to you Home</li>\n                <li>Add Lights, Fans and other end points in your Rooms</li>\n                <li>Download and install the HomeConnect application</li>\n                <li>Once installed, open the HomeConnect application</li>\n            </ol>\n            <div>Now that you have installed the HomeConnect application on your machine</div>\n            <div>The follow the below steps to link your devices to your HomeConnect Account</div>\n            <ol>\n                <li>Sign in into the HomeConnect application using your HomeConnect Account</li>\n                <li>Choose your HOME network, which will allow the devices to connect to the internet</li>\n                <ul>\n                    <li>If you are prompted by your system to allow network modification access, grant the required access to connect to the device network</li>\n                </ul>\n                <li>Choose the device you wish to connect to using the password you received with the device</li>\n                <ul>\n                    <li>In case you have lost the password, send us a mail at <a href=\"mailto:support@homeconnect.com\" target=\"_top\">support@homeconnect.com</a></li>\n                </ul>\n                <li>Select the end points you would like to connect the selected device to</li>\n                <li>Click SAVE</li>\n                <li>Sign into <a route-href=\"route: home\" title=\"Sign In HomeConnect\">homeconnect.com</a> to control your Home</li>\n            </ol>\n            <p>Congratulations</p>\n            <div>We would like to know your experience with HomeConnect, while feedback/suggestions/queries are welcome we simply enjoy knowing that our product is useful to you and is a part of your Home. So please spare a few minutes in writing to us at <a href=\"mailto:hi@homeconnect.com\" target=\"_top\">hi@homeconnect.com</a></div>\n        </div>\n        <div class=\"mdl-card__actions mdl-card--border\">\n            <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" href=\"#\">Download HomeConnect</a>\n            <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" route-href=\"route: home\" title=\"Go Home\">Home</a>\n        </div>\n    </div>\n</template>\n"; });
define('text!device/device.css', ['module'], function(module) { module.exports = ".device-card {\n  width: 80%;\n  max-width: 800px;\n  margin: 5% auto; }\n  .device-card > .device-card-header {\n    color: #fff;\n    font-weight: bold;\n    height: 300px;\n    background: url(\"/assets/device-header.jpg\") left center/cover; }\n    .device-card > .device-card-header .device-card-title {\n      word-spacing: 800px;\n      height: 100%; }\n  .device-card .device-card-text {\n    font-size: 16px;\n    line-height: 24px; }\n    .device-card .device-card-text li {\n      font-size: 14px; }\n    .device-card .device-card-text p {\n      margin: 30px 0;\n      font-size: 24px; }\n"; });
define('text!faq/faq.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./faq.css\"></require>\n    <div class=\"mdl-card mdl-shadow--2dp faq-card\">\n        <div class=\"mdl-card__title faq-card-header\">\n            <h2 class=\"mdl-card__title-text faq-card-title\">${title}</h2>\n        </div>\n        <div class=\"mdl-card__supporting-text faq-card-text\">\n            <div repeat.for=\"faq of faqs\">\n                <p class=\"question\">${$index + 1}. ${faq.question}</p>\n                <p class=\"answer\">${faq.answer}</p>\n                <p class=\"link\"><a href=\"${faq.link.url}\" title=\"${faq.link.title}\" target=\"_blank\">${faq.link.title}</a></p>\n            </div>\n            <div>If you require an answer to a question not mentioned here please send a mail to <a href=\"mailto:support@homeconnect.com\" target=\"_top\">support@homeconnect.com</a></div>\n        </div>\n        <div class=\"mdl-card__actions mdl-card--border\">\n            <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" route-href=\"route: home\" title=\"Go Home\">Home</a>\n        </div>\n    </div>\n</template>\n"; });
define('text!faq/faq.css', ['module'], function(module) { module.exports = ".faq-card {\n  width: 80%;\n  max-width: 800px;\n  margin: 5% auto; }\n  .faq-card .faq-card-text {\n    font-size: 16px;\n    line-height: 24px; }\n    .faq-card .faq-card-text li {\n      font-size: 14px; }\n    .faq-card .faq-card-text p {\n      margin: 0 0 20px;\n      font-size: 16px; }\n      .faq-card .faq-card-text p.question {\n        font-size: 20px; }\n      .faq-card .faq-card-text p.answer, .faq-card .faq-card-text p.link {\n        text-indent: 40px; }\n"; });
define('text!home/home.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./home.css\"></require>\n    <h4 class=\"home-list-header\">${title}</h4>\n    <ul class=\"home-list\">\n        <li class=\"home-item-container\" repeat.for=\"home of homes\">\n            <div class=\"home-list-item\" click.delegate=\"enterHome(home._id)\" title=\"Enter Home\">\n                <div class=\"home-icon-container\">\n                    <i class=\"material-icons home-icon\">home</i>\n                </div>\n                <div class=\"home-title-container\">\n                    <div class=\"home-title\">${home.homeName}</div>\n                    <div class=\"home-sub-title\">${home.rooms.length} Room${home.rooms.length > 1 ? \"s\" : \"\"}</div>\n                </div>\n                <div class=\"home-actions-container\">\n                    <div class=\"home-action-container\">\n                        <i class=\"material-icons home-icon\">chevron_right</i>\n                    </div>\n                </div>\n            </div>\n        </li>\n        <li class=\"mdl-list__item add-home-row\">\n            <a class=\"home-list-add-home\" route-href=\"route: newHome\" title=\"Add Home\">\n                <span class=\"mdl-list__item-primary-content\">\n                    <i class=\"material-icons mdl-list__item-icon\">add</i>\n                    <span>Add Home</span>\n                </span>\n            </a>\n        </li>\n    </ul>\n</template>\n"; });
define('text!home/home.css', ['module'], function(module) { module.exports = ".home-list,\n.home-list-header {\n  width: 70%;\n  margin: auto; }\n\n.home-list-header {\n  font-weight: 100;\n  letter-spacing: 1px;\n  margin-top: 5%;\n  box-sizing: border-box;\n  height: 64px;\n  padding: 16px;\n  color: white;\n  background-color: #90a4ae; }\n\n.home-list {\n  box-sizing: border-box;\n  list-style: none;\n  padding: 0;\n  background-color: white; }\n  .home-list .home-item-container:hover, .home-list .home-item-container:active {\n    background-color: #eceff1; }\n  .home-list .home-item-container .home-list-item {\n    box-sizing: border-box;\n    cursor: pointer;\n    width: 100%;\n    text-decoration: none;\n    color: inherit; }\n    .home-list .home-item-container .home-list-item:hover .home-actions-container .home-action-container .home-icon, .home-list .home-item-container .home-list-item:active .home-actions-container .home-action-container .home-icon {\n      color: rgba(0, 0, 0, 0.54); }\n    .home-list .home-item-container .home-list-item .home-icon-container,\n    .home-list .home-item-container .home-list-item .home-action-container {\n      text-align: center;\n      cursor: pointer; }\n    .home-list .home-item-container .home-list-item .home-icon-container,\n    .home-list .home-item-container .home-list-item .home-title-container,\n    .home-list .home-item-container .home-list-item .home-actions-container {\n      display: inline-block;\n      margin: 15px;\n      vertical-align: middle; }\n    .home-list .home-item-container .home-list-item .home-icon {\n      font-size: 32px;\n      text-align: center;\n      line-height: 48px;\n      width: 48px;\n      border-radius: 50px;\n      color: rgba(0, 0, 0, 0.13); }\n    .home-list .home-item-container .home-list-item .home-icon-container .home-icon {\n      color: rgba(0, 0, 0, 0.54);\n      background-color: rgba(0, 0, 0, 0.13); }\n    .home-list .home-item-container .home-list-item .home-title-container {\n      width: calc(100% - 194px); }\n      .home-list .home-item-container .home-list-item .home-title-container .home-title {\n        font-size: 20px; }\n      .home-list .home-item-container .home-list-item .home-title-container .home-sub-title {\n        color: rgba(0, 0, 0, 0.54); }\n    .home-list .home-item-container .home-list-item .home-actions-container {\n      text-align: right; }\n      .home-list .home-item-container .home-list-item .home-actions-container .home-action-container {\n        display: inline-block; }\n  .home-list .add-home-row {\n    border-top: 1px solid rgba(0, 0, 0, 0.24);\n    cursor: pointer; }\n    .home-list .add-home-row:hover, .home-list .add-home-row:active {\n      background-color: #eceff1; }\n    .home-list .add-home-row .home-list-add-home {\n      width: 100%;\n      text-decoration: none;\n      color: inherit; }\n\n@media only screen and (max-width: 480px) {\n  .home-list .home-item-container .home-list-item .home-icon-container {\n    display: none; }\n  .home-list .home-item-container .home-list-item .home-title-container {\n    width: calc(100% - 112px); } }\n"; });
define('text!home/newHome.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./newHome.css\"></require>\n    <div class=\"mdl-layout mdl-js-layout new-home-layout\" show.bind=\"!message\">\n        <main class=\"mdl-layout__content new-home-layout-content\">\n            <div class=\"mdl-card mdl-shadow--6dp\">\n                <form role=\"form\" submit.delegate=\"add()\">\n                    <div class=\"new-home-card-title mdl-card__title\">\n                        <h2 class=\"mdl-card__title-text\">${title}</h2>\n                    </div>\n                    <div class=\"mdl-card__supporting-text\">\n                        <div class=\"mdl-textfield mdl-js-textfield\">\n                            <input class=\"mdl-textfield__input mdl-textfield__input--yellow\" type=\"text\" name=\"homeName\" id=\"homeName\" value.bind=\"homeName\" />\n                            <label class=\"mdl-textfield__label\" for=\"homeName\">Home Name</label>\n                        </div>\n                        <div class=\"mdl-textfield mdl-js-textfield\">\n                            <textarea class=\"mdl-textfield__input\" type=\"text\" name=\"address\" rows= \"4\" id=\"address\" value.bind=\"address\"></textarea>\n                            <label class=\"mdl-textfield__label\" for=\"address\">Address</label>\n                        </div>\n                    </div>\n                    <div class=\"mdl-card__actions mdl-card--border\">\n                        <button type=\"submit\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\">Add</button>\n                        <a class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" route-href=\"route: home\" title=\"Cancel\">Back</a>\n                    </div>\n                </form>\n            </div>\n        </main>\n    </div>\n    <dialog ref=\"dialog\" id=\"dialog\" class=\"mdl-dialog\">\n        <h3 class=\"mdl-dialog__title\">Action Failed</h3>\n        <div class=\"mdl-dialog__content\">\n            <p>${message}</p>\n        </div>\n        <div class=\"mdl-dialog__actions\">\n            <button type=\"button\" class=\"mdl-button\" click.delegate=\"closeDialog()\">Close</button>\n        </div>\n    </dialog>\n</template>\n"; });
define('text!home/newHome.css', ['module'], function(module) { module.exports = ".new-home-layout {\n  align-items: center;\n  justify-content: center; }\n  .new-home-layout .new-home-layout-content {\n    padding: 24px;\n    flex: none; }\n    .new-home-layout .new-home-layout-content .new-home-card-title {\n      background-color: #e0e0e0; }\n"; });
define('text!home/viewHome.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./viewHome.css\"></require>\n    <h4 class=\"home-header\">\n        <a route-href=\"route: home\" title=\"Back\" class=\"home-header-back-icon-container\">\n            <i class=\"material-icons home-header-back-icon\">chevron_left</i>\n        </a><div class=\"home-header-label\">${home.homeName}</div><div class=\"home-actions-container\">\n            <div class=\"home-action-container\">\n                <div click.delegate=\"showConfirmDialog('home', home)\" title=\"Delete Home\"><i class=\"material-icons home-icon home-delete-icon\">delete</i></div>\n            </div>\n        </div>\n    </h4>\n    <h4 class=\"home-address\" if.bind=\"home.address.length > 0\">${home.address}</h4>\n    <ul class=\"room-list\">\n        <li class=\"room-item\" repeat.for=\"room of home.rooms\">\n            <div class=\"room-header ${ show.roomList[room._id] ? 'room-closed' : 'room-open' }\">\n                <div class=\"room-icon-container\">\n                    <i class=\"material-icons room-avatar-icon\">dashboard</i>\n                </div>\n                <div class=\"room-title-container\" click.delegate=\"show.toggleRoom(room._id)\">\n                    <div class=\"room-title\">${room.roomName}</div>\n                    <div class=\"room-sub-title\">${room.terminals.length} Terminal${room.terminals.length > 1 ? \"s\" : \"\"}</div>\n                </div>\n                <div class=\"room-actions-container\">\n                    <div class=\"room-action-container\" show.bind=\"show.roomList[room._id]\">\n                        <div click.delegate=\"show.setRoom(room._id, false)\" title=\"Leave Room\"><i class=\"material-icons room-icon room-collapse-icon\">expand_less</i></div>\n                    </div>\n                    <div class=\"room-action-container\" show.bind=\"!show.roomList[room._id]\">\n                        <div click.delegate=\"show.setRoom(room._id, true)\" title=\"Enter Room\"><i class=\"material-icons room-icon room-expand-icon\">expand_more</i></div>\n                    </div>\n                    <div class=\"room-action-container\">\n                        <div click.delegate=\"showConfirmDialog('room', room)\" title=\"Delete Room\"><i class=\"material-icons room-icon room-delete-icon\">delete</i></div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"room-content\" show.bind=\"show.roomList[room._id]\">\n                <div class=\"terminal-item\" repeat.for=\"terminal of room.terminals\">\n                    <div class=\"terminal-type\">\n                        <i class=\"material-icons terminal-icon\" show.bind=\"terminal.type === 'light'\">lightbulb_outline</i>\n                        <i class=\"material-icons terminal-icon\" show.bind=\"terminal.type === 'fan'\">toys</i>\n                    </div>\n                    <div class=\"terminal-name\" click.delegate=\"toggleTerminalState(room._id, terminal)\">${terminal.terminalName}</div>\n                    <div class=\"terminal-actions\">\n                        <div if.bind=\"terminal.linked\">\n                            <div class=\"terminal-action-container\" if.bind=\"terminal.synced\">\n                                <label class=\"mdl-switch mdl-js-switch mdl-js-ripple-effect terminal-switch-control\" for=\"terminal-${terminal._id}-toggle\">\n                                    <input type=\"checkbox\" id=\"terminal-${terminal._id}-toggle\" class=\"mdl-switch__input\" checked.bind=\"terminal.state\" change.delegate=\"setTerminalState(room._id, terminal._id, (terminal.state ? 'on' : 'off'))\">\n                                    <span class=\"mdl-switch__label\"></span>\n                                </label>\n                            </div>\n                            <div class=\"terminal-action-container\" if.bind=\"!terminal.synced\">\n                                <div click.delegate=\"refreshTerminal(room._id, terminal._id)\" title=\"Refresh Terminal State\"><i class=\"material-icons terminal-icon terminal-refresh-icon\">refresh</i></div>\n                            </div>\n                            <div class=\"terminal-action-container\" class=\"terminal-action-container\">\n                                <div click.delegate=\"showConfirmDialog('terminal-unlink', { 'room' : room, 'terminal' : terminal })\" title=\"Unlink from Device\"><i class=\"material-icons terminal-icon terminal-unlink-icon\">link</i></div>\n                            </div>\n                        </div>\n                        <div if.bind=\"!terminal.linked\">\n                            <div class=\"terminal-action-container\">\n                                <a route-href=\"route: device\" title=\"Link to Device\"><i class=\"material-icons terminal-icon terminal-link-icon\">link</i></a>\n                            </div>\n                            <div class=\"terminal-action-container\">\n                                <div click.delegate=\"showConfirmDialog('terminal-remove', { 'room' : room, 'terminal' : terminal })\" title=\"Delete Terminal\"><i class=\"material-icons terminal-icon terminal-delete-icon\">delete</i></div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"terminal-item terminal-item-add-terminal\">\n                    <div class=\"add-terminal-trigger-container\" click.delegate=\"showAddTerminalDialog(room._id)\" title=\"Add Terminal\">\n                        <i class=\"material-icons add-terminal-trigger-icon\">add</i>\n                        <div class=\"add-terminal-trigger-label\">Add Terminal</div>\n                    </div>\n                </div>\n            </div>\n        </li>\n        <li class=\"mdl-list__item add-room-row\" click.delegate=\"addRoomDialog.showModal()\">\n            <span class=\"mdl-list__item-primary-content\">\n                <i class=\"material-icons mdl-list__item-icon\">add</i>\n                <span>Add Room</span>\n            </span>\n        </li>\n    </ul>\n    <dialog ref=\"addTerminalDialog\" id=\"addTerminalDialog\" class=\"mdl-dialog\">\n        <h3 class=\"mdl-dialog__title\">Add Terminal</h3>\n        <div class=\"mdl-dialog__content\">\n            <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n                <input class=\"mdl-textfield__input\" type=\"text\" name=\"newTerminalName\" id=\"newTerminalName\" value.bind=\"newTerminalName\" />\n                <label class=\"mdl-textfield__label\" for=\"newTerminalName\">New Terminal Name</label>\n            </div>\n            <div class=\"input-dropdown-container\">\n                <label class=\"input-dropdown-label\">Terminal Type</label>\n                <select class=\"input-dropdown\" name=\"newTerminalType\" id=\"newTerminalType\" value.bind=\"newTerminalType\">\n                    <option value=\"\">Select</option>\n                    <option value=\"light\">Light</option>\n                    <option value=\"fan\">Fan</option>\n                </select>\n            </div>\n        </div>\n        <div class=\"mdl-dialog__actions\">\n            <button type=\"button\" class=\"mdl-button\" click.delegate=\"addTerminal()\">Add Terminal</button>\n            <button type=\"button\" class=\"mdl-button\" click.delegate=\"closeAddTerminalDialog()\">Close</button>\n        </div>\n    </dialog>\n    <dialog ref=\"addRoomDialog\" id=\"addRoomDialog\" class=\"mdl-dialog\">\n        <h3 class=\"mdl-dialog__title\">Add Room</h3>\n        <div class=\"mdl-dialog__content\">\n            <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n                <input class=\"mdl-textfield__input\" type=\"text\" name=\"newRoomName\" id=\"newRoomName\" value.bind=\"newRoomName\" />\n                <label class=\"mdl-textfield__label\" for=\"newRoomName\">New Room Name</label>\n            </div>\n        </div>\n        <div class=\"mdl-dialog__actions\">\n            <button type=\"button\" class=\"mdl-button\" click.delegate=\"addRoom()\">Add Room</button>\n            <button type=\"button\" class=\"mdl-button\" click.delegate=\"closeAddRoomDialog()\">Close</button>\n        </div>\n    </dialog>\n    <dialog ref=\"confirmDialog\" id=\"confirmDialog\" class=\"mdl-dialog\">\n        <h3 class=\"mdl-dialog__title\">Confirm Action</h3>\n        <div class=\"mdl-dialog__content\">\n            <div class=\"confirm-dialog-message\">${confirm.message}</div>\n            <div class=\"confirm-dialog-warn\">${confirm.warn}</div>\n        </div>\n        <div class=\"mdl-dialog__actions\">\n            <button type=\"button\" class=\"mdl-button confirm-button\" click.delegate=\"confirm.button.action()\">${confirm.button.label}</button>\n            <button type=\"button\" class=\"mdl-button cancel-button\" click.delegate=\"closeConfirmDialog()\">Cancel</button>\n        </div>\n    </dialog>\n    <div ref=\"toastContainer\" id=\"toastContainer\" class=\"mdl-js-snackbar mdl-snackbar\">\n        <div class=\"mdl-snackbar__text\"></div>\n        <button class=\"mdl-snackbar__action\" type=\"button\"></button>\n    </div>\n</template>\n"; });
define('text!home/viewHome.css', ['module'], function(module) { module.exports = ".room-list,\n.home-header,\n.home-address {\n  width: 90%;\n  margin: auto; }\n\n.home-header {\n  font-weight: 100;\n  letter-spacing: 1px;\n  margin-top: 5%;\n  box-sizing: border-box;\n  height: 64px;\n  background-color: #90a4ae;\n  color: white; }\n  .home-header .home-header-label,\n  .home-header .home-header-back-icon-container {\n    display: inline-block; }\n  .home-header .home-header-back-icon-container {\n    text-decoration: none;\n    width: 50px;\n    height: 64px;\n    line-height: 64px;\n    cursor: pointer;\n    color: #90a4ae;\n    background-color: #607d8b; }\n    .home-header .home-header-back-icon-container:hover, .home-header .home-header-back-icon-container:active {\n      color: white; }\n    .home-header .home-header-back-icon-container .home-header-back-icon {\n      font-size: 36px;\n      line-height: 64px;\n      width: 100%;\n      text-align: center; }\n  .home-header .home-header-label,\n  .home-header .home-actions-container {\n    box-sizing: border-box;\n    display: inline-block;\n    vertical-align: top;\n    height: 100%;\n    line-height: 36px; }\n  .home-header .home-header-label {\n    padding: 16px; }\n  .home-header .home-actions-container {\n    background-color: #607d8b;\n    float: right; }\n    .home-header .home-actions-container .home-action-container {\n      cursor: pointer;\n      padding: 16px;\n      height: 100%;\n      box-sizing: border-box; }\n      .home-header .home-actions-container .home-action-container:hover .home-icon.home-delete-icon, .home-header .home-actions-container .home-action-container:active .home-icon.home-delete-icon {\n        color: #f44336; }\n      .home-header .home-actions-container .home-action-container .home-icon {\n        font-size: 32px;\n        color: #90a4ae; }\n        .home-header .home-actions-container .home-action-container .home-icon.home-delete-icon:hover, .home-header .home-actions-container .home-action-container .home-icon.home-delete-icon:active {\n          color: #f44336; }\n\n.home-address {\n  font-weight: 100;\n  letter-spacing: 1px;\n  box-sizing: border-box;\n  height: 48px;\n  padding: 8px 16px;\n  font-size: 20px;\n  background-color: #b0bec5;\n  color: white; }\n\n.room-list {\n  box-sizing: border-box;\n  padding: 0;\n  list-style: none;\n  background-color: white; }\n  .room-list .room-item {\n    padding: 16px; }\n    .room-list .room-item .room-header {\n      border: 1px solid rgba(0, 0, 0, 0.24); }\n      .room-list .room-item .room-header.room-closed {\n        border-bottom: none; }\n      .room-list .room-item .room-header .room-avatar-icon,\n      .room-list .room-item .room-header .room-icon {\n        color: rgba(0, 0, 0, 0.54); }\n      .room-list .room-item .room-header .room-icon-container,\n      .room-list .room-item .room-header .room-title-container,\n      .room-list .room-item .room-header .room-actions-container {\n        display: inline-block;\n        margin: 15px;\n        vertical-align: middle; }\n      .room-list .room-item .room-header .room-icon-container {\n        margin: 10px; }\n        .room-list .room-item .room-header .room-icon-container .room-avatar-icon {\n          width: 100%;\n          line-height: 40px;\n          text-align: center;\n          font-size: 40px; }\n      .room-list .room-item .room-header .room-title-container {\n        cursor: pointer;\n        width: calc(100% - 270px); }\n        .room-list .room-item .room-header .room-title-container .room-title {\n          font-size: 24px;\n          line-height: 24px;\n          color: rgba(0, 0, 0, 0.87);\n          padding-bottom: 4px;\n          overflow: hidden;\n          text-overflow: ellipsis;\n          white-space: nowrap; }\n        .room-list .room-item .room-header .room-title-container .room-sub-title {\n          font-size: 12px;\n          line-height: 12px;\n          color: rgba(0, 0, 0, 0.54);\n          overflow: hidden;\n          text-overflow: ellipsis;\n          white-space: nowrap; }\n        .room-list .room-item .room-header .room-title-container:hover + .room-actions-container .room-action-container .room-icon.room-expand-icon {\n          color: #64dd17; }\n        .room-list .room-item .room-header .room-title-container:hover + .room-actions-container .room-action-container .room-icon.room-collapse-icon {\n          color: #f44336; }\n      .room-list .room-item .room-header .room-actions-container {\n        text-align: right; }\n        .room-list .room-item .room-header .room-actions-container .room-action-container {\n          cursor: pointer;\n          display: inline-block;\n          width: 64px; }\n          .room-list .room-item .room-header .room-actions-container .room-action-container .room-icon {\n            font-size: 32px; }\n            .room-list .room-item .room-header .room-actions-container .room-action-container .room-icon.room-expand-icon:hover, .room-list .room-item .room-header .room-actions-container .room-action-container .room-icon.room-expand-icon:active {\n              color: #64dd17; }\n            .room-list .room-item .room-header .room-actions-container .room-action-container .room-icon.room-collapse-icon:hover, .room-list .room-item .room-header .room-actions-container .room-action-container .room-icon.room-collapse-icon:active {\n              color: #f44336; }\n            .room-list .room-item .room-header .room-actions-container .room-action-container .room-icon.room-delete-icon:hover, .room-list .room-item .room-header .room-actions-container .room-action-container .room-icon.room-delete-icon:active {\n              color: #f44336; }\n    .room-list .room-item .room-content {\n      border: 1px solid rgba(0, 0, 0, 0.24);\n      border-top: none;\n      padding: 16px;\n      padding-top: 1px; }\n      .room-list .room-item .room-content .terminal-item {\n        min-height: 48px;\n        border: 1px solid rgba(0, 0, 0, 0.24);\n        border-radius: 10px;\n        margin-top: 5px; }\n        .room-list .room-item .room-content .terminal-item .terminal-icon,\n        .room-list .room-item .room-content .terminal-item .terminal-name,\n        .room-list .room-item .room-content .terminal-item .terminal-actions {\n          line-height: 28px; }\n        .room-list .room-item .room-content .terminal-item .terminal-type,\n        .room-list .room-item .room-content .terminal-item .terminal-name,\n        .room-list .room-item .room-content .terminal-item .terminal-actions {\n          display: inline-block;\n          margin: 15px;\n          vertical-align: middle; }\n        .room-list .room-item .room-content .terminal-item .terminal-icon {\n          font-size: 28px;\n          color: rgba(0, 0, 0, 0.54); }\n        .room-list .room-item .room-content .terminal-item .terminal-name {\n          font-size: 20px;\n          cursor: pointer;\n          width: calc(100% - 260px);\n          overflow: hidden;\n          text-overflow: ellipsis;\n          white-space: nowrap; }\n        .room-list .room-item .room-content .terminal-item .terminal-actions {\n          text-align: right; }\n          .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container {\n            display: inline-block;\n            vertical-align: top;\n            width: 64px; }\n            .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container,\n            .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container a {\n              cursor: pointer; }\n            .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon {\n              margin: 0 10px; }\n              .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-link-icon:hover, .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-link-icon:active {\n                color: #2196f3; }\n              .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-refresh-icon:hover, .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-refresh-icon:active {\n                color: #f57f17; }\n              .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-delete-icon:hover, .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-delete-icon:active, .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-unlink-icon:hover, .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-unlink-icon:active {\n                color: #f44336; }\n              .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-unlink-icon {\n                position: relative; }\n                .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-icon.terminal-unlink-icon:before {\n                  position: absolute;\n                  content: \"\";\n                  left: 0;\n                  top: 48%;\n                  right: 0;\n                  border-top: 3px solid;\n                  border-color: inherit;\n                  -webkit-transform: rotate(-15deg);\n                  -moz-transform: rotate(-15deg);\n                  -ms-transform: rotate(-15deg);\n                  -o-transform: rotate(-15deg);\n                  transform: rotate(-15deg); }\n            .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-switch-control {\n              position: relative;\n              left: 8px; }\n              .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-switch-control.mdl-switch .mdl-switch__thumb {\n                background-color: white; }\n              .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-switch-control.mdl-switch .mdl-ripple {\n                background-color: gray; }\n              .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-switch-control.mdl-switch.is-checked .mdl-switch__track {\n                background-color: rgba(100, 221, 80, 0.54); }\n              .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-switch-control.mdl-switch.is-checked .mdl-switch__thumb {\n                background-color: #64dd17; }\n              .room-list .room-item .room-content .terminal-item .terminal-actions .terminal-action-container .terminal-switch-control.mdl-switch.is-checked .mdl-ripple {\n                background-color: #64dd17; }\n        .room-list .room-item .room-content .terminal-item.terminal-item-add-terminal .add-terminal-trigger-container {\n          height: 100%;\n          line-height: 52px;\n          cursor: pointer; }\n          .room-list .room-item .room-content .terminal-item.terminal-item-add-terminal .add-terminal-trigger-container .add-terminal-trigger-icon,\n          .room-list .room-item .room-content .terminal-item.terminal-item-add-terminal .add-terminal-trigger-container .add-terminal-trigger-label {\n            display: inline-block;\n            height: inherit;\n            line-height: inherit;\n            vertical-align: top; }\n          .room-list .room-item .room-content .terminal-item.terminal-item-add-terminal .add-terminal-trigger-container .add-terminal-trigger-icon {\n            width: 56px;\n            text-align: center; }\n  .room-list .add-room-row {\n    border-top: 1px solid rgba(0, 0, 0, 0.24);\n    cursor: pointer; }\n\n.confirm-dialog-warn {\n  margin-top: 10px;\n  font-style: italic;\n  color: #f44336; }\n\n.confirm-button {\n  color: #f44336; }\n\n@media only screen and (max-width: 480px) {\n  .room-list .room-item .room-header .room-icon-container {\n    display: none; }\n  .room-list .room-item .room-header .room-title-container {\n    width: calc(100% - 196px); }\n  .room-list .room-item .room-content .terminal-item .terminal-name {\n    width: calc(100% - 92px); }\n  .room-list .room-item .room-content .terminal-item .terminal-actions {\n    width: calc(100% - 30px); } }\n"; });
define('text!login/login.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./login.css\"></require>\n    <div class=\"mdl-layout mdl-js-layout login-layout\" show.bind=\"!error\">\n        <main class=\"mdl-layout__content login-layout-content\">\n            <div class=\"mdl-card mdl-shadow--6dp\">\n                <form role=\"form\" submit.delegate=\"login()\">\n                    <div class=\"login-card-title mdl-card__title\">\n                        <h2 class=\"mdl-card__title-text\">${title}</h2>\n                    </div>\n                    <div class=\"mdl-card__supporting-text\">\n                            <div class=\"mdl-textfield mdl-js-textfield\">\n                                <input class=\"mdl-textfield__input mdl-textfield__input--yellow\" type=\"text\" name=\"userName\" id=\"userName\" value.bind=\"userName\" />\n                                <label class=\"mdl-textfield__label\" for=\"userName\">User Name</label>\n                            </div>\n                            <div class=\"mdl-textfield mdl-js-textfield\">\n                                <input class=\"mdl-textfield__input\" type=\"password\" name=\"password\" id=\"password\" value.bind=\"password\" />\n                                <label class=\"mdl-textfield__label\" for=\"password\">Passcode</label>\n                            </div>\n                    </div>\n                    <div class=\"mdl-card__actions mdl-card--border\">\n                        <button type=\"submit\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\">Sign In</button>\n                    </div>\n                </form>\n            </div>\n        </main>\n    </div>\n    <dialog ref=\"dialog\" id=\"dialog\" class=\"mdl-dialog\">\n        <h3 class=\"mdl-dialog__title\">Access Denied</h3>\n        <div class=\"mdl-dialog__content\">\n            <p>${error}</p>\n        </div>\n        <div class=\"mdl-dialog__actions\">\n            <button type=\"button\" class=\"mdl-button\" click.delegate=\"closeDialog()\">Close</button>\n        </div>\n    </dialog>\n</template>\n"; });
define('text!login/login.css', ['module'], function(module) { module.exports = ".login-layout {\n  align-items: center;\n  justify-content: center; }\n  .login-layout .login-layout-content {\n    padding: 24px;\n    flex: none; }\n    .login-layout .login-layout-content .login-card-title {\n      background-color: #e0e0e0; }\n"; });
define('text!logout/logout.html', ['module'], function(module) { module.exports = "<!-- Aurelia expects a template for each route.\nWe don't actuall need a template for logging out, \nbut we provide an empty one to not get any errors -->\n<template></template>"; });
define('text!privacy/privacy.css', ['module'], function(module) { module.exports = ".privacy-card {\n  width: 80%;\n  max-width: 800px;\n  margin: 5% auto; }\n  .privacy-card .privacy-card-text {\n    font-size: 16px;\n    line-height: 24px; }\n    .privacy-card .privacy-card-text p {\n      margin: 0 0 20px;\n      font-size: 16px; }\n"; });
define('text!nav-bar/nav-bar.html', ['module'], function(module) { module.exports = "<template>\n    <nav class=\"mdl-navigation mdl-layout--large-screen-only\">\n        <a class=\"mdl-navigation__link\" route-href=\"route: logout\" if.bind=\"isAuthenticated\">Logout</a>\n    </nav>\n</template>\n"; });
define('text!privacy/privacy.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./privacy.css\"></require>\n    <div class=\"mdl-card mdl-shadow--2dp privacy-card\">\n        <div class=\"mdl-card__title privacy-card-header\">\n            <h2 class=\"mdl-card__title-text privacy-card-title\">${title}</h2>\n        </div>\n        <div class=\"mdl-card__supporting-text privacy-card-text\">\n            <p>We Own You</p>\n            <p>Our plan is to infiltrate your home then take over your lives and finally classically condition your pooping time to coincide with your favourite show</p>\n            <div>For more information, you can reach us at <a href=\"mailto:support@homeconnect.com\" target=\"_top\">support@homeconnect.com</a></div>\n        </div>\n        <div class=\"mdl-card__actions mdl-card--border\">\n            <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" route-href=\"route: home\" title=\"Go Home\">Home</a>\n        </div>\n    </div>\n</template>\n"; });
define('text!side-bar/side-bar.html', ['module'], function(module) { module.exports = "<template>\n    <nav class=\"mdl-navigation\">\n        <a class=\"mdl-navigation__link\" route-href=\"route: logout\" if.bind=\"isAuthenticated\">Logout</a>\n    </nav>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map