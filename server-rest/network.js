module.exports = function (Network) {

    var wifiscanner = require("./node_modules/node-wifiscanner/lib/wifiscanner.js");

    function findNetwork(userId, callback) {
        wifiscanner.scan(function (error, networks) {
            if(error) {
                callback(error);
            }

            Network.find({ "owner" : userId }, function (error, linkedNetworks) {
                if(error) {
                    callback(error);
                }

                var uniqueNetworks = [];
                for(var networkIndex in networks) {
                    var isUnique = true;
                    var network = networks[networkIndex];
                    for(var uniqueNetworkIndex in uniqueNetworks) {
                        var uniqueNetwork = uniqueNetworks[uniqueNetworkIndex];
                        if(network.ssid === uniqueNetwork.ssid) {
                            isUnique = false;
                            break;
                        }
                    }
                    if(isUnique) {
                        network.linked = false;
                        for(var linkedNetworkIndex in linkedNetworks) {
                            var linkedNetwork = linkedNetworks[linkedNetworkIndex];
                            if(network.ssid === linkedNetwork.networkName) {
                                network.linked = true;
                                network.id = linkedNetwork._id;
                                break;
                            }
                        }
                        uniqueNetworks.push(network);
                    }
                }
                callback(null, uniqueNetworks);
            });
        });
    };

    function linkNetwork(networkObject, callback) {
        Network
            .find({ "networkName" : networkObject.networkName, "owner" : networkObject.owner })
            .exec(function (error, networks) {
                if(error) {
                    callback(error);
                }
                if(networks.length === 0) {
                    var newNetwork = new Network();
                    newNetwork.networkName = networkObject.networkName;
                    newNetwork.password = networkObject.password;
                    newNetwork.owner = networkObject.owner;
                    newNetwork.save(callback);
                } else {
                    callback("Network already exists");
                }
            });
    }

    function unlinkNetwork(networkId, callback) {
        Network.findById(networkId).remove(callback);
    }

    function getNetworkLinkStatus(userId, networkSSID, callback) {
        Network
            .findOne({ "networkName" : networkSSID, "owner" : userId })
            .exec(function (error, network) {
                if(error) {
                    callback(error);
                }
                callback(null, !!network);
            });
    }

    return {
        findNetwork: findNetwork,
        linkNetwork: linkNetwork,
        unlinkNetwork: unlinkNetwork,
        getNetworkLinkStatus: getNetworkLinkStatus
    };
};
