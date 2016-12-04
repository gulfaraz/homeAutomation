console.log("Initializing...");

var wifi = require("Wifi");

var clientSSID = "newDevice-" + wifi.getAPIP().mac.split(":").join(""),
    clientPassword = "newdevicesetup",
    homeCredentials,
    mqttHostIP = "10.244.195.172",
    deviceId = [];

// START - Configuration

var index = {
    ssid : 0,
    password : 1,
    homeId : 2,
    roomId : 3,
    terminalId : 4
};

var flash = new (require("FlashEEPROM"))();

console.log("Reading configuration...");

var configuration = flash.readAll();

function writeConfiguration(homeCredentials, deviceId) {
    flash.write(index.ssid, homeCredentials.ssid);
    flash.write(index.password, homeCredentials.password);
    flash.write(index.homeId, deviceId[0]);
    flash.write(index.roomId, deviceId[1]);
    flash.write(index.terminalId, deviceId[2]);
}

function readConfiguration(configuration) {

    function readIndex(index) {
        return E.toString(configuration[index]);
    }

    homeCredentials = {
        "ssid" : readIndex(index.ssid),
        "password" : readIndex(index.password),
    };

    deviceId = [
        readIndex(index.homeId),
        readIndex(index.roomId),
        readIndex(index.terminalId)
    ];

    return [
        homeCredentials,
        deviceId
    ];
}

if(configuration.length === 5) {
    console.log("Configuration Loaded", configuration);
    readConfiguration(configuration);
    console.log(homeCredentials);
    console.log(deviceId);
} else {
    console.log("Configuration Not Found");
}

// END - Configuration

function onInit() {
    console.log("Initialized!");
    //digitalWrite(13, 1);
    digitalWrite(13, 0);
}

setInterval(function() {
    console.log("Board is connected...");
}, 600000);

if(deviceId.length === 3) {
  console.log("CONFIGURED");
  wifi.stopAP();
  wifi.connect(homeCredentials.ssid, { "password" : homeCredentials.password }, function (err) {
      if(err) {
          console.log(err);
      } else {
          console.log("Connected!");
          var mqtt = require("tinyMQTT").create(mqttHostIP);
          mqtt.on("connected", function () {
              console.log("mqtt connected");
              mqtt.subscribe("+/" + deviceId[2]);
              mqtt.publish("Pair/" + deviceId[2], deviceId[0] + "/" + deviceId[1]);
          });
          mqtt.on("message", function (packet) {
              console.log("received message");
              var topic = packet.topic.split("/")[0];
              var message = packet.message.substring(2);
              console.log(topic);
              if(topic === "Control") {
                  var state = (message == "on") ? 1 : 0;
                  digitalWrite(13, state);
              } else if(topic === "Acknowledgement") {
                  if(message === "failed") {
                      flash.erase();
                      reset();
                  }
              }
          });
          mqtt.connect({
              keep_alive: 60,
              port: 1883
          });
    }
});
} else {
  console.log("NOT CONFIGURED");
  wifi.startAP(clientSSID, { password : clientPassword }, function (error, connection) {
    if(error) {
        console.log(error);
    } else {
        console.log("Access Point Started");
        var http = require("http");
        http.createServer(serveServer).listen(80);
    }
  });
}

function serveServer(request, response) {
    console.log(request);
    if(request.method === "GET" && request.url === "/") {
      response.writeHead(200);
      response.end("Device is alive");
    } else if(request.method === "POST" && request.url === "/configure") {
      var data = "";
      request.on("data", function (chunk) {
          if(chunk) {
              data += chunk;
          }
          if(data.length === Number(request.headers["Content-Length"])) {
              data = JSON.parse(data);
              homeCredentials = data.homeCredentials;
              deviceId = data.deviceId;
              writeConfiguration(homeCredentials, deviceId);
              response.writeHead(200);
              response.end("Device Configured");
              reset();
          } else if(data.length > Number(reqest.headers["Content-Length"])) {
              response.writeHead(400);
              response.end("Configuration Failed");
          }
      });
    } else {
      response.writeHead(404);
      response.end("Not Found");
    }
}
