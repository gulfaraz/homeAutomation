define('app',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var App = exports.App = function () {
        function App() {
            _classCallCheck(this, App);
        }

        App.prototype.configureRouter = function configureRouter(config, router) {
            this.router = router;
            config.title = "Home Automation";
            config.map([{
                route: ["", "home"],
                name: "home",
                moduleId: "home/home"
            }, {
                route: "login",
                name: "login",
                moduleId: "login/login"
            }]);
        };

        return App;
    }();
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
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

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
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.use.plugin('aurelia-materialize-bridge', function (b) {
      return b.useAll();
    });

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('home/home',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Home = exports.Home = function Home() {
        _classCallCheck(this, Home);

        this.title = "Welcome";
    };
});
define('login/login',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Login = exports.Login = function Login() {
        _classCallCheck(this, Login);

        this.title = "Login";
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <h1>${title}</h1>\n    <require from=\"materialize-css/css/materialize.css\"></require>\n    <router-view></router-view>\n</template>\n"; });
define('text!home/home.html', ['module'], function(module) { module.exports = "<template>\n    <h1>${title}</h1>\n    <a route-href=\"route: login\" title=\"Login\">Click here to LOGIN</a>\n</template>\n"; });
define('text!login/login.html', ['module'], function(module) { module.exports = "<template>\n    <h1>${title}</h1>\n    <div class=\"row\">\n        <form class=\"col s12\" method=\"POST\" action=\"/login\">\n            <div class=\"row\">\n                <div class=\"input-field col s12 m12 l12\">\n                    <input name=\"userName\" id=\"userName\" type=\"text\" class=\"validate\">\n                    <label for=\"userName\">User Name</label>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"input-field col s12 m12 l12\">\n                    <input name=\"password\" id=\"password\" type=\"password\" class=\"validate\">\n                    <label for=\"password\">Password</label>\n                </div>\n            </div>\n            <div class=\"row\">\n                <button class=\"waves-effect waves-light btn\" type=\"submit\">Login</button>\n            </div>\n        </form>\n    </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map