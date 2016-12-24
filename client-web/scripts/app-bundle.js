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
        baseUrl: 'http://localhost:8080',
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
                    title: 'Login',
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
                }]);
            };

            this.router.configure(appRouterConfig);
        };

        return _default;
    }()) || _class);

    exports.default = _default;
});
define('device/device',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Home = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Home = exports.Home = function Home() {
        _classCallCheck(this, Home);

        this.title = "Configure your HomeConnect device";
    };
});
define('home/home',['exports', 'aurelia-framework', '../http'], function (exports, _aureliaFramework, _http) {
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

    var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_http.CustomHttpClient), _dec(_class = function () {
        function Home(http) {
            _classCallCheck(this, Home);

            this.title = "Choose your home";

            this.http = http;
        }

        Home.prototype.activate = function activate() {
            var _this = this;

            this.http.fetch("/home").then(function (response) {
                return response.json();
            }).then(function (data) {
                _this.homes = data.home;
            });
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

            this.title = "Add new home";
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
            });
        };

        return newHome;
    }()) || _class);
});
define('home/viewHome',['exports', 'aurelia-framework', 'aurelia-router', '../http'], function (exports, _aureliaFramework, _aureliaRouter, _http) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.viewHome = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var viewHome = exports.viewHome = (_dec = (0, _aureliaFramework.inject)(_http.CustomHttpClient, _aureliaRouter.Router), _dec(_class = function () {
        function viewHome(http, router) {
            _classCallCheck(this, viewHome);

            this.http = http;
            this.router = router;
        }

        viewHome.prototype.activate = function activate(params) {
            var _this = this;

            this.http.fetch("/home/" + params.homeId).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this.message = data.message;
                if (data.home) {
                    _this.home = data.home;
                }
            });
        };

        viewHome.prototype.removeHome = function removeHome() {
            var _this2 = this;

            this.http.fetch("/home/" + this.home._id, {
                method: "DELETE"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this2.message = data.message;
                _this2.router.navigateToRoute("home");
            });
        };

        viewHome.prototype.addRoom = function addRoom() {
            var _this3 = this;

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
                _this3.message = data.message;
                if (data.home) {
                    _this3.home = data.home;
                    _this3.newRoomName = "";
                }
            });
        };

        viewHome.prototype.removeRoom = function removeRoom(roomId) {
            var _this4 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId, {
                method: "DELETE"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this4.message = data.message;
                if (data.home) {
                    _this4.home = data.home;
                }
            });
        };

        viewHome.prototype.addTerminal = function addTerminal(roomId) {
            var _this5 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/newTerminal", {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "terminalName": this.newTerminalName, "terminalType": this.newTerminalType })
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this5.message = data.message;
                if (data.home) {
                    _this5.home = data.home;
                    _this5.newTerminalName = "";
                    _this5.newTerminalType = "";
                }
            });
        };

        viewHome.prototype.unlinkTerminal = function unlinkTerminal(roomId, terminalId) {
            var _this6 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/unlink", {
                method: "GET"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this6.message = data.message;
                if (data.home) {
                    _this6.home = data.home;
                }
            });
        };

        viewHome.prototype.refreshTerminal = function refreshTerminal(roomId, terminalId) {
            var _this7 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/refresh", {
                method: "GET"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this7.message = data.message;
                if (data.home) {
                    _this7.home = data.home;
                }
            });
        };

        viewHome.prototype.removeTerminal = function removeTerminal(roomId, terminalId) {
            var _this8 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId, {
                method: "DELETE"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this8.message = data.message;
                if (data.home) {
                    _this8.home = data.home;
                }
            });
        };

        viewHome.prototype.setTerminalState = function setTerminalState(roomId, terminalId, state) {
            var _this9 = this;

            this.http.fetch("/home/" + this.home._id + "/room/" + roomId + "/terminal/" + terminalId + "/" + state, {
                method: "GET"
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this9.message = data.message;
                if (data.home) {
                    _this9.home = data.home;
                }
            });
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
            'Accept': 'application/json'
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\">\n    <require from=\"material-design-lite/material.min.css\"></require>\n    <require from='nav-bar/nav-bar'></require>\n    <require from='side-bar/side-bar'></require>\n    <require from=\"./app.css\"></require>\n    <div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header home-layout mdl-layout--no-desktop-drawer-button\">\n        <header class=\"mdl-layout__header mdl-layout__header--seamed mdl-color--grey-800\">\n            <div class=\"mdl-layout__header-row\">\n                <span class=\"mdl-layout-title\">Home Connect</span>\n                <div class=\"mdl-layout-spacer\"></div>\n                <nav-bar router.bind=\"router\"></nav-bar>\n            </div>\n        </header>\n        <div class=\"mdl-layout__drawer\">\n            <span class=\"mdl-layout-title\">Home Connect</span>\n            <side-bar router.bind=\"router\"></side-bar>\n        </div>\n        <main class=\"mdl-layout__content\">\n            <div class=\"page-content\">\n                <div class=\"container\">\n                    <router-view></router-view>\n                </div>\n            </div>\n        </main>\n    </div>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = ".home-layout {\n  background: url(\"/assets/home.jpg\") center/cover; }\n\n.mdl-dialog__title {\n  font-size: 2rem; }\n\n.mdl-textfield__label:after {\n  background: gray; }\n"; });
define('text!device/device.html', ['module'], function(module) { module.exports = "<template>\n    <h1>${title}</h1>\n    <h4><a href=\"#\">Click here to download HomeConnect</a></h4>\n    <div>You will need to install HomeConnect to link your devices</div>\n    <div>The following are the steps required before you use HomeConnect</div>\n    <div>You can download the application while you do the following so you don't have to wait later</div>\n    <ol>\n        <li>Create your Home</li>\n        <li>Add Rooms to you Home</li>\n        <li>Add Lights, Fans and other end points in your Rooms</li>\n        <li>Download and install the HomeConnect application</li>\n        <li>Once installed, open the HomeConnect application</li>\n    </ol>\n    <div>Now that you have installed the HomeConnect application on your machine</div>\n    <div>The follow the below steps to link your devices to your HomeConnect account</div>\n    <ol>\n        <li>Sign in into the HomeConnect application using your HomeConnect account</li>\n        <li>Choose your HOME network, which will allow the devices to connect to the internet</li>\n        <ul>\n            <li>If you are prompted by your system to allow network modification access, grant the required access to connect to the device network</li>\n        </ul>\n        <li>Choose the device you wish to connect to using the password you received with the device</li>\n        <ul>\n            <li>In case you have lost the password, send us a mail at <a href=\"mailto:support@homeconnect.com\" target=\"_top\">support@homeconnect.com</a></li>\n        </ul>\n        <li>Select the end points you would like to connect the selected device to</li>\n        <li>Click SAVE</li>\n        <li>Sign into homeconnect.com and control your home</li>\n    </ol>\n    <p>Congratulations</p>\n    <div>We would like to know your experience with HomeConnect, while feedback/suggestions/queries are welcome we simply enjoy knowing that our product is useful to you and is a part of your home. So please spare a few minutes in writing to us at <a href=\"mailto:hi@homeconnect.com\" target=\"_top\">hi@homeconnect.com</a></div>\n    <hr>\n    <a route-href=\"route: home\" title=\"Go Home\">Home</a>\n</template>\n"; });
define('text!login/login.css', ['module'], function(module) { module.exports = ".login-layout {\n  align-items: center;\n  justify-content: center; }\n  .login-layout .login-layout-content {\n    padding: 24px;\n    flex: none; }\n"; });
define('text!home/home.html', ['module'], function(module) { module.exports = "<template>\n    <h1>${title}</h1>\n    <div repeat.for=\"home of homes\">\n        <a route-href=\"route: viewHome; params.bind: { homeId: home._id }\" title=\"View Home\">${home.homeName}</a>\n    </div>\n    <hr>\n    <a route-href=\"route: newHome\" title=\"Add A Home\">Add HOME</a>\n</template>\n"; });
define('text!home/newHome.html', ['module'], function(module) { module.exports = "<template>\n    <h1>${title}</h1>\n    <form role=\"form\" submit.delegate=\"add()\">\n        <div>\n            <div>\n                <label for=\"homeName\">Home Name</label>\n                <input name=\"homeName\" id=\"homeName\" type=\"text\" value.bind=\"homeName\">\n            </div>\n        </div>\n        <div>\n            <div>\n                <label for=\"address\">Address</label>\n                <input name=\"address\" id=\"address\" type=\"text\" value.bind=\"address\">\n            </div>\n        </div>\n        <div>\n            <button type=\"submit\">Add</button>\n        </div>\n    </form>\n    <hr>\n    <div>${message}</div>\n    <a route-href=\"route: home\" title=\"Cancel\">Back</a>\n</template>\n"; });
define('text!home/viewHome.html', ['module'], function(module) { module.exports = "<template>\n    <h1>${home.homeName}</h1>\n    <div>${home.address}</div>\n    <div repeat.for=\"room of home.rooms\">\n        <div>${room.roomName}</div>\n        <div repeat.for=\"terminal of room.terminals\">\n            <div>${terminal.terminalName}</div>\n            <div>${terminal.type}</div>\n            <div>${terminal.state}</div>\n            <div if.bind=\"terminal.linked\">\n                <div if.bind=\"terminal.synced\">\n                    <button type=\"button\" click.delegate=\"setTerminalState(room._id, terminal._id, 'toggle')\">Toggle</button>\n                    <button type=\"button\" click.delegate=\"setTerminalState(room._id, terminal._id, 'on')\" if.bind=\"!terminal.state\">On</button>\n                    <button type=\"button\" click.delegate=\"setTerminalState(room._id, terminal._id, 'off')\" if.bind=\"terminal.state\">Off</button>\n                </div>\n                <div if.bind=\"!terminal.synced\">\n                    <button type=\"button\" click.delegate=\"refreshTerminal(room._id, terminal._id)\">Refresh</button>\n                </div>\n                <div>\n                    <button type=\"button\" click.delegate=\"unlinkTerminal(room._id, terminal._id)\">Unlink Device</button>\n                </div>\n            </div>\n            <div if.bind=\"!terminal.linked\">\n                <div>\n                    <a route-href=\"route: device\" title=\"Link Device\">Link Device</a>\n                </div>\n                <div>\n                    <button type=\"button\" click.delegate=\"removeTerminal(room._id, terminal._id)\">Remove Terminal</button>\n                </div>\n            </div>\n            <hr>\n        </div>\n        <div>\n            <div>\n                <input name=\"newTerminalName\" id=\"newTerminalName\" type=\"text\" value.bind=\"$parent.newTerminalName\">\n            </div>\n            <div>\n                <select name=\"newTerminalType\" id=\"newTerminalType\" value.bind=\"$parent.newTerminalType\">\n                    <option value=\"\">Select</option>\n                    <option value=\"light\">Light</option>\n                    <option value=\"fan\">Fan</option>\n                </select>\n            </div>\n            <div>\n                <button type=\"button\" click.delegate=\"addTerminal(room._id)\">Add Terminal</button>\n            </div>\n        </div>\n        <button type=\"button\" click.delegate=\"removeRoom(room._id)\">Remove Room</button>\n        <hr>\n    </div>\n    <div>\n        <input name=\"newRoomName\" id=\"newRoomName\" type=\"text\" value.bind=\"newRoomName\">\n        <button type=\"button\" click.delegate=\"addRoom()\">Add Room</button>\n    </div>\n    <div>\n        <button type=\"button\" click.delegate=\"removeHome()\">DELETE</button>\n    </div>\n    <hr>\n    <div>${message}</div>\n    <a route-href=\"route: home\" title=\"Cancel\">Back</a>\n</template>\n"; });
define('text!login/login.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./login.css\"></require>\n    <div class=\"mdl-layout mdl-js-layout login-layout\" show.bind=\"!error\">\n        <main class=\"mdl-layout__content login-layout-content\">\n            <div class=\"mdl-card mdl-shadow--6dp\">\n                <form role=\"form\" submit.delegate=\"login()\">\n                    <div class=\"mdl-card__title mdl-color--grey-300\">\n                        <h2 class=\"mdl-card__title-text\">${title}</h2>\n                    </div>\n                    <div class=\"mdl-card__supporting-text\">\n                            <div class=\"mdl-textfield mdl-js-textfield\">\n                                <input class=\"mdl-textfield__input mdl-textfield__input--yellow\" type=\"text\" name=\"userName\" id=\"userName\" value.bind=\"userName\" />\n                                <label class=\"mdl-textfield__label\" for=\"userName\">User Name</label>\n                            </div>\n                            <div class=\"mdl-textfield mdl-js-textfield\">\n                                <input class=\"mdl-textfield__input\" type=\"password\" name=\"password\" id=\"password\" value.bind=\"password\" />\n                                <label class=\"mdl-textfield__label\" for=\"password\">Passcode</label>\n                            </div>\n                    </div>\n                    <div class=\"mdl-card__actions mdl-card--border\">\n                        <button type=\"submit\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\">Sign In</button>\n                    </div>\n                </form>\n            </div>\n        </main>\n    </div>\n    <dialog ref=\"dialog\" id=\"dialog\" class=\"mdl-dialog\">\n        <h3 class=\"mdl-dialog__title\">Access Denied</h3>\n        <div class=\"mdl-dialog__content\">\n            <p>${error}</p>\n        </div>\n        <div class=\"mdl-dialog__actions\">\n            <button type=\"button\" class=\"mdl-button\" click.delegate=\"closeDialog()\">Close</button>\n        </div>\n    </dialog>\n</template>\n"; });
define('text!logout/logout.html', ['module'], function(module) { module.exports = "<!-- Aurelia expects a template for each route.\nWe don't actuall need a template for logging out, \nbut we provide an empty one to not get any errors -->\n<template></template>"; });
define('text!nav-bar/nav-bar.html', ['module'], function(module) { module.exports = "<template>\n    <nav class=\"mdl-navigation mdl-layout--large-screen-only\">\n        <a class=\"mdl-navigation__link\" route-href=\"route: logout\" if.bind=\"isAuthenticated\">Logout</a>\n    </nav>\n</template>\n"; });
define('text!side-bar/side-bar.html', ['module'], function(module) { module.exports = "<template>\n    <nav class=\"mdl-navigation\">\n        <a class=\"mdl-navigation__link\" route-href=\"route: logout\" if.bind=\"isAuthenticated\">Logout</a>\n    </nav>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map