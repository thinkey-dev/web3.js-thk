var BigNumber = require('bignumber.js');

var leftPad = function (string, chars, hasPrefix,sign) {
    //var hasPrefix = /^0x/i.test(string) || typeof string === 'number';
    string = string.toString(16).replace(/^0x/i,'');

    var padding = (chars - string.length + 1 >= 0) ? chars - string.length + 1 : 0;

    return (hasPrefix ? '0x' : '') + new Array(padding).join(sign ? sign : "0") + string;
};

function createCashCheckInput(CashCheck){
    let str = "0x";
    str += leftPad(CashCheck.FromChain,8);
    str += leftPad(CashCheck.FromAddress,40);
    str += leftPad(CashCheck.Nonce,16);
    str += leftPad(CashCheck.ToChain,8);
    str += leftPad(CashCheck.ToAddress,40);
    str += leftPad(CashCheck.ExpireHeight,16);
    str += leftPad(32,2);
    str += leftPad(CashCheck.Amount,64);
    console.log("createCashCheckInput =",str);
    //0x000000022c7536e3605d9c16a7a3d7b1898e529396a65c23000000000000003c000000032c7536e3605d9c16a7a3d7b1898e529396a65c2400000000000083ec200000000000000000000000000000000000000000000000000000000000000001
    return str
};

function deCashInput(str){
    if(!str || str.length < 196){
        return;
    }
    let obj = {};
    obj.FromChain = parseInt(str.slice(2,10), 16).toString();
    obj.FromAddress = '0x' + str.slice(10,50);
    obj.Nonce = parseInt(str.slice(50,66), 16).toString();
    obj.ToChain = parseInt(str.slice(66,74), 16).toString();
    obj.ToAddress = '0x' + str.slice(74,114);
    obj.ExpireHeight = parseInt(str.slice(114,130), 16).toString();
    obj.Amount = new BigNumber('0x'+str.slice(132,196),10).toString();
    return obj;
}

module.exports = {createCashCheckInput,deCashInput};