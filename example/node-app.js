#!/usr/bin/env node


var Web3 = require('../index.js');
// var sleep = require('sleep')
var web3 = new Web3();


web3.setProvider(new web3.providers.HttpProvider('http://test.thinkey.xyz'));

//GetChainInfo   GetCommittee   Ping 用这个url
// web3.setProvider(new web3.providers.HttpProvider('http://test.thinkey.xyz/chaininfo'));

const privateKey = new Buffer('4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318', 'hex')

web3.thk.defaultPrivateKey = privateKey
web3.thk.defaultAddress = "0x2c7536e3605d9c16a7a3d7b1898e529396a65c23"
web3.thk.defaultChainId = "2"

function sleep(delay) {   //自定义sleep方法
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
      continue;
    }
}


function RunContract(contractName, contractText) {
    var balance = web3.thk.GetAccount(web3.thk.defaultChainId, '0x2c7536e3605d9c16a7a3d7b1898e529396a65c23');
    var contractresp = web3.thk.CompileContract(web3.thk.defaultChainId, contractText)
    code = contractresp[contractName]["code"]
    // 发布合约
    tx = {
        chainId: web3.thk.defaultChainId,
        fromChainId: web3.thk.defaultChainId,
        toChainId: web3.thk.defaultChainId,
        from: web3.thk.defaultAddress,
        to: "",
        nonce: balance['nonce'].toString(),
        value: "0",
        input: code,
    }
    web3.thk.signTransaction(tx, web3.thk.defaultPrivateKey)
    var contracthash = web3.thk.SendTx(tx)
    sleep(5000)
    // 获取合约hash
    TxHash = contracthash["TXhash"]
    var conresp = web3.thk.GetTransactionByHash(web3.thk.defaultChainId, TxHash)
    var contractAddress = conresp['contractAddress']
    web3.thk.SaveContract(contractAddress, contractresp)
    return contractAddress
}


/**
 * @description: 获取账户余额， 也可以用来获取nonce
 * @param {String} chainId
 * @param {String} address
 * @return: 
 */
function getAccount(chainId, address){
    let balance = web3.thk.GetAccount(chainId, address);
    return balance
}



/**
 * @description: 获取账户余额， 也可以用来获取nonce
 * @param {String} chainId
 * @param {String} fromAddress
 * @param {String} toAddress
 * @param {String} value
 * @param {String} nonce
 * @param {String} privateKey
 * @param {String} inputs
 * @return: 
 */
function sendTx(chainId, fromAddress, toAddress, value, nonce, privateKey,inputs){
    let obj = {
        chainId: chainId,
        fromChainId: chainId,
        toChainId: chainId,
        from:fromAddress,
        to: toAddress,
        nonce: nonce,
        value: value.toString(),
        input: inputs
    }
    //签名参数
    let sendTxParams = web3.thk.signTransaction(obj,privateKey)
    var sendtxResp = web3.thk.SendTx(sendTxParams);
    return sendtxResp
}



/**
 * @description: 通过交易hash获取交易详情
 * @param {String} chainId
 * @param {String} txHash
 * @return: 
 */
function getTxHashRes(chainId,txHash){
    var getTxByHashResp = web3.thk.GetTransactionByHash(chainId, txHash);
    return getTxByHashResp
}



/**
 * @description: 获取链信息
 * @param {String} chainId
 * @return: 
 */
function getStateInfo(chainId){
    var getStatsResp = web3.thk.GetStats(chainId);
    return getStatsResp
}



/**
 * @description: 获取指定账户在对应链上一定高度范围内的交易信息
 * @param {String} chainId
 * @param {String} address
 * @param {Number} startHeight
 * @param {Number} endHeight
 * @return: 
 */
function getTransactionInfos(chainId, address, startHeight, endHeight){
    var getTxsInfos = web3.thk.GetTransactions(chainId,address, startHeight, endHeight);
    return getTxsInfos
}



/**
 * @description: 获取一条交易的详情
 * @param {String} chainId
 * @param {String} fromAddress
 * @param {String} toAddress
 * @param {String} value
 * @param {String} nonce
 * @param {String} inputs
 * @return: 
 */
function getTransferInfo(chainId, fromChainId, toChainId, fromAddress, toAddress, value, nonce, inputs){
    let obj = {
        chainId: chainId,
        from:fromAddress,
        to: toAddress,
        fromChainId: fromChainId,
        toChainId: toChainId,
        nonce: nonce,
        value: value.toString(),
        input: inputs
    }
    let transferInfo = web3.thk.CallTransaction(obj)
    return transferInfo
}



/**
 * @description: 获取指定块高信息
 * @param {String} chainId 
 * @param {String} height
 * @return: 
 */
function getBlockHeightInfo(chainId, height){
    var getBlockInfo = web3.thk.GetBlockHeader(chainId,height);
    return getBlockInfo
}



/**
 * @description: 获取指定块高,指定页码数量信息
 * @param {String} chainId 
 * @param {String} height
 * @param {String} page    页码
 * @param {String} size     页的大小
 * @return: 
 */
function getBlockPageInfos(chainId, height, page, size){
    var getBlockInfo = web3.thk.GetBlockTxs(chainId,height,page,size);
    return getBlockInfo
}



/**
 * @description: 编译合约
 * @param {String} chainId 
 * @param {String} contract
 * @return: 
 */
function getCompileContract(chainId, contract){
    var getBlockInfo = web3.thk.CompileContract(chainId,contract);
    return getBlockInfo
}



/**
 * @description: 获取链信息
 * @param {Array} chainIds    链Id数组, 空数组为所有
 * @return: 
 */
function getChainInfos(chainIds){
    var getBlockInfo = web3.thk.GetChainInfo(chainIds);
    return getBlockInfo
}



/**
 * @description: 连接指定ip+端口
 * @param {String} url    链Id数组, 空数组为所有
 * @return: 
 */
function pingUrl(url){
    var pingRes = web3.thk.Ping(url);
    return pingRes
}



/**
 * @description: 获取委员会详情
 * @param {String} chainId
 * @return: 
 */
function getCommittee(chainId,epoch){
    var getcommittee = web3.thk.GetCommittee(chainId,epoch);
    return getcommittee
}

//获取账户余额， 也可以用来获取nonce
// let balance = getAccount(web3.thk.defaultChainId, '0x2c7536e3605d9c16a7a3d7b1898e529396a65c23');
// console.log('get account response',balance);

//执行一笔交易 
// let sendtxResp = sendTx(web3.thk.defaultChainId, '0x0000000000000000000000000000000000000000', '0x0e50cea0402d2a396b0db1c5d08155bd219cc52e', '0', '1', web3.thk.defaultPrivateKey,'0xc3bea9af000000000000000000000000ca35b7d915458ef540ade6068dfe2f44e8fa733c');
// console.log("get sendtx response:",sendtxResp);

//通过交易hash获取交易详情
// var getTxByHashResp = getTxHashRes(web3.thk.defaultChainId, '0xba2fe9309f7e1bcd1a04cd9f50a918f88d5f5da09422fa025373543463eccc09');
// console.log("get  TxByHashResp response:",getTxByHashResp);

//获取链信息
// var getStatsResp = getStateInfo(web3.thk.defaultChainId);
// console.log("get statsResp:",getStatsResp);

//获取指定账户在对应链上一定高度范围内的交易信息
// var getTxsResp = getTransactionInfos(web3.thk.defaultChainId,'0x4fa1c4e6182b6b7f3bca273390cf587b50b47311', 50, 70);
// console.log("get TxinfosResp response:", getTxsResp);

//获取一条交易的详情
// var callTransactionResp = getTransferInfo(web3.thk.defaultChainId, '2', '2', '0x0000000000000000000000000000000000000000', '0x0e50cea0402d2a396b0db1c5d08155bd219cc52e', '0', '22','0xe98b7f4d0000000000000000000000000000000000000000000000000000000000000001');
// console.log("callTransactionResp response:", callTransactionResp);

//获取指定块高信息
// var getBlockHeaderResp = getBlockHeightInfo('2', '30');
// console.log('get blockheader', getBlockHeaderResp)

//获取指定块高,指定页码数量信息
// var getBlockTxsResp = getBlockPageInfos(web3.thk.defaultChainId, '30','1','10');
// console.log("getBlockTxsResp response:", getBlockTxsResp);

//编译合约
// var compileContractResp = getCompileContract(web3.thk.defaultChainId, 'pragma solidity >= 0.4.22;contract test {function multiply(uint a) public returns(uint d) {return a * 7;}}');
// console.log("compileContractResp response:",compileContractResp);

// var hash = web3.sha3("Some string to be hashed");
// console.log(hash);

//获取链信息
// var getChainInfoResp = getChainInfos([]);
// console.log("get chaininfo res:",getChainInfoResp);

//连接指定ip+端口
// var getPingResp = pingUrl("192.168.1.13:22010");
// console.log("PING res:",getPingResp);

//获取委员会详情
// var getCommitteeResp = getCommittee(web3.thk.defaultChainId,'4');
// console.log("get committee res:",getCommitteeResp);

/**
 * 跨链交易生成支票证明
 * web3.thk.RpcMakeVccProof()    具体用法参考  eachOtherChainTransfer.js文件
 * 生成取消支票
 * web3.thk.MakeCCCExistenceProof      具体用法参考  refund.js文件
 */






