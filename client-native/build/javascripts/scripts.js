!function(){angular.module("home",["ui.router"]).config(["$stateProvider","$urlRouterProvider",function(e,n){n.otherwise("/"),e.state("home",{url:"/",templateUrl:"home.html",controller:"HomeCtrl"})}]).controller("HomeCtrl",["$scope","$http","TerminalService","$state",function(e,n,t,o){e.fetchTerminals=function(){var n={userName:e.userName,password:e.password};t.fetchTerminals(n).then(function(n){n.data.terminals.length?(t.setTerminals(n.data.terminals),o.go("network")):e.message="No Terminals Available"},function(n){e.message=n.data.message})}}])}(),function(){angular.module("app",["home","manage","network","device"]).controller("AppCtrl",["$scope",function(e){e.title="Setup New Device"}]).factory("TerminalService",["$http",function(e){function n(e){i=e}function t(){return i}function o(n){return e({method:"POST",url:"http://localhost:8080/device/free",data:n})}function r(n,t){return e({method:"POST",url:"http://192.168.4.1/configure",data:{homeCredentials:n,deviceIdList:t}})}function s(){return e({method:"GET",url:"http://192.168.4.1/"})}var i=[];return{setTerminals:n,getTerminals:t,fetchTerminals:o,configureDevice:r,getDeviceConfiguration:s}}]).factory("NetworkService",[function(){function e(e,n,t){if(t||(t=function(){}),"Open"===e.security||n){var s={ssid:e.ssid,password:n};o.connectToAP(s,function(s,i){if(s)t(s);else{var c=o.getIfaceState();i.success&&c.ssid===e.ssid?(e.ssid.indexOf("newDevice-")===-1&&(r={ssid:e.ssid,password:n}),t(null,r)):t("failed")}})}else t("password")}function n(){return r}function t(e,n){o.scanForWiFi(function(t,o){if(t)n(t);else{var r=(o.networks,function(e){var n=[];for(var t in e){var o=!0,r=e[t];for(var s in n){var i=n[s];if(i.ssid===r.ssid){o=!1;break}}o&&n.push(r)}return n}(o.networks));n(null,r.filter(function(n){var t=0===n.ssid.indexOf("newDevice-");return e===t}))}})}var o=require("wifi-control");o.init();var r={ssid:null,password:null};return{find:t,connect:e,getCredentials:n}}])}(),function(){angular.module("device",["ui.router"]).config(["$stateProvider","$urlRouterProvider",function(e,n){n.otherwise("/"),e.state("device",{url:"/device",templateUrl:"device.html",controller:"DeviceCtrl"})}]).controller("DeviceCtrl",["$scope","NetworkService","$timeout","$state",function(e,n,t,o){e.scanMessage="Looking for devices...",e.scanDevices=function(){e.scanning=!0,n.find(!0,function(n,o){n&&(e.scanMessage=n,console.error(n)),t(function(){e.scanning=!1,e.devices=o,e.scanMessage="No Devices Found"})})},e.scanDevices(),e.connectDevice=function(r,s){e.connectMessage=null,n.connect(r,s,function(s,i){if(s){"password"===s?e.getPassword===r.ssid?e.connectMessage="Enter device password":e.getPassword=r.ssid:"failed"===s?e.connectMessage="Failed to connect to "+(r.ssid||"device"):(e.connectMessage="Unable to connect to device, verify password",console.error(s));var c=n.getCredentials();n.connect({ssid:c.ssid},c.password)}else t(function(){e.getPassword=null,e.connectMessage=null,o.go("manage")})})}}])}(),function(){angular.module("manage",["ui.router"]).config(["$stateProvider","$urlRouterProvider",function(e,n){n.otherwise("/"),e.state("manage",{url:"/manage",templateUrl:"manage.html",controller:"ManageCtrl"})}]).controller("ManageCtrl",["$scope","TerminalService","NetworkService","$timeout","$state",function(e,n,t,o,r){e.terminalList=n.getTerminals(),0===e.terminalList.length&&(alert("You do not have any terminals to configure"),r.go("home")),e.homeCredentials=t.getCredentials(),e.deviceIdList=[],e.switchList=[],n.getDeviceConfiguration().then(function(n){e.switchList.length=n.data.switchCount},function(n){e.message="Please check if you have connected to the correct device"}),e.getTerminalType=function(n){var t=null;for(var o in e.terminalList){var r=e.terminalList[o];if(r.terminalId===n){t=r.type;break}}return t},e.setupDevice=function(t,o){for(var r=0,s=e.switchList.length;r<s;r++){var i=o[r];i||(o[r]=["","",""])}n.configureDevice(t,o).then(function(e){console.log("Configuration Success")},function(e){console.log("Configuration Failed")})}}])}(),function(){angular.module("network",["ui.router"]).config(["$stateProvider","$urlRouterProvider",function(e,n){n.otherwise("/"),e.state("network",{url:"/network",templateUrl:"network.html",controller:"NetworkCtrl"})}]).controller("NetworkCtrl",["$scope","NetworkService","$timeout","$state",function(e,n,t,o){e.scanMessage="Looking for networks...",e.credentials=n.getCredentials(),e.changeNetwork=function(){e.showNetworkList=!0,e.scanNetworks()},e.scanNetworks=function(){e.scanning=!0,n.find(!1,function(n,o){n&&(e.scanMessage=n,console.error(n)),t(function(){e.scanning=!1,e.networks=o,e.scanMessage="No Networks Found"})})},e.selectNetwork=function(r,s){e.connectMessage=null,n.connect(r,s,function(n,s){n?"password"===n?e.getPassword===r.ssid?e.connectMessage="Enter network password":e.getPassword=r.ssid:"failed"===n?e.connectMessage="Failed to connect to "+(r.ssid||"network"):(e.connectMessage="Unable to connect to network, verify password",console.error(n)):t(function(){e.getPassword=null,e.connectMessage=null,e.credentials=s,e.showNetworkList=!1,o.go("device")})})}}])}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuanMiLCJpbmRleC5qcyIsImRldmljZS9kZXZpY2UuanMiLCJtYW5hZ2UvbWFuYWdlLmpzIiwibmV0d29yay9uZXR3b3JrLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCJzdGF0ZVByb3ZpZGVyIiwidXJsUm91dGVyUHJvdmlkZXIiLCJvdGhlcndpc2UiLCJzdGF0ZSIsInVybCIsInRlbXBsYXRlVXJsIiwiY29udHJvbGxlciIsInNjb3BlIiwiaHR0cCIsInRlcm1pbmFsU2VydmljZSIsImZldGNoVGVybWluYWxzIiwiY3JlZGVudGlhbHMiLCJ1c2VyTmFtZSIsInBhc3N3b3JkIiwidGhlbiIsInJlc3BvbnNlIiwiZGF0YSIsInRlcm1pbmFscyIsImxlbmd0aCIsInNldFRlcm1pbmFscyIsImdvIiwibWVzc2FnZSIsInRpdGxlIiwiZmFjdG9yeSIsInRlcm1pbmFsc0xpc3QiLCJnZXRUZXJtaW5hbHMiLCJtZXRob2QiLCJjb25maWd1cmVEZXZpY2UiLCJob21lQ3JlZGVudGlhbHMiLCJkZXZpY2VJZExpc3QiLCJnZXREZXZpY2VDb25maWd1cmF0aW9uIiwiY29ubmVjdCIsIm5ldHdvcmsiLCJjYWxsYmFjayIsInNlY3VyaXR5IiwibmV0d29ya0NyZWRlbnRpYWxzIiwic3NpZCIsIldpRmlDb250cm9sIiwiY29ubmVjdFRvQVAiLCJlcnJvciIsImludGVyZmFjZVN0YXRlIiwiZ2V0SWZhY2VTdGF0ZSIsInN1Y2Nlc3MiLCJpbmRleE9mIiwiZ2V0Q3JlZGVudGlhbHMiLCJmaW5kIiwiaXNEZXZpY2UiLCJzY2FuRm9yV2lGaSIsInVuaXF1ZU5ldHdvcmtzIiwibmV0d29ya3MiLCJuZXR3b3JrSW5kZXgiLCJpc1VuaXF1ZSIsInVuaXF1ZU5ldHdvcmtJbmRleCIsInVuaXF1ZU5ldHdvcmsiLCJwdXNoIiwiZmlsdGVyIiwiaXNEZXZpY2VOZXR3b3JrIiwicmVxdWlyZSIsImluaXQiLCJuZXR3b3JrU2VydmljZSIsInRpbWVvdXQiLCJzY2FuTWVzc2FnZSIsInNjYW5EZXZpY2VzIiwic2Nhbm5pbmciLCJkZXZpY2VzIiwiY29uc29sZSIsImNvbm5lY3REZXZpY2UiLCJjb25uZWN0TWVzc2FnZSIsImdldFBhc3N3b3JkIiwidGVybWluYWxMaXN0IiwiYWxlcnQiLCJzd2l0Y2hMaXN0Iiwic3dpdGNoQ291bnQiLCJnZXRUZXJtaW5hbFR5cGUiLCJ0ZXJtaW5hbElkIiwidHlwZSIsInRlcm1pbmFsSW5kZXgiLCJ0ZXJtaW5hbCIsInNldHVwRGV2aWNlIiwiZGV2aWNlSWRJbmRleCIsImxlbiIsImRldmljZUlkIiwibG9nIiwiY2hhbmdlTmV0d29yayIsInNob3dOZXR3b3JrTGlzdCIsInNjYW5OZXR3b3JrcyIsInNlbGVjdE5ldHdvcmsiXSwibWFwcGluZ3MiOiJDQUFBLFdBQ0FBLFFBQUFDLE9BQUEsUUFBQSxjQUNBQyxRQUFBLGlCQUFBLHFCQUFBLFNBQUFDLEVBQUFDLEdBQ0FBLEVBQUFDLFVBQUEsS0FDQUYsRUFDQUcsTUFBQSxRQUNBQyxJQUFBLElBQ0FDLFlBQUEsWUFDQUMsV0FBQSxnQkFHQUEsV0FBQSxZQUFBLFNBQUEsUUFBQSxrQkFBQSxTQUFBLFNBQUFDLEVBQUFDLEVBQUFDLEVBQUFOLEdBQ0FJLEVBQUFHLGVBQUEsV0FDQSxHQUFBQyxJQUNBQyxTQUFBTCxFQUFBSyxTQUNBQyxTQUFBTixFQUFBTSxTQUVBSixHQUFBQyxlQUFBQyxHQUFBRyxLQUFBLFNBQUFDLEdBQ0FBLEVBQUFDLEtBQUFDLFVBQUFDLFFBQ0FULEVBQUFVLGFBQUFKLEVBQUFDLEtBQUFDLFdBQ0FkLEVBQUFpQixHQUFBLFlBRUFiLEVBQUFjLFFBQUEsMEJBRUEsU0FBQU4sR0FDQVIsRUFBQWMsUUFBQU4sRUFBQUMsS0FBQUssaUJDekJBLFdBQ0F4QixRQUFBQyxPQUFBLE9BQUEsT0FBQSxTQUFBLFVBQUEsV0FDQVEsV0FBQSxXQUFBLFNBQUEsU0FBQUMsR0FDQUEsRUFBQWUsTUFBQSxzQkFFQUMsUUFBQSxtQkFBQSxRQUFBLFNBQUFmLEdBSUEsUUFBQVcsR0FBQUssR0FDQVAsRUFBQU8sRUFHQSxRQUFBQyxLQUNBLE1BQUFSLEdBR0EsUUFBQVAsR0FBQUMsR0FDQSxNQUFBSCxJQUNBa0IsT0FBQSxPQUNBdEIsSUFBQSxvQ0FDQVksS0FBQUwsSUFJQSxRQUFBZ0IsR0FBQUMsRUFBQUMsR0FDQSxNQUFBckIsSUFDQWtCLE9BQUEsT0FDQXRCLElBQUEsK0JBQ0FZLE1BQ0FZLGdCQUFBQSxFQUNBQyxhQUFBQSxLQUtBLFFBQUFDLEtBQ0EsTUFBQXRCLElBQ0FrQixPQUFBLE1BQ0F0QixJQUFBLHdCQWhDQSxHQUFBYSxLQW9DQSxRQUNBRSxhQUFBQSxFQUNBTSxhQUFBQSxFQUNBZixlQUFBQSxFQUNBaUIsZ0JBQUFBLEVBQ0FHLHVCQUFBQSxNQUdBUCxRQUFBLGtCQUFBLFdBV0EsUUFBQVEsR0FBQUMsRUFBQW5CLEVBQUFvQixHQUlBLEdBSEFBLElBQ0FBLEVBQUEsY0FFQSxTQUFBRCxFQUFBRSxVQUFBckIsRUFBQSxDQUNBLEdBQUFzQixJQUNBQyxLQUFBSixFQUFBSSxLQUNBdkIsU0FBQUEsRUFFQXdCLEdBQUFDLFlBQUFILEVBQUEsU0FBQUksRUFBQXhCLEdBQ0EsR0FBQXdCLEVBQ0FOLEVBQUFNLE9BQ0EsQ0FDQSxHQUFBQyxHQUFBSCxFQUFBSSxlQUNBMUIsR0FBQTJCLFNBQUFGLEVBQUFKLE9BQUFKLEVBQUFJLE1BQ0FKLEVBQUFJLEtBQUFPLFFBQUEsaUJBQUEsSUFDQWYsR0FDQVEsS0FBQUosRUFBQUksS0FDQXZCLFNBQUFBLElBR0FvQixFQUFBLEtBQUFMLElBRUFLLEVBQUEsaUJBS0FBLEdBQUEsWUFJQSxRQUFBVyxLQUNBLE1BQUFoQixHQUdBLFFBQUFpQixHQUFBQyxFQUFBYixHQUNBSSxFQUFBVSxZQUFBLFNBQUFSLEVBQUF4QixHQUNBLEdBQUF3QixFQUNBTixFQUFBTSxPQUNBLENBQ0EsR0FDQVMsSUFEQWpDLEVBQUFrQyxTQUNBLFNBQUFBLEdBQ0EsR0FBQUQsS0FDQSxLQUFBLEdBQUFFLEtBQUFELEdBQUEsQ0FDQSxHQUFBRSxJQUFBLEVBQ0FuQixFQUFBaUIsRUFBQUMsRUFDQSxLQUFBLEdBQUFFLEtBQUFKLEdBQUEsQ0FDQSxHQUFBSyxHQUFBTCxFQUFBSSxFQUNBLElBQUFDLEVBQUFqQixPQUFBSixFQUFBSSxLQUFBLENBQ0FlLEdBQUEsQ0FDQSxRQUdBQSxHQUNBSCxFQUFBTSxLQUFBdEIsR0FHQSxNQUFBZ0IsSUFDQWpDLEVBQUFrQyxVQUNBaEIsR0FBQSxLQUFBZSxFQUFBTyxPQUFBLFNBQUF2QixHQUNBLEdBQUF3QixHQUFBLElBQUF4QixFQUFBSSxLQUFBTyxRQUFBLGFBQ0EsT0FBQUcsS0FBQVUsUUF2RUEsR0FBQW5CLEdBQUFvQixRQUFBLGVBRUFwQixHQUFBcUIsTUFFQSxJQUFBOUIsSUFDQVEsS0FBQSxLQUNBdkIsU0FBQSxLQXVFQSxRQUNBZ0MsS0FBQUEsRUFDQWQsUUFBQUEsRUFDQWEsZUFBQUEsU0NySUEsV0FDQS9DLFFBQUFDLE9BQUEsVUFBQSxjQUNBQyxRQUFBLGlCQUFBLHFCQUFBLFNBQUFDLEVBQUFDLEdBQ0FBLEVBQUFDLFVBQUEsS0FDQUYsRUFDQUcsTUFBQSxVQUNBQyxJQUFBLFVBQ0FDLFlBQUEsY0FDQUMsV0FBQSxrQkFHQUEsV0FBQSxjQUFBLFNBQUEsaUJBQUEsV0FBQSxTQUFBLFNBQUFDLEVBQUFvRCxFQUFBQyxFQUFBekQsR0FFQUksRUFBQXNELFlBQUEseUJBRUF0RCxFQUFBdUQsWUFBQSxXQUNBdkQsRUFBQXdELFVBQUEsRUFDQUosRUFBQWQsTUFBQSxFQUFBLFNBQUFOLEVBQUF5QixHQUNBekIsSUFDQWhDLEVBQUFzRCxZQUFBdEIsRUFDQTBCLFFBQUExQixNQUFBQSxJQUVBcUIsRUFBQSxXQUNBckQsRUFBQXdELFVBQUEsRUFDQXhELEVBQUF5RCxRQUFBQSxFQUNBekQsRUFBQXNELFlBQUEsd0JBS0F0RCxFQUFBdUQsY0FFQXZELEVBQUEyRCxjQUFBLFNBQUFsQyxFQUFBbkIsR0FDQU4sRUFBQTRELGVBQUEsS0FDQVIsRUFBQTVCLFFBQUFDLEVBQUFuQixFQUFBLFNBQUEwQixFQUFBNUIsR0FDQSxHQUFBNEIsRUFBQSxDQUNBLGFBQUFBLEVBQ0FoQyxFQUFBNkQsY0FBQXBDLEVBQUFJLEtBQ0E3QixFQUFBNEQsZUFBQSx3QkFFQTVELEVBQUE2RCxZQUFBcEMsRUFBQUksS0FFQSxXQUFBRyxFQUNBaEMsRUFBQTRELGVBQUEseUJBQUFuQyxFQUFBSSxNQUFBLFdBRUE3QixFQUFBNEQsZUFBQSwrQ0FDQUYsUUFBQTFCLE1BQUFBLEdBRUEsSUFBQVgsR0FBQStCLEVBQUFmLGdCQUNBZSxHQUFBNUIsU0FBQUssS0FBQVIsRUFBQVEsTUFBQVIsRUFBQWYsY0FFQStDLEdBQUEsV0FDQXJELEVBQUE2RCxZQUFBLEtBQ0E3RCxFQUFBNEQsZUFBQSxLQUNBaEUsRUFBQWlCLEdBQUEscUJDdERBLFdBQ0F2QixRQUFBQyxPQUFBLFVBQUEsY0FDQUMsUUFBQSxpQkFBQSxxQkFBQSxTQUFBQyxFQUFBQyxHQUNBQSxFQUFBQyxVQUFBLEtBQ0FGLEVBQ0FHLE1BQUEsVUFDQUMsSUFBQSxVQUNBQyxZQUFBLGNBQ0FDLFdBQUEsa0JBR0FBLFdBQUEsY0FBQSxTQUFBLGtCQUFBLGlCQUFBLFdBQUEsU0FBQSxTQUFBQyxFQUFBRSxFQUFBa0QsRUFBQUMsRUFBQXpELEdBRUFJLEVBQUE4RCxhQUFBNUQsRUFBQWdCLGVBQ0EsSUFBQWxCLEVBQUE4RCxhQUFBbkQsU0FDQW9ELE1BQUEsOENBQ0FuRSxFQUFBaUIsR0FBQSxTQUdBYixFQUFBcUIsZ0JBQUErQixFQUFBZixpQkFFQXJDLEVBQUFzQixnQkFFQXRCLEVBQUFnRSxjQUVBOUQsRUFBQXFCLHlCQUFBaEIsS0FBQSxTQUFBQyxHQUNBUixFQUFBZ0UsV0FBQXJELE9BQUFILEVBQUFDLEtBQUF3RCxhQUNBLFNBQUF6RCxHQUNBUixFQUFBYyxRQUFBLDZEQUdBZCxFQUFBa0UsZ0JBQUEsU0FBQUMsR0FDQSxHQUFBQyxHQUFBLElBQ0EsS0FBQSxHQUFBQyxLQUFBckUsR0FBQThELGFBQUEsQ0FDQSxHQUFBUSxHQUFBdEUsRUFBQThELGFBQUFPLEVBQ0EsSUFBQUMsRUFBQUgsYUFBQUEsRUFBQSxDQUNBQyxFQUFBRSxFQUFBRixJQUNBLFFBR0EsTUFBQUEsSUFHQXBFLEVBQUF1RSxZQUFBLFNBQUFsRCxFQUFBQyxHQUNBLElBQUEsR0FBQWtELEdBQUEsRUFBQUMsRUFBQXpFLEVBQUFnRSxXQUFBckQsT0FBQTZELEVBQUFDLEVBQUFELElBQUEsQ0FDQSxHQUFBRSxHQUFBcEQsRUFBQWtELEVBQ0FFLEtBQ0FwRCxFQUFBa0QsSUFBQSxHQUFBLEdBQUEsS0FHQXRFLEVBQUFrQixnQkFBQUMsRUFBQUMsR0FBQWYsS0FBQSxTQUFBQyxHQUNBa0QsUUFBQWlCLElBQUEsMEJBQ0EsU0FBQW5FLEdBQ0FrRCxRQUFBaUIsSUFBQSxpQ0NyREEsV0FDQXJGLFFBQUFDLE9BQUEsV0FBQSxjQUNBQyxRQUFBLGlCQUFBLHFCQUFBLFNBQUFDLEVBQUFDLEdBQ0FBLEVBQUFDLFVBQUEsS0FDQUYsRUFDQUcsTUFBQSxXQUNBQyxJQUFBLFdBQ0FDLFlBQUEsZUFDQUMsV0FBQSxtQkFHQUEsV0FBQSxlQUFBLFNBQUEsaUJBQUEsV0FBQSxTQUFBLFNBQUFDLEVBQUFvRCxFQUFBQyxFQUFBekQsR0FFQUksRUFBQXNELFlBQUEsMEJBRUF0RCxFQUFBSSxZQUFBZ0QsRUFBQWYsaUJBRUFyQyxFQUFBNEUsY0FBQSxXQUNBNUUsRUFBQTZFLGlCQUFBLEVBQ0E3RSxFQUFBOEUsZ0JBR0E5RSxFQUFBOEUsYUFBQSxXQUNBOUUsRUFBQXdELFVBQUEsRUFDQUosRUFBQWQsTUFBQSxFQUFBLFNBQUFOLEVBQUFVLEdBQ0FWLElBQ0FoQyxFQUFBc0QsWUFBQXRCLEVBQ0EwQixRQUFBMUIsTUFBQUEsSUFFQXFCLEVBQUEsV0FDQXJELEVBQUF3RCxVQUFBLEVBQ0F4RCxFQUFBMEMsU0FBQUEsRUFDQTFDLEVBQUFzRCxZQUFBLHlCQUtBdEQsRUFBQStFLGNBQUEsU0FBQXRELEVBQUFuQixHQUNBTixFQUFBNEQsZUFBQSxLQUNBUixFQUFBNUIsUUFBQUMsRUFBQW5CLEVBQUEsU0FBQTBCLEVBQUE1QixHQUNBNEIsRUFDQSxhQUFBQSxFQUNBaEMsRUFBQTZELGNBQUFwQyxFQUFBSSxLQUNBN0IsRUFBQTRELGVBQUEseUJBRUE1RCxFQUFBNkQsWUFBQXBDLEVBQUFJLEtBRUEsV0FBQUcsRUFDQWhDLEVBQUE0RCxlQUFBLHlCQUFBbkMsRUFBQUksTUFBQSxZQUVBN0IsRUFBQTRELGVBQUEsZ0RBQ0FGLFFBQUExQixNQUFBQSxJQUdBcUIsRUFBQSxXQUNBckQsRUFBQTZELFlBQUEsS0FDQTdELEVBQUE0RCxlQUFBLEtBQ0E1RCxFQUFBSSxZQUFBQSxFQUNBSixFQUFBNkUsaUJBQUEsRUFDQWpGLEVBQUFpQixHQUFBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIGFuZ3VsYXIubW9kdWxlKFwiaG9tZVwiLCBbIFwidWkucm91dGVyXCIgXSlcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCBcIiR1cmxSb3V0ZXJQcm92aWRlclwiLCBmdW5jdGlvbiAoc3RhdGVQcm92aWRlciwgdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9cIik7XG4gICAgICAgICAgICBzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLnN0YXRlKFwiaG9tZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImhvbWUuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkhvbWVDdHJsXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfV0pXG4gICAgICAgIC5jb250cm9sbGVyKFwiSG9tZUN0cmxcIiwgWyBcIiRzY29wZVwiLCBcIiRodHRwXCIsIFwiVGVybWluYWxTZXJ2aWNlXCIsIFwiJHN0YXRlXCIsIGZ1bmN0aW9uIChzY29wZSwgaHR0cCwgdGVybWluYWxTZXJ2aWNlLCBzdGF0ZSkge1xuICAgICAgICAgICAgc2NvcGUuZmV0Y2hUZXJtaW5hbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IHNjb3BlLnVzZXJOYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IHNjb3BlLnBhc3N3b3JkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0ZXJtaW5hbFNlcnZpY2UuZmV0Y2hUZXJtaW5hbHMoY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLmRhdGEudGVybWluYWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVybWluYWxTZXJ2aWNlLnNldFRlcm1pbmFscyhyZXNwb25zZS5kYXRhLnRlcm1pbmFscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5nbyhcIm5ldHdvcmtcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5tZXNzYWdlID0gXCJObyBUZXJtaW5hbHMgQXZhaWxhYmxlXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLmRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwXCIsIFsgXCJob21lXCIsIFwibWFuYWdlXCIsIFwibmV0d29ya1wiLCBcImRldmljZVwiIF0pXG4gICAgICAgIC5jb250cm9sbGVyKFwiQXBwQ3RybFwiLCBbIFwiJHNjb3BlXCIsIGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUudGl0bGUgPSBcIlNldHVwIE5ldyBEZXZpY2VcIjtcbiAgICAgICAgfV0pXG4gICAgICAgIC5mYWN0b3J5KFwiVGVybWluYWxTZXJ2aWNlXCIsIFsgXCIkaHR0cFwiLCBmdW5jdGlvbiAoaHR0cCkge1xuXG4gICAgICAgICAgICB2YXIgdGVybWluYWxzID0gW107XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldFRlcm1pbmFscyh0ZXJtaW5hbHNMaXN0KSB7XG4gICAgICAgICAgICAgICAgdGVybWluYWxzID0gdGVybWluYWxzTGlzdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0VGVybWluYWxzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXJtaW5hbHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZldGNoVGVybWluYWxzKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2RldmljZS9mcmVlXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGNyZWRlbnRpYWxzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbmZpZ3VyZURldmljZShob21lQ3JlZGVudGlhbHMsIGRldmljZUlkTGlzdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly8xOTIuMTY4LjQuMS9jb25maWd1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaG9tZUNyZWRlbnRpYWxzXCIgOiBob21lQ3JlZGVudGlhbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRldmljZUlkTGlzdFwiIDogZGV2aWNlSWRMaXN0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0RGV2aWNlQ29uZmlndXJhdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly8xOTIuMTY4LjQuMS9cIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNldFRlcm1pbmFsczogc2V0VGVybWluYWxzLFxuICAgICAgICAgICAgICAgIGdldFRlcm1pbmFsczogZ2V0VGVybWluYWxzLFxuICAgICAgICAgICAgICAgIGZldGNoVGVybWluYWxzOiBmZXRjaFRlcm1pbmFscyxcbiAgICAgICAgICAgICAgICBjb25maWd1cmVEZXZpY2U6IGNvbmZpZ3VyZURldmljZSxcbiAgICAgICAgICAgICAgICBnZXREZXZpY2VDb25maWd1cmF0aW9uOiBnZXREZXZpY2VDb25maWd1cmF0aW9uXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XSlcbiAgICAgICAgLmZhY3RvcnkoXCJOZXR3b3JrU2VydmljZVwiLCBbIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIFdpRmlDb250cm9sID0gcmVxdWlyZShcIndpZmktY29udHJvbFwiKTtcblxuICAgICAgICAgICAgV2lGaUNvbnRyb2wuaW5pdCgpO1xuXG4gICAgICAgICAgICB2YXIgaG9tZUNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgIFwic3NpZFwiIDogbnVsbCxcbiAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCIgOiBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjb25uZWN0KG5ldHdvcmssIHBhc3N3b3JkLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihuZXR3b3JrLnNlY3VyaXR5ID09PSBcIk9wZW5cIiB8fCBwYXNzd29yZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV0d29ya0NyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzc2lkXCIgOiBuZXR3b3JrLnNzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCIgOiBwYXNzd29yZFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBXaUZpQ29udHJvbC5jb25uZWN0VG9BUChuZXR3b3JrQ3JlZGVudGlhbHMsIGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW50ZXJmYWNlU3RhdGUgPSBXaUZpQ29udHJvbC5nZXRJZmFjZVN0YXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3VjY2VzcyAmJiAoaW50ZXJmYWNlU3RhdGUuc3NpZCA9PT0gbmV0d29yay5zc2lkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihuZXR3b3JrLnNzaWQuaW5kZXhPZihcIm5ld0RldmljZS1cIikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob21lQ3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzc2lkXCIgOiBuZXR3b3JrLnNzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiIDogcGFzc3dvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgaG9tZUNyZWRlbnRpYWxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhcImZhaWxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKFwicGFzc3dvcmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRDcmVkZW50aWFscygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaG9tZUNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBmaW5kKGlzRGV2aWNlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIFdpRmlDb250cm9sLnNjYW5Gb3JXaUZpKGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGxOZXR3b3JrcyA9IHJlc3BvbnNlLm5ldHdvcmtzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVuaXF1ZU5ldHdvcmtzID0gKGZ1bmN0aW9uIChuZXR3b3Jrcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmlxdWVOZXR3b3JrcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgbmV0d29ya0luZGV4IGluIG5ldHdvcmtzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc1VuaXF1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXR3b3JrID0gbmV0d29ya3NbbmV0d29ya0luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB1bmlxdWVOZXR3b3JrSW5kZXggaW4gdW5pcXVlTmV0d29ya3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmlxdWVOZXR3b3JrID0gdW5pcXVlTmV0d29ya3NbdW5pcXVlTmV0d29ya0luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHVuaXF1ZU5ldHdvcmsuc3NpZCA9PT0gbmV0d29yay5zc2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNVbmlxdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpc1VuaXF1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pcXVlTmV0d29ya3MucHVzaChuZXR3b3JrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5pcXVlTmV0d29ya3M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KHJlc3BvbnNlLm5ldHdvcmtzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1bmlxdWVOZXR3b3Jrcy5maWx0ZXIoZnVuY3Rpb24gKG5ldHdvcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNEZXZpY2VOZXR3b3JrID0gKG5ldHdvcmsuc3NpZC5pbmRleE9mKFwibmV3RGV2aWNlLVwiKSA9PT0gMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpc0RldmljZSA9PT0gaXNEZXZpY2VOZXR3b3JrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFwiZmluZFwiIDogZmluZCxcbiAgICAgICAgICAgICAgICBcImNvbm5lY3RcIiA6IGNvbm5lY3QsXG4gICAgICAgICAgICAgICAgXCJnZXRDcmVkZW50aWFsc1wiIDogZ2V0Q3JlZGVudGlhbHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIGFuZ3VsYXIubW9kdWxlKFwiZGV2aWNlXCIsIFsgXCJ1aS5yb3V0ZXJcIiBdKVxuICAgICAgICAuY29uZmlnKFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJHVybFJvdXRlclByb3ZpZGVyXCIsIGZ1bmN0aW9uIChzdGF0ZVByb3ZpZGVyLCB1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAgICAgdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL1wiKTtcbiAgICAgICAgICAgIHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAuc3RhdGUoXCJkZXZpY2VcIiwge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2RldmljZVwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJkZXZpY2UuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkRldmljZUN0cmxcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XSlcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJEZXZpY2VDdHJsXCIsIFsgXCIkc2NvcGVcIiwgXCJOZXR3b3JrU2VydmljZVwiLCBcIiR0aW1lb3V0XCIsIFwiJHN0YXRlXCIsIGZ1bmN0aW9uIChzY29wZSwgbmV0d29ya1NlcnZpY2UsIHRpbWVvdXQsIHN0YXRlKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLnNjYW5NZXNzYWdlID0gXCJMb29raW5nIGZvciBkZXZpY2VzLi4uXCI7XG5cbiAgICAgICAgICAgIHNjb3BlLnNjYW5EZXZpY2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnNjYW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBuZXR3b3JrU2VydmljZS5maW5kKHRydWUsIGZ1bmN0aW9uIChlcnJvciwgZGV2aWNlcykge1xuICAgICAgICAgICAgICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nhbk1lc3NhZ2UgPSBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nhbm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmRldmljZXMgPSBkZXZpY2VzO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2Nhbk1lc3NhZ2UgPSBcIk5vIERldmljZXMgRm91bmRcIjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBzY29wZS5zY2FuRGV2aWNlcygpO1xuXG4gICAgICAgICAgICBzY29wZS5jb25uZWN0RGV2aWNlID0gZnVuY3Rpb24gKG5ldHdvcmssIHBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuY29ubmVjdE1lc3NhZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIG5ldHdvcmtTZXJ2aWNlLmNvbm5lY3QobmV0d29yaywgcGFzc3dvcmQsIGZ1bmN0aW9uIChlcnJvciwgY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVycm9yID09PSBcInBhc3N3b3JkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzY29wZS5nZXRQYXNzd29yZCA9PT0gbmV0d29yay5zc2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNvbm5lY3RNZXNzYWdlID0gXCJFbnRlciBkZXZpY2UgcGFzc3dvcmRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5nZXRQYXNzd29yZCA9IG5ldHdvcmsuc3NpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yID09PSBcImZhaWxlZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY29ubmVjdE1lc3NhZ2UgPSBcIkZhaWxlZCB0byBjb25uZWN0IHRvIFwiICsgKG5ldHdvcmsuc3NpZCB8fCBcImRldmljZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY29ubmVjdE1lc3NhZ2UgPSBcIlVuYWJsZSB0byBjb25uZWN0IHRvIGRldmljZSwgdmVyaWZ5IHBhc3N3b3JkXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG9tZUNyZWRlbnRpYWxzID0gbmV0d29ya1NlcnZpY2UuZ2V0Q3JlZGVudGlhbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldHdvcmtTZXJ2aWNlLmNvbm5lY3QoeyBzc2lkOiBob21lQ3JlZGVudGlhbHMuc3NpZCB9LCBob21lQ3JlZGVudGlhbHMucGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuZ2V0UGFzc3dvcmQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNvbm5lY3RNZXNzYWdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5nbyhcIm1hbmFnZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBhbmd1bGFyLm1vZHVsZShcIm1hbmFnZVwiLCBbIFwidWkucm91dGVyXCIgXSlcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCBcIiR1cmxSb3V0ZXJQcm92aWRlclwiLCBmdW5jdGlvbiAoc3RhdGVQcm92aWRlciwgdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9cIik7XG4gICAgICAgICAgICBzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLnN0YXRlKFwibWFuYWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9tYW5hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwibWFuYWdlLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJNYW5hZ2VDdHJsXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfV0pXG4gICAgICAgIC5jb250cm9sbGVyKFwiTWFuYWdlQ3RybFwiLCBbIFwiJHNjb3BlXCIsIFwiVGVybWluYWxTZXJ2aWNlXCIsIFwiTmV0d29ya1NlcnZpY2VcIiwgXCIkdGltZW91dFwiLCBcIiRzdGF0ZVwiLCBmdW5jdGlvbiAoc2NvcGUsIHRlcm1pbmFsU2VydmljZSwgbmV0d29ya1NlcnZpY2UsIHRpbWVvdXQsIHN0YXRlKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLnRlcm1pbmFsTGlzdCA9IHRlcm1pbmFsU2VydmljZS5nZXRUZXJtaW5hbHMoKTtcbiAgICAgICAgICAgIGlmKHNjb3BlLnRlcm1pbmFsTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIllvdSBkbyBub3QgaGF2ZSBhbnkgdGVybWluYWxzIHRvIGNvbmZpZ3VyZVwiKTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5nbyhcImhvbWVcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLmhvbWVDcmVkZW50aWFscyA9IG5ldHdvcmtTZXJ2aWNlLmdldENyZWRlbnRpYWxzKCk7XG5cbiAgICAgICAgICAgIHNjb3BlLmRldmljZUlkTGlzdCA9IFtdO1xuXG4gICAgICAgICAgICBzY29wZS5zd2l0Y2hMaXN0ID0gW107XG5cbiAgICAgICAgICAgIHRlcm1pbmFsU2VydmljZS5nZXREZXZpY2VDb25maWd1cmF0aW9uKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5zd2l0Y2hMaXN0Lmxlbmd0aCA9IHJlc3BvbnNlLmRhdGEuc3dpdGNoQ291bnQ7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5tZXNzYWdlID0gXCJQbGVhc2UgY2hlY2sgaWYgeW91IGhhdmUgY29ubmVjdGVkIHRvIHRoZSBjb3JyZWN0IGRldmljZVwiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNjb3BlLmdldFRlcm1pbmFsVHlwZSA9IGZ1bmN0aW9uICh0ZXJtaW5hbElkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgdGVybWluYWxJbmRleCBpbiBzY29wZS50ZXJtaW5hbExpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlcm1pbmFsID0gc2NvcGUudGVybWluYWxMaXN0W3Rlcm1pbmFsSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBpZih0ZXJtaW5hbC50ZXJtaW5hbElkID09PSB0ZXJtaW5hbElkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gdGVybWluYWwudHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2NvcGUuc2V0dXBEZXZpY2UgPSBmdW5jdGlvbiAoaG9tZUNyZWRlbnRpYWxzLCBkZXZpY2VJZExpc3QpIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGRldmljZUlkSW5kZXg9MCxsZW49c2NvcGUuc3dpdGNoTGlzdC5sZW5ndGg7IGRldmljZUlkSW5kZXg8bGVuOyBkZXZpY2VJZEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRldmljZUlkID0gZGV2aWNlSWRMaXN0W2RldmljZUlkSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBpZighZGV2aWNlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZUlkTGlzdFtkZXZpY2VJZEluZGV4XSA9IFsgXCJcIiwgXCJcIiwgXCJcIiBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRlcm1pbmFsU2VydmljZS5jb25maWd1cmVEZXZpY2UoaG9tZUNyZWRlbnRpYWxzLCBkZXZpY2VJZExpc3QpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29uZmlndXJhdGlvbiBTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbmZpZ3VyYXRpb24gRmFpbGVkXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgYW5ndWxhci5tb2R1bGUoXCJuZXR3b3JrXCIsIFsgXCJ1aS5yb3V0ZXJcIiBdKVxuICAgICAgICAuY29uZmlnKFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJHVybFJvdXRlclByb3ZpZGVyXCIsIGZ1bmN0aW9uIChzdGF0ZVByb3ZpZGVyLCB1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAgICAgdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL1wiKTtcbiAgICAgICAgICAgIHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAuc3RhdGUoXCJuZXR3b3JrXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9uZXR3b3JrXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcIm5ldHdvcmsuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIk5ldHdvcmtDdHJsXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfV0pXG4gICAgICAgIC5jb250cm9sbGVyKFwiTmV0d29ya0N0cmxcIiwgWyBcIiRzY29wZVwiLCBcIk5ldHdvcmtTZXJ2aWNlXCIsIFwiJHRpbWVvdXRcIiwgXCIkc3RhdGVcIiwgZnVuY3Rpb24gKHNjb3BlLCBuZXR3b3JrU2VydmljZSwgdGltZW91dCwgc3RhdGUpIHtcblxuICAgICAgICAgICAgc2NvcGUuc2Nhbk1lc3NhZ2UgPSBcIkxvb2tpbmcgZm9yIG5ldHdvcmtzLi4uXCI7XG5cbiAgICAgICAgICAgIHNjb3BlLmNyZWRlbnRpYWxzID0gbmV0d29ya1NlcnZpY2UuZ2V0Q3JlZGVudGlhbHMoKTtcblxuICAgICAgICAgICAgc2NvcGUuY2hhbmdlTmV0d29yayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5zaG93TmV0d29ya0xpc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNjb3BlLnNjYW5OZXR3b3JrcygpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2NvcGUuc2Nhbk5ldHdvcmtzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnNjYW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBuZXR3b3JrU2VydmljZS5maW5kKGZhbHNlLCBmdW5jdGlvbiAoZXJyb3IsIG5ldHdvcmtzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zY2FuTWVzc2FnZSA9IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zY2FubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUubmV0d29ya3MgPSBuZXR3b3JrcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnNjYW5NZXNzYWdlID0gXCJObyBOZXR3b3JrcyBGb3VuZFwiO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHNjb3BlLnNlbGVjdE5ldHdvcmsgPSBmdW5jdGlvbiAobmV0d29yaywgcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5jb25uZWN0TWVzc2FnZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgbmV0d29ya1NlcnZpY2UuY29ubmVjdChuZXR3b3JrLCBwYXNzd29yZCwgZnVuY3Rpb24gKGVycm9yLCBjcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXJyb3IgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNjb3BlLmdldFBhc3N3b3JkID09PSBuZXR3b3JrLnNzaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY29ubmVjdE1lc3NhZ2UgPSBcIkVudGVyIG5ldHdvcmsgcGFzc3dvcmRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5nZXRQYXNzd29yZCA9IG5ldHdvcmsuc3NpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yID09PSBcImZhaWxlZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY29ubmVjdE1lc3NhZ2UgPSBcIkZhaWxlZCB0byBjb25uZWN0IHRvIFwiICsgKG5ldHdvcmsuc3NpZCB8fCBcIm5ldHdvcmtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNvbm5lY3RNZXNzYWdlID0gXCJVbmFibGUgdG8gY29ubmVjdCB0byBuZXR3b3JrLCB2ZXJpZnkgcGFzc3dvcmRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmdldFBhc3N3b3JkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jb25uZWN0TWVzc2FnZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zaG93TmV0d29ya0xpc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5nbyhcImRldmljZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XSk7XG59KSgpO1xuIl19
