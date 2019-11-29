#!/usr/bin/env node


var Web3 = require('../index.js');
// var sleep = require('sleep')
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://43.247.184.50:8079'));

//GetChainInfo   GetCommittee   Ping 用这个url
// web3.setProvider(new web3.providers.HttpProvider('http://test.thinkey.xyz/chaininfo'));

const privateKey = new Buffer.alloc(32,'4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318', 'hex')

web3.thk.defaultPrivateKey = privateKey
web3.thk.defaultAddress = "0x2c7536e3605d9c16a7a3d7b1898e529396a65c23"
web3.thk.defaultChainId = "1"

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



function getContract(chainId,abi){
    var getcommittee = web3.thk.contract(abi);
    return getcommittee
}
var code = "0x60806040526152f16000556040518060400160405280600581526020017f48656c6c6f00000000000000000000000000000000000000000000000000000081525060019080519060200190610055929190610068565b5034801561006257600080fd5b5061010d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100a957805160ff19168380011785556100d7565b828001600101855582156100d7579182015b828111156100d65782518255916020019190600101906100bb565b5b5090506100e491906100e8565b5090565b61010a91905b808211156101065760008160009055506001016100ee565b5090565b90565b6103388061011c6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80637fcaf6661461004657806389ea642f14610101578063d46300fd14610184575b600080fd5b6100ff6004803603602081101561005c57600080fd5b810190808035906020019064010000000081111561007957600080fd5b82018360208201111561008b57600080fd5b803590602001918460018302840111640100000000831117156100ad57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506101a2565b005b6101096101bc565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561014957808201518184015260208101905061012e565b50505050905090810190601f1680156101765780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61018c61025e565b6040518082815260200191505060405180910390f35b80600190805190602001906101b8929190610267565b5050565b606060018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102545780601f1061022957610100808354040283529160200191610254565b820191906000526020600020905b81548152906001019060200180831161023757829003601f168201915b5050505050905090565b60008054905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106102a857805160ff19168380011785556102d6565b828001600101855582156102d6579182015b828111156102d55782518255916020019190600101906102ba565b5b5090506102e391906102e7565b5090565b61030991905b808211156103055760008160009055506001016102ed565b5090565b9056fea165627a7a72305820dc141907d107a8cd5c13b68293d422cffebdff91997f129677368be5273b5b1e0029"
//调用合约
var getContractResp = getContract(web3.thk.defaultChainId,[{"constant":false,"inputs":[{"name":"data","type":"string"}],"name":"setString","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getString","outputs":[{"name":"data","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getA","outputs":[{"name":"data","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]);

getContractResp.new({data: code}, function (err, hash) {
    if(err) {
        console.error(err);
        return;
    } else if(hash){
        console.log("get contract res:",hash);
    }
});

/**
 * 跨链交易生成支票证明
 * web3.thk.RpcMakeVccProof()    具体用法参考  eachOtherChainTransfer.js文件
 * 生成取消支票
 * web3.thk.MakeCCCExistenceProof      具体用法参考  refund.js文件
 */






