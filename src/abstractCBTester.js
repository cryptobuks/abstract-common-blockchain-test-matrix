var testInstanceCreator = require('./createTestInstance.js');
var async = require('async');

/***** API Providers for abstract-common-blockchain *****/
var biteasy = require("biteasy-unofficial");
var blockchaininfo = require("blockchaininfo-unofficial");
var blockcypher = require("blockcypher-unofficial");
var blockr = require("blockr-unofficial");
var blocktrail = require("blocktrail-unofficial");
var chain = require("chain-unofficial");

/***** Biteasy *****/
var biteasyMainnet = biteasy({
  network: "mainnet"
});
var biteasyTestnet = biteasy({
  network: "testnet"
});

/***** Blockchain.info *****/
var blockchaininfoMainnet = blockchaininfo(); 

/***** Blockcypher *****/
var blockcypherMainnet = blockcypher({
  network: "mainnet"
});
var blockcypherTestnet = blockcypher({
  network: "testnet"
});

/***** Blockr.io *****/
var blockrMainnet = blockr();

/***** Blocktrail *****/
var blocktrailMainnet = blocktrail({
  network: "mainnet",
  apiKey: process.env.BLOCKTRAIL_API_KEY_ID,
  apiSecret: process.env.BLOCKTRAIL_API_KEY_SECRET
});
var blocktrailTestnet = blocktrail({
  network: "testnet",
  apiKey: process.env.BLOCKTRAIL_API_KEY_ID,
  apiSecret: process.env.BLOCKTRAIL_API_KEY_SECRET
});

/***** Chain *****/
var chainMainnet = chain({
  network: "bitcoin", 
  key: process.env.CHAIN_API_KEY_ID, 
  secret: process.env.CHAIN_API_KEY_SECRET
});
var chainTestnet = chain({
  network: "testnet", 
  key: process.env.CHAIN_API_KEY_ID, 
  secret: process.env.CHAIN_API_KEY_SECRET
});

/** Matrix of API Providers **/
var testMatrix = [
  {
    name: "biteasyMainnet",
    network: "mainnet",
    client: biteasyMainnet,
    test: testInstanceCreator(),
  },
  {
    name: "biteasyTestnet",
    network: "testnet",
    client: biteasyTestnet,
    test: testInstanceCreator(),
  },
  {
    name: "blockchaininfoMainnet",
    network: "mainnet",
    client: blockchaininfoMainnet,
    test: testInstanceCreator(),
  },
  {
    name: "blockcypherMainnet",
    network: "mainnet",
    client: blockcypherMainnet,
    test: testInstanceCreator(),
  },
  {
    name: "blockcypherTestnet",
    network: "testnet",
    client: blockcypherTestnet,
    test: testInstanceCreator(),
  },
  {
    name: "blockrMainnet",
    network: "mainnet",
    client: blockrMainnet,
    test: testInstanceCreator(),
  },
  {
    name: "blocktrailMainnet",
    network: "mainnet",
    client: blocktrailMainnet,
    test: testInstanceCreator(),
  },
  {
    name: "blocktrailTestnet",
    network: "testnet",
    client: blocktrailTestnet,
    test: testInstanceCreator(),
  },
  {
    name: "chainMainnet",
    network: "mainnet",
    client: chainMainnet,
    test: testInstanceCreator(),
  },
  {
    name: "chainTestnet",
    network: "testnet",
    client: chainTestnet,
    test: testInstanceCreator(),
  }
];

/* Fills in our testInstance object with the results from testing 
 * the API provider. Because of query limits on certain providers,
 * tests are run with 0.5 second timeouts to prevent errors. */
function fillTestInstance(apiProvider, callback) {
  var count = 0;
  var testInstance = apiProvider.test;
  var address = (apiProvider.network === "mainnet") ? "1HUTmSsFp9Rg4FYRftp85GGyZFEndZSoeq" : "n3PDRtKoHXHNt8FU17Uu9Te81AnKLa7oyU";
  var blockId = (apiProvider.network === "mainnet") ? "00000000000000000a6e36f5f310f7c01a58a1c3d3f2dd63873379e03a937424" : "0000000002d9daeab13dd9bf375bb6851824f39b95da84b4f024a278b0164ac6";
  var txid = (apiProvider.network === "mainnet") ? "c3c305fa81d37956495352b6890fc2e2028eaa5970fb09ee93e4cef9852c9eb0" : "bbca54add4a55dd6086df741e3f89288f290a94d69ebb932a140262450b2ebcf";

  async.series([
    function (callback) { 
      apiProvider.client.Addresses.Summary([address], function (err, resp) {
        if (!err) {
          testInstance.Addresses.Summary.address = (resp[0].address != null);
          testInstance.Addresses.Summary.balance = (resp[0].balance != null);
          testInstance.Addresses.Summary.totalReceived = (resp[0].totalReceived != null);
          testInstance.Addresses.Summary.totalSent = (resp[0].totalSent != null);
          testInstance.Addresses.Summary.txCount = (resp[0].txCount != null);
          callback(null, testInstance.Addresses.Summary);
        } 
        else {
          callback(null, null);
        }
      });
    },

    function (callback) {
      apiProvider.client.Addresses.Transactions([address], function (err, resp) {
        if (!err) {
          resp = resp[0][0];
          testInstance.Addresses.Transactions.blockHeight = (resp.blockHeight != null);
          testInstance.Addresses.Transactions.blockId = (resp.blockId != null);
          testInstance.Addresses.Transactions.hex = (resp.hex != null);
          testInstance.Addresses.Transactions.txHex = (resp.txHex != null);
          testInstance.Addresses.Transactions.txid = (resp.txid != null);
          testInstance.Addresses.Transactions.txId = (resp.txId != null);
          callback(null, testInstance.Addresses.Transactions);
        }
        else {
          callback(null, null);
        }
      });
    },

    function (callback) {
      apiProvider.client.Addresses.Unspents([address], function (err, resp) {
        if (!err) {
          var unspentObj = resp[0][0];
          testInstance.Addresses.Unspents.address = (unspentObj.address != null);
          testInstance.Addresses.Unspents.confirmations = (unspentObj.confirmations != null);
          testInstance.Addresses.Unspents.txid = (unspentObj.txid != null);
          testInstance.Addresses.Unspents.txId = (unspentObj.txId != null);
          testInstance.Addresses.Unspents.vout = (unspentObj.vout != null);
          testInstance.Addresses.Unspents.value = (unspentObj.value != null);
          testInstance.Addresses.Unspents.amount = (unspentObj.amount != null);
          testInstance.Addresses.Unspents.scriptPubKey = (unspentObj.scriptPubKey != null);
          callback(null, testInstance.Addresses.Unspents);
        }
        else {
          callback(null, null);
        }
      });
    },

    function (callback) {
      apiProvider.client.Blocks.Get([blockId], function (err, resp) {
        if (!err) {
          var blockObj = resp[0];
          testInstance.Blocks.Get.blockHex = (blockObj.blockHex != null);
          testInstance.Blocks.Get.blockId = (blockObj.blockId != null);
          callback(null, testInstance.Blocks.Get);
        }
        else {
          callback(null, null);
        } 
      });
    },

    function (callback) {
      apiProvider.client.Blocks.Latest(function (err, resp) {
        if (!err) {
          var blockObj = resp;
          testInstance.Blocks.Latest.blockHex = (blockObj.blockHex != null);
          testInstance.Blocks.Latest.blockId = (blockObj.blockId != null);
          callback(null, testInstance.Blocks.Latest);
        }
        else {
          callback(null, null);
        }
      });
    },

    function (callback) {
      apiProvider.client.Blocks.Transactions([blockId], function (err, resp) {
        if (!err) {
          var blockObj = resp[0][0];
          testInstance.Blocks.Transactions.blockId = (blockObj.blockId != null);
          testInstance.Blocks.Transactions.txid = (blockObj.txid != null);
          testInstance.Blocks.Transactions.txId = (blockObj.txId != null);
          callback(null, testInstance.Blocks.Transactions);
        }
        else {
          callback(null, null);
        }  
      });
    },

    function (callback) {
      apiProvider.client.Transactions.Get([txid], function (err, resp) {
        if (!err) {
          transactionObj = resp[0];
          testInstance.Transactions.Get.hex = (transactionObj.hex != null);
          testInstance.Transactions.Get.txHex = (transactionObj.txHex != null);
          testInstance.Transactions.Get.txid = (transactionObj.txid != null);
          testInstance.Transactions.Get.txId = (transactionObj.txId != null);
          testInstance.Transactions.Get.version = (transactionObj.version != null);
          testInstance.Transactions.Get.locktime = (transactionObj.locktime != null);
          testInstance.Transactions.Get.fee = (transactionObj.fee != null);

          testInstance.Transactions.Get.vin.txid = (transactionObj.vin[0].txid != null);
          testInstance.Transactions.Get.vin.txId = (transactionObj.vin[0].txId != null);
          testInstance.Transactions.Get.vin.vout = (transactionObj.vin[0].vout != null);
          testInstance.Transactions.Get.vin.addresses = (transactionObj.vin[0].addresses != null);
          testInstance.Transactions.Get.vin.scriptSig.asm = (transactionObj.vin[0].scriptSig.asm != null);
          testInstance.Transactions.Get.vin.scriptSig.hex = (transactionObj.vin[0].scriptSig.hex != null);
          testInstance.Transactions.Get.vin.sequence = (transactionObj.vin[0].sequence != null);

          testInstance.Transactions.Get.vout.value = (transactionObj.vout[0].value != null);
          testInstance.Transactions.Get.vout.index = (transactionObj.vout[0].index  != null);
          testInstance.Transactions.Get.vout.n = (transactionObj.vout[0].n != null);
          testInstance.Transactions.Get.vout.spentTxid = (transactionObj.vout[0].spentTxid != null);
          testInstance.Transactions.Get.vout.scriptPubKey.asm = (transactionObj.vout[0].scriptPubKey.asm != null);
          testInstance.Transactions.Get.vout.scriptPubKey.hex = (transactionObj.vout[0].scriptPubKey.hex != null);
          testInstance.Transactions.Get.vout.scriptPubKey.reqSigs = (transactionObj.vout[0].scriptPubKey.reqSigs != null);
          testInstance.Transactions.Get.vout.scriptPubKey.type = (transactionObj.vout[0].scriptPubKey.type != null);
          testInstance.Transactions.Get.vout.addresses = (transactionObj.vout[0].addresses != null);

          testInstance.Transactions.Get.confirmations = (transactionObj.confirmations != null);
          testInstance.Transactions.Get.blocktime = (transactionObj.blocktime != null);
          testInstance.Transactions.Get.blockhash = (transactionObj.blockhash != null);
          testInstance.Transactions.Get.blockindex = (transactionObj.blockindex != null);
          testInstance.Transactions.Get.timeReceived = (transactionObj.timeReceived != null);

          callback(null, testInstance.Transactions.Get);
        }
        else {
          callback(null, null);
        }
      });
    },

    function (callback) {
      apiProvider.client.Transactions.Latest(function (err, resp) {
        if (!err) {
          var transactionObj = resp;
          testInstance.Transactions.Latest.hex = (transactionObj.hex != null);
          testInstance.Transactions.Latest.txHex = (transactionObj.txHex != null);
          testInstance.Transactions.Latest.txid = (transactionObj.txid != null);
          testInstance.Transactions.Latest.txId = (transactionObj.txId != null);
          testInstance.Transactions.Latest.version = (transactionObj.version != null);
          testInstance.Transactions.Latest.locktime = (transactionObj.locktime != null);
          testInstance.Transactions.Latest.fee = (transactionObj.fee != null);

          testInstance.Transactions.Latest.vin.txid = (transactionObj.vin[0].txid != null);
          testInstance.Transactions.Latest.vin.txId = (transactionObj.vin[0].txId != null);
          testInstance.Transactions.Latest.vin.vout = (transactionObj.vin[0].vout != null);
          testInstance.Transactions.Latest.vin.addresses = (transactionObj.vin[0].addresses != null);
          testInstance.Transactions.Latest.vin.scriptSig.asm = (transactionObj.vin[0].scriptSig.asm != null);
          testInstance.Transactions.Latest.vin.scriptSig.hex = (transactionObj.vin[0].scriptSig.hex != null);
          testInstance.Transactions.Latest.vin.sequence = (transactionObj.vin[0].sequence != null);

          testInstance.Transactions.Latest.vout.value = (transactionObj.vout[0].value != null);

          //not guarunteed that the most recent block has been sent. Almost certainly will not be.
          //so set these three to the result of the transcation get fields in the tests.
          testInstance.Transactions.Latest.vout.index =  testInstance.Transactions.Get.vout.index;
          testInstance.Transactions.Latest.vout.n = testInstance.Transactions.Get.vout.n
          testInstance.Transactions.Latest.vout.spentTxid = testInstance.Transactions.Get.vout.spentTxid;

          testInstance.Transactions.Latest.vout.scriptPubKey.asm = (transactionObj.vout[0].scriptPubKey.asm != null);
          testInstance.Transactions.Latest.vout.scriptPubKey.hex = (transactionObj.vout[0].scriptPubKey.hex != null);
          testInstance.Transactions.Latest.vout.scriptPubKey.reqSigs = (transactionObj.vout[0].scriptPubKey.reqSigs != null);
          testInstance.Transactions.Latest.vout.scriptPubKey.type = (transactionObj.vout[0].scriptPubKey.type != null);
          testInstance.Transactions.Latest.vout.addresses = (transactionObj.vout[0].addresses != null);

          testInstance.Transactions.Latest.confirmations = (transactionObj.confirmations != null);

          //hasnt been confirmed yet!
          testInstance.Transactions.Latest.blocktime = true;
          testInstance.Transactions.Latest.blockhash = true;
          testInstance.Transactions.Latest.blockindex = true;

          testInstance.Transactions.Latest.timeReceived = (transactionObj.timeReceived != null);

          callback(null, testInstance.Transactions.Latest);
        }
        else {
          callback(null, null);
        }
      });
    },

    function (callback) {
      apiProvider.client.Transactions.Outputs([
        {
          txid: txid,
          vout: 0
        }
      ], function (err, resp) {
        if (!err) {
          var blockObj = resp[0];
          testInstance.Transactions.Outputs.scriptPubKey = (blockObj.scriptPubKey != null);
          testInstance.Transactions.Outputs.txid = (blockObj.txid != null);
          testInstance.Transactions.Outputs.txId = (blockObj.txId != null);
          testInstance.Transactions.Outputs.value = (blockObj.value != null);
          testInstance.Transactions.Outputs.vout = (blockObj.vout != null);
          callback(null, testInstance.Transactions.Outputs);
        }
        else {
          callback(null, null);
        }
      });
    },

    function (callback) {
      apiProvider.client.Transactions.Status([txid], function (err, resp) {
        if (!err) {
          var blockObj = resp[0];
          testInstance.Transactions.Status.blockId = (blockObj.blockId != null);
          testInstance.Transactions.Status.txid = (blockObj.txid != null);
          testInstance.Transactions.Status.txId = (blockObj.txId != null);
          callback(null, testInstance.Transactions.Status);
        }
        else {
          callback(null, null);
        }  
      });
    }
  ], function (error, results) {
    if (error) {
      console.log(error);
    }
    callback();
  });
}

function populateMatrix(callback) {
  var apiCount = 0;
  testMatrix.forEach(function (apiProvider) {
    fillTestInstance(apiProvider, function () {
      console.log("loaded: " +  apiProvider.name);
      if (++apiCount === testMatrix.length) {
        callback(testMatrix);
      }
    });
  });
}

module.exports = populateMatrix;
