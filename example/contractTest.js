#!/usr/bin/env node


var Web3 = require('../index.js');
// var sleep = require('sleep')
var web3 = new Web3();
var solc = require('solc');

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


/**
 * @description: 部署合约
 * @param {String} abis     //编译合约生成的abi
 * @param {String} codes    //编译合约生成的字节码
 * @return:    //返回合约地址
 */
function deployContract(abis, codes){
    let contracts = web3.thk.contract(abis).new({data: codes});
    if(contracts.transactionHash){
        sleep(5000)
        var conresp = web3.thk.GetTransactionByHash(web3.thk.defaultChainId, contracts.transactionHash);
        return conresp.contractAddress
    }
    return ''
}

/**
 * @description: 获取合约对象，可以调用合约方法
 * @param {String} abis     //编译合约生成的abi
 * @param {String} address    //部署过的合约的地址
 * @return:    //返回合约对象
 */
function callContractObj(abis, address){
    let contractObj = web3.thk.contract(abis,address).at(address);
    return contractObj;
}

/**
 * @description: 编译合约
 * @param {String} contractContent    //合约代码
 * @return:   //返回所有合约的对象，key为单个合约的名称
 */
function getCompileContract(contractContent){    //合约可能有多个
    var input = {
        language: 'Solidity',
        sources: {
          'test.sol': {
            content: contractContent
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };
      
    var output = JSON.parse(solc.compile(JSON.stringify(input)));
    // for (var contractName in output.contracts['test.sol']) {
    //     console.log(
    //         contractName + ': '
    //         + output.contracts['test.sol'][contractName]
    //     );
    // }
    return output.contracts['test.sol'] 
}

let contents = 'pragma solidity >= 0.5.0;contract MyFirst{uint256 a = 21233;string str = "Hello";function getA() public view returns(uint256 data){return a;}function getString() public view returns(string memory data){return str;}function setString(string memory data) public{str = data;}}'

// 编译合约
var contractObj_MyFirst = getCompileContract(contents)['MyFirst'];
var contractAbi = contractObj_MyFirst.abi;
var contractByteCode = contractObj_MyFirst.evm.bytecode.object.slice(0,2) === '0x' ? contractObj_MyFirst.evm.bytecode.object : '0x'+contractObj_MyFirst.evm.bytecode.object;




// //发布合约
var contractAddress = deployContract(contractAbi,contractByteCode)
console.log('get contract address',contractAddress, contractAbi);




//获取合约对象， 通过该对象可以调用合约内的方法
var MyContract = callContractObj(contractAbi,contractAddress)
//调用合约内的 setString  和 getString方法
MyContract.setString("world")
sleep(5000)
console.log("get contract function res:",MyContract.getString());