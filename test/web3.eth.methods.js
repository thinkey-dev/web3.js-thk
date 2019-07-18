var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index.js');
var web3 = new Web3();
var u = require('./helpers/test.utils.js');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

describe('web3.eth', function() {
    describe('methods', function() {
        // set dummy providor, to prevent error
        web3.setProvider(new FakeHttpProvider());

        u.methodExists(web3.eth, 'getBalance');
        u.methodExists(web3.eth, 'getStorageAt');
        u.methodExists(web3.eth, 'getTransactionCount');
        u.methodExists(web3.eth, 'getCode');
        u.methodExists(web3.eth, 'sendTransaction');
        u.methodExists(web3.eth, 'call');
        u.methodExists(web3.eth, 'getBlock');
        u.methodExists(web3.eth, 'getTransaction');
        u.methodExists(web3.eth, 'getUncle');
        u.methodExists(web3.eth, 'getBlockTransactionCount');
        u.methodExists(web3.eth, 'getBlockUncleCount');
        u.methodExists(web3.eth, 'filter');
        u.methodExists(web3.eth, 'contract');

        u.propertyExists(web3.eth, 'coinbase');
        u.propertyExists(web3.eth, 'mining');
        u.propertyExists(web3.eth, 'gasPrice');
        u.propertyExists(web3.eth, 'accounts');
        u.propertyExists(web3.eth, 'defaultBlock');
        u.propertyExists(web3.eth, 'blockNumber');
        u.propertyExists(web3.eth, 'protocolVersion');
    });
});

