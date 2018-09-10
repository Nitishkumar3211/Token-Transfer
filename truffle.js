var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "SpmKpyHrAEs5bLHFQjin";
var mnemonic = "oven stereo alarm slow rack wide taxi bullet health large tree long";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
  },
   networks: {
     development: {
     host: "localhost",
     port: 8545,
     network_id: "*", // Match any network id
     
    },
    ropsten: {
      provider: function() {
		  return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey)
		  },
      network_id: 3,
      gas: 4698712
    }
 }
};
