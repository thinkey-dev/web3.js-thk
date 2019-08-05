#!/usr/bin/env node
var Web3 = require('../index.js');
var web3 = new Web3();
var deCashInput = require('../lib/utils/createCashCheckInput').deCashInput;

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


/* 继续交易或退款流程  
    1.  生成取消支票          web3.thk.MakeCCCExistenceProof
    判断条件   终止交易
    2.  退款参数签名          web3.thk.signTransaction；
    3.  退款交易              web3.thk.SendTx；
    4.  查询退款hash结果     web3.thk.GetTransactionByHash;
    继续交易             web3.thk.RpcMakeVccProof；
    5.  存款参数签名          web3.thk.signTransaction；
    6.  存款交易              web3.thk.SendTx；
    7.  查询存款hash结果      web3.thk.GetTransactionByHash;
*/

let str = '0x000000022c7536e3605d9c16a7a3d7b1898e529396a65c23000000000000005a000000032c7536e3605d9c16a7a3d7b1898e529396a65c2300000000000093c72000000000000000000000000000000000000000000000000000038d7ea4c68000'
var getAccounts = web3.thk.GetAccount(web3.thk.defaultChainId, web3.thk.defaultAddress);
// console.log("get account :", getAccounts);

let inputData = deCashInput(str);
// console.log('decashInput result',inputData);

_inputText = '';
let obj = {
    chainId: inputData.ToChain,
    from: inputData.FromAddress,
    to: inputData.FromAddress,
    fromChainId: inputData.FromChain,
    toChainId: inputData.ToChain,
    value: inputData.Amount,
    expireheight: inputData.ExpireHeight,
    nonce: inputData.Nonce
};
let result = web3.thk.MakeCCCExistenceProof(obj)
console.log('MakeCCCExistenceProof result: ', result);

if(result && !result.errMsg){
    if(!result.existence){
        var getStatsResp = web3.thk.GetStats(inputData.ToChain);
        console.log('get states :', getStatsResp);
        if(getStatsResp.currentheight > inputData.ExpireHeight){   //终止交易
            var getNonceTh = web3.thk.GetAccount(inputData.FromChain, web3.thk.defaultAddress);

            let sendTxThreeObj = {
                chainId: inputData.FromChain,
                fromChainId:inputData.FromChain,
                toChainId:inputData.FromChain,
                from: web3.thk.defaultAddress,
                to: "0x0000000000000000000000000000000000040000",
                nonce: getNonceTh.nonce.toString(),
                value: '0',
                input: result.proof
            } 
            let signParamsThree = web3.thk.signTransaction(sendTxThreeObj,web3.thk.defaultPrivateKey);
            let sendThreeResult = web3.thk.SendTx(signParamsThree)
            console.log("sendTx terminate transfer :", sendThreeResult);
            if(sendThreeResult && sendThreeResult.TXhash){  //退款查询hash流程
                sleep(5000)
                var getHashResultThree = web3.thk.GetTransactionByHash(inputData.FromChain, sendThreeResult.TXhash);
                console.log("getTxByHashResp response three:", getHashResultThree);
                if(getHashResultThree && getHashResultThree.status === 1){
                    console.log('sendTx refund success!!!');
                }else {
                    console.log('sendTx refund failed!!!');
                }
            }
        }else {     //继续交易
            var getNonce = web3.thk.GetAccount(inputData.ToChain, web3.thk.defaultAddress);

            let obj = {
                chainId: inputData.ToChain,
                fromChainId:inputData.ToChain,
                toChainId:inputData.ToChain,
                from: inputData.FromAddress,
                to: "0x0000000000000000000000000000000000030000",
                nonce: getNonce.nonce.toString(),
                value: '0',
                input: result.proof
            } 
            let signParams = web3.thk.signTransaction(obj,web3.thk.defaultPrivateKey);
            let sendResult = web3.thk.SendTx(signParams)
            console.log("sendTx continue transfer:", sendResult,signParams);
            if(sendResult && sendResult.TXhash){  //存款结束查询hash结果
                sleep(5000)
                var getHashResult = web3.thk.GetTransactionByHash(web3.thk.defaultChainId, sendResult.TXhash);
                console.log("getTxByHashResp response save:", getHashResult);
                if(getHashResult && getHashResult.status === 1){    //继续交易成功
                    console.log('sendTx success!!!');
                }else {     //继续交易失败， 执行退款流程

                }
            }
        }
    }
}






