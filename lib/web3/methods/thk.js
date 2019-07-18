/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file eth.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

"use strict";

var Method = require('../method');
var web3Util = require('../../utils/utils');
var web3Sha3 = require('../../utils/sha3');
var Property = require('../property');
var formatters = require('../formatters');
var Contract = require('../contract');
var watches = require('./watches');
var Filter = require('../filter');
var IsSyncing = require('../syncing');
var namereg = require('../namereg');
var ethUtil = require('ethereumjs-util');

function Thk(web3) {
    this._requestManager = web3._requestManager;
    this._curCaller = null
    this._value = null
    this.defaultPrivateKey = null
    this.defaultChainId = '2'
    this.defaultAddress = null
    var self = this;

    methods().forEach(function (method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });

    properties().forEach(function (p) {
        p.attachToObject(self);
        p.setRequestManager(self._requestManager);
    });
}


var GetAccountInputF = function (chainId, address) {
    address = formatters.inputAddressFormatter(address);

    return ({"address": address, "chainId": chainId});
};

var SendTxInputF = function (txdict) {
    var fromAddr = formatters.inputAddressFormatter(txdict.from);
    // var toAddr = formatters.inputAddressFormatter(to);
    return txdict
};
var GetTxByHashInputF = function (chainid, hash) {
    return ({"chainId": chainid, "hash": hash})
};

var GetStatsInputF = function (chainid) {
    return ({"chainId": chainid})
};

var GetTransactionsInputF = function (chainId, address, startheight, endheight) {
    // var addr = formatters.inputAddressFormatter(address)
    return ({"chainId": chainId,"address": address, "startHeight": startheight.toString(), "endHeight": endheight.toString()})
};

var CallTransactionInputF = function (txdict) {
    // var fromAddr = formatters.inputAddressFormatter(form);
    // var toAddr = formatters.inputAddressFormatter(to);
    return txdict
};

var GetBlockHeaderInputF = function (chainid, height) {
    return ({"chainId": chainid, "height": height})
};


var GetBlockTxsInputF = function (chainid, height, page, size) {
    return ({"chainId": chainid, "height": height, "page": page, "size": size})

};

var CompileContractInputF = function (chainId, contract) {
    return ({"chainId": chainId, "contract": contract})
};
var SaveContractInputF = function (contractaddr, contract) {
    return ({"contractaddr": contractaddr, "contract": contract})
};
var GetContractInputF = function (contractaddr) {
    return ({"contractaddr": contractaddr})
};

var RpcMakeVccProofInputF = function (dicts){
    return dicts
};

var MakeCCCExistenceProofInputF = function (dicts){
    return dicts
}

var GetChainInfoInputF = function (chainIds) {
    return ({"chainIds": chainIds})
};

var PingInputF = function (address) {
    return ({"address": address})
};

var GetCommitteeInputF = function (chainId,epoch) {
    return ({"chainId": chainId, "epoch": epoch})
};

var methods = function () {
    var GetAccount = new Method({
        name: 'GetAccount',
        call: 'GetAccount',
        params: 2,
        inputFormatter: GetAccountInputF,
        outputFormatter: formatters.outputBalanceFormatter
    });

    var SendTx = new Method({
        name: 'SendTx',
        call: 'SendTx',
        params: 1,
        inputFormatter: SendTxInputF,
        outputFormatter: [null]
    });

    var GetTransactionByHash = new Method({
        name: 'GetTransactionByHash',
        call: 'GetTransactionByHash',
        params: 2,
        inputFormatter: GetTxByHashInputF,
        outputFormatter: [null]
    });

    var GetStats = new Method({
        name: 'GetStats',
        call: 'GetStats',
        params: 1,
        inputFormatter: GetStatsInputF,
        outputFormatter: [null]
    });

    var GetTransactions = new Method({
        name: 'GetTransactions',
        call: 'GetTransactions',
        params: 3,
        inputFormatter: GetTransactionsInputF,
        outputFormatter: [null]
    });

    var CallTransaction = new Method({
        name: 'CallTransaction',
        call: 'CallTransaction',
        params: 6,
        inputFormatter: CallTransactionInputF,
        outputFormatter: [null]
    });

    var GetBlockHeader = new Method({
        name: 'GetBlockHeader',
        call: 'GetBlockHeader',
        params: 2,
        inputFormatter: GetBlockHeaderInputF,
        outputFormatter: [null]
    });

    var GetBlockTxs = new Method({
        name: 'GetBlockTxs',
        call: 'GetBlockTxs',
        params: 4,
        inputFormatter: GetBlockTxsInputF,
        outputFormatter: [null]
    });

    var CompileContract = new Method({
        name: 'CompileContract',
        call: 'CompileContract',
        params: 2,
        inputFormatter: CompileContractInputF,
        outputFormatter: [null]
    });
    var SaveContract = new Method({
        name: 'SaveContract',
        call: 'SaveContract',
        params: 2,
        inputFormatter: SaveContractInputF,
        outputFormatter: [null]
    });

    var GetContract = new Method({
        name: 'GetContract',
        call: 'GetContract',
        params: 1,
        inputFormatter: GetContractInputF,
        outputFormatter: [null]
    });
    var estimateGas = new Method({
        name: 'estimateGas',
        call: 'estimateGas'
    });

    var RpcMakeVccProof = new Method({
        name: 'RpcMakeVccProof',
        call: 'RpcMakeVccProof',
        params: 1,
        inputFormatter: RpcMakeVccProofInputF,
        outputFormatter: [null]
    });

    var MakeCCCExistenceProof = new Method({
        name: 'MakeCCCExistenceProof',
        call: 'MakeCCCExistenceProof',
        params: 1,
        inputFormatter: MakeCCCExistenceProofInputF,
        outputFormatter: [null]
    });

    var GetChainInfo = new Method({
        name: 'GetChainInfo',
        call: 'GetChainInfo',
        params: 1,
        inputFormatter: GetChainInfoInputF,
        outputFormatter: [null]
    });

    var Ping = new Method({
        name: 'Ping',
        call: 'Ping',
        params: 1,
        inputFormatter: PingInputF,
        outputFormatter: [null]
    });

    var GetCommittee = new Method({
        name: 'GetCommittee',
        call: 'GetCommittee',
        params: 1,
        inputFormatter: GetCommitteeInputF,
        outputFormatter: [null]
    });

    return [
        GetAccount,
        SendTx,
        GetTransactionByHash,
        GetStats,
        GetTransactions,
        CallTransaction,
        GetBlockHeader,
        GetBlockTxs,
        CompileContract,
        SaveContract,
        GetContract,
        estimateGas,
        RpcMakeVccProof,
        MakeCCCExistenceProof,
        GetChainInfo,
        Ping,
        GetCommittee
    ];
};

var properties = function () {
    return [
        new Property({
            name: 'listAccounts',
            getter: 'personal_listAccounts'
        })
    ];
};

Thk.prototype.contract = function (abi) {
    var factory = new Contract(this, abi);
    return factory;
};

Thk.prototype.setVal = function (val) {
    this._value = val
};

Thk.prototype.getVal = function () {
    return this._value
};

Thk.prototype.filter = function (options, callback, filterCreationErrorCallback) {
    return new Filter(options, 'thk', this._requestManager, watches.thk(), formatters.outputLogFormatter, callback, filterCreationErrorCallback);
};

Thk.prototype.namereg = function () {
    return this.contract(namereg.global.abi).at(namereg.global.address);
};

Thk.prototype.icapNamereg = function () {
    return this.contract(namereg.icap.abi).at(namereg.icap.address);
};

Thk.prototype.isSyncing = function (callback) {
    return new IsSyncing(this._requestManager, callback);
};

Thk.prototype.signTransaction = function (transactionDict, private_key) {
    if (transactionDict["to"].length > 2 && web3Util.isAddress(transactionDict["to"])) {
        var toAddr = transactionDict["to"].substring(2)
    } else {
        toAddr = ""
    }
    if (web3Util.isAddress(transactionDict["from"])) {
        var fromAddr = transactionDict["from"].substring(2)
    } else {
        throw new Error('invalid address');
    }
    if (transactionDict["input"].substring(0, 2) === "0x") {
        var input = transactionDict["input"].substring(2)
    }
    let signStr = transactionDict["chainId"] + fromAddr +
        toAddr + transactionDict["nonce"] +
        transactionDict["value"] + input
    let hash = "0x" + web3Sha3(signStr)
    let sign_byte = new Buffer(hash.substring(2, 67), 'hex')
    let sig = ethUtil.ecsign(sign_byte, private_key)
    transactionDict['sig'] = "0x" + sig.r.toString('hex') + sig.s.toString('hex') + sig.v.toString(16)
    transactionDict['pub'] = '0x04' + ethUtil.privateToPublic(private_key).toString('hex')

    return transactionDict
}


module.exports = Thk;
