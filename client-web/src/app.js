export class App {
    configureRouter(config, router) {
        this.router = router;
        config.title = "Home Automation";
        config.map([
            {
                route: ["", "home"],
                name: "home",
                moduleId: "home/home"
            },
            {
                route: "login",
                name: "login",
                moduleId: "login/login"
            }
        ]);
    }
}
