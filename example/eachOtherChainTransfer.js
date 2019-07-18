#!/usr/bin/env node
var Web3 = require('../index.js');
var web3 = new Web3();
var createCashCheckInput = require('../lib/utils/createCashCheckInput').createCashCheckInput;

web3.setProvider(new web3.providers.HttpProvider('http://test.thinkey.xyz'));
const privateKey = new Buffer('4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318', 'hex')

web3.thk.defaultPrivateKey = privateKey
web3.thk.defaultAddress = "0x2c7536e3605d9c16a7a3d7b1898e529396a65c23"
web3.thk.defaultChainId = "2"
_toIds = '3';


function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
      continue;
    }
}

/* 跨链转账流程   先取款 再存款
    1.  取款参数签名          web3.thk.signTransaction；
    2.  取款交易              web3.thk.SendTx；
    3.  查询取款hash结果      web3.thk.GetTransactionByHash;
    4.  生成支票              web3.thk.RpcMakeVccProof；
    5.  存款参数签名          web3.thk.signTransaction；
    6.  存款交易              web3.thk.SendTx；
    7.  查询存款hash结果      web3.thk.GetTransactionByHash;
    若存款失败执行退款流程
    8.  退款参数签名          web3.thk.signTransaction；
    9.  退款交易              web3.thk.SendTx；
    10.  查询退款hash结果     web3.thk.GetTransactionByHash;
*/

var getAccounts = web3.thk.GetAccount(web3.thk.defaultChainId, web3.thk.defaultAddress);
console.log("get account :", getAccounts);
var getStatsResp = web3.thk.GetStats('2');
console.log('get states :', getStatsResp);
_nonce = getAccounts.nonce.toString();
_heightNum = getStatsResp.currentheight + 200;
let valueNum =  1000000000000000;

let cashObj = {
    FromChain:    web3.thk.defaultChainId,
    FromAddress:  web3.thk.defaultAddress,
    Nonce:        getAccounts.nonce,
    ToChain:      _toIds,
    ToAddress:    web3.thk.defaultAddress,
    ExpireHeight: getStatsResp.currentheight + 200,
    Amount:       Number(valueNum)
}
let inputText = createCashCheckInput(cashObj)

let obj = {
    chainId: web3.thk.defaultChainId,
    fromChainId: web3.thk.defaultChainId,
    toChainId: web3.thk.defaultChainId,
    from:web3.thk.defaultAddress,
    to: '0x0000000000000000000000000000000000020000',
    nonce: getAccounts.nonce.toString(),
    value: '0',
    input: inputText
}
let sendTxParams = web3.thk.signTransaction(obj,web3.thk.defaultPrivateKey)
var sendtxResp = web3.thk.SendTx(sendTxParams);
console.log("sendTx response first:", sendtxResp);

if(sendtxResp && sendtxResp.TXhash){  //执行取款流程成功
    sleep(5000)
    var result = web3.thk.GetTransactionByHash(web3.thk.defaultChainId, sendtxResp.TXhash);
    console.log("getTxByHashResp response first:", result);
    if(result && result.status === 1){    //取款查询hash成功，执行生成支票流程
        let proofObj = {
            chainId: web3.thk.defaultChainId,
            from: web3.thk.defaultAddress,
            to: web3.thk.defaultAddress,
            fromChainId: web3.thk.defaultChainId,
            toChainId: _toIds,
            value: '1000000000000000',
            expireheight: _heightNum.toString(),
            nonce: _nonce.toString()
        }
        let proofResult = web3.thk.RpcMakeVccProof(proofObj);
        console.log('get rpcVccProof result first: ', proofResult, proofObj);
        if(proofResult && !proofResult.errMsg){  //生成支票成功， 执行存款流程
            var getNonce = web3.thk.GetAccount(_toIds, web3.thk.defaultAddress);

            let obj = {
                chainId: _toIds,
                fromChainId:_toIds,
                toChainId:_toIds,
                from: web3.thk.defaultAddress,
                to: "0x0000000000000000000000000000000000030000",
                nonce: getNonce.nonce.toString(),
                value: '0',
                input: proofResult.input
            } 
            let signParams = web3.thk.signTransaction(obj,web3.thk.defaultPrivateKey);
            let sendResult = web3.thk.SendTx(signParams)
            console.log("sendTx response two:", sendResult,signParams);
            if(sendResult && sendResult.TXhash){  //存款结束查询hash结果
                sleep(5000)
                var getHashResult = web3.thk.GetTransactionByHash(_toIds, sendResult.TXhash);
                console.log("getTxByHashResp response two:", getHashResult);
                if(getHashResult && getHashResult.status === 1){
                    console.log('sendTx success!!!');
                }else {    //存款失败执行退款流程
                    let proofTwoObj = {
                        chainId: _toIds,
                        from: web3.thk.defaultAddress,
                        to: web3.thk.defaultAddress,
                        fromChainId: web3.thk.defaultChainId,
                        toChainId: _toIds,
                        value: '1000000000000000',
                        expireheight: _heightNum.toString(),
                        nonce: _nonce.toString()
                    }
                    let proofTwoResult = web3.thk.RpcMakeVccProof(proofTwoObj);
                    console.log('get rpcVccProof result two: ', proofTwoResult);
                    if(proofTwoResult && !proofTwoResult.errMsg){    //退款生成支票成功,执行退款流程
                        var getNonceTh = web3.thk.GetAccount(web3.thk.defaultChainId, web3.thk.defaultAddress);

                        let sendTxThreeObj = {
                            chainId: web3.thk.defaultChainId,
                            fromChainId:web3.thk.defaultChainId,
                            toChainId:web3.thk.defaultChainId,
                            from: web3.thk.defaultAddress,
                            to: "0x0000000000000000000000000000000000040000",
                            nonce: getNonceTh.nonce.toString(),
                            value: '0',
                            input: proofTwoResult.input
                        } 
                        let signParamsThree = web3.thk.signTransaction(sendTxThreeObj,web3.thk.defaultPrivateKey);
                        let sendThreeResult = web3.thk.SendTx(signParamsThree)
                        console.log("sendTx response three:", sendThreeResult);
                        if(sendThreeResult && sendThreeResult.TXhash){  //退款查询hash流程
                            sleep(5000)
                            var getHashResultThree = web3.thk.GetTransactionByHash(web3.thk.defaultChainId, sendThreeResult.TXhash);
                            console.log("getTxByHashResp response three:", getHashResultThree);
                            if(getHashResultThree && getHashResultThree.status === 1){
                                console.log('sendTx refund success!!!');
                            }else {
                                console.log('sendTx refund failed!!!');
                            }
                        }
                    }
                }
            } 
        }
    }
}






