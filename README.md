# Installation

### npm

```bash
npm install web3.js-thk
```

### Yarn

```bash
yarn add web3.js-thk
```

### As a Browser module

* Include `web3.min.js` in your html file. (not required for the meteor package)

# Usage

Use the `web3` object directly from the global namespace:

```js
var Web3 = require('web3.js-thk');
var web3 = new Web3();
console.log(web3); // {thk: .., shh: ...} // It's here!
```

Set a provider (`HttpProvider` using [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)):

```js
web3.setProvider(new web3.providers.HttpProvider('http://test.thinkey.xyz'));
```

There you go, now you can use it:

```js
var account = web3.thk.GetAccount(chainId,address);
var balance = account.balance;
```

You can find more examples in the [`example`](https://github.com/thinkey-dev/web3.js-thk/tree/master/example) directory.

# Thinkey Web3.js SDK接口文档

# 1. 获取账户余额(web3.thk.getAccount)

请求参数
           

| 参数名  |  类型  | 是否必须 |   含义   |
| :-----: | :----: | :------: | :------: |
| chainId | string |   true   |   链id   |
| address | string |   true   | 账户地址 |

响应参数:

|   参数名    |  类型  | 是否必须 |                 含义                 |
| :---------: | :----: | :------: | :----------------------------------: |
|   address   | string |   true   |               账户地址               |
|    nonce    |  int   |   true   |  交易的发起者在之前进行过的交易数量  |
|   balance   | bigint |   true   |               账户余额               |
| storageRoot | string |  false   | 合约存储数据的hash(没有合约返回null) |
|  codeHash   | string |  false   |   合约代码的hash(没有合约返回null)   |

请求示例:

```javascript
var response = web3.thk.GetAccount("2","0x2c7536e3605d9c16a7a3d7b1898e529396a65c23");
```

```json
response:
{
  	"address": "0x2c7536e3605d9c16a7a3d7b1898e529396a65c23",
	"balance": 9.99999985e+26,
	"codeHash": null,
	"nonce": 43,
	"storageRoot": null
}
```

# 2. 执行一笔交易(web3.thk.SendTx)

请求参数：
           

|   参数名    |  类型  | 是否必须 |                含义                |
| :---------: | :----: | :------: | :--------------------------------: |
|   chainId   | string |   true   |                链id                |
|    from     | string |   true   |          交易发起账户地址          |
|     to      | string |   true   |          交易接受账户地址          |
|    nonce    | string |   true   | 交易的发起者在之前进行过的交易数量 |
|    value    | string |   true   |              转账金额              |
|    input    | string |   true   |          调用合约时的参数          |
| fromChainId | string |   true   |           交易发起链 id            |
|  toChainId  | string |   true   |           交易接受链 id            |
|     sig     | string |   true   |              交易签名              |
|     pub     | string |   true   |                公钥                |

响应参数:
           

| 参数名 |  类型  | 是否必须 |   含义   |
| :----: | :----: | :------: | :------: |
| TXhash | string |   true   | 交易hash |

请求示例:

```javascript
var response = web3.thk.SendTx({
  chainId: '2',
  fromChainId: '2',
  toChainId: '2',
  from: '0x0000000000000000000000000000000000000000',
  to: '0x0e50cea0402d2a396b0db1c5d08155bd219cc52e',
  nonce: '1',
  value: '0',
  input:'0xc3bea9af000000000000000000000000ca35b7d915458ef540ade6068dfe2f44e8fa733c',
  sig:'0x7d5c7b6b28dd66bada7cfb153fe03433deb331cc74ca82de3ddf49708f1174895404682fcb9bcb30fdb7f6d041b78c56d87e18df1ca6e7e2bd75e38a6a1c8d631c',
  pub:'0x044e3b81af9c2234cad09d679ce6035ed1392347ce64ce405f5dcd36228a25de6e47fd35c4215d1edf53e6f83de344615ce719bdb0fd878f6ed76f06dd277956de' 
});
```

```json
response:
{
    "TXhash": "0x22024c2e429196ac76d0e557ac0cf6141f5b500c56fde845582b837c9dab236b"
}
```

# 3. 通过交易hash获取交易详情(web3.thk.GetTxByHash)

请求参数：
           

| 参数名  |  类型  | 是否必须 |   含义   |
| :-----: | :----: | :------: | :------: |
| chainId | string |   true   |   链id   |
|  hash   | string |   true   | 交易hash |

响应参数:
           

|     参数名      |    类型     | 是否必须 |                    含义                     |
| :-------------: | :---------: | :------: | :-----------------------------------------: |
|   Transaction   |    dict     |   true   |                  交易详情                   |
|      root       |   string    |   true   | 保存了创建该receipt对象时，“账户”的当时状态 |
|     status      |     int     |   true   |          交易状态: 1:成功, 0:失败           |
|      logs       | array[dict] |  false   |         这个交易产生的日志对象数组          |
| transactionHash |   string    |   true   |                  交易hash                   |
| contractAddress |   string    |   true   |                合约账户地址                 |
|       out       |   string    |   true   |              调用返回结果数据               |

Transaction:
           

| 参数名  |  类型  | 是否必须 |                含义                |
| :-----: | :----: | :------: | :--------------------------------: |
| chainID |  int   |   true   |                链id                |
|  from   | string |   true   |          交易发起账户地址          |
|   to    | string |   true   |          交易接受账户地址          |
|  nonce  | string |   true   | 交易的发起者在之前进行过的交易数量 |
|   val   | string |   true   |              转账金额              |
|  input  | string |   true   |          调用合约时的参数          |

请求示例:

```javascript
var response = web3.thk.GetTxByHash('2', '0x29d7eef512137c55f67a7012e814e5add45ae8b81a9ceb8e754c38e8aa5dee4d');
```

```json
response:
{
    "Transaction": {
        "chainID": 2,
        "from": "0x0000000000000000000000000000000000000000",
        "to": null,
        "nonce": 0,
        "value": 0,
        "input": "0x6080604052600160005534801561001557600080fd5b50600260008190555060a18061002c6000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063d46300fd146044575b600080fd5b348015604f57600080fd5b506056606c565b6040518082815260200191505060405180910390f35b600080549050905600a165627a7a72305820c52125523008034b3491540aa03fc856951b8da206b011ac05a0c6b52f61b3c00029"
    },
    "root": null,
    "status": 1,
    "logs": null,
    "transactionHash": "0x24d06cf16cd9aad66a144ad2b1b2e475d936656027cd70eae792459926b4a8c1",
    "contractAddress": "0x0e50cea0402d2a396b0db1c5d08155bd219cc52e",
    "out": "0x"
}
```

# 4. 获取链信息(web3.thk.GetStats)

请求参数
           

| 参数名  |  类型  | 是否必须 | 含义 |
| :-----: | :----: | :------: | :--: |
| chainId | string |   true   | 链id |

响应参数:
           

|      参数名       |  类型  | 是否必须 |          含义          |
| :---------------: | :----: | :------: | :--------------------: |
|   currentheight   | bigint |   true   |        交易详情        |
|      txcount      |  int   |   true   |        总交易数        |
|        tps        |  int   |   true   |       每秒交易数       |
|   tpsLastEpoch    |  int   |   true   |     上一时期交易数     |
|       lives       |  int   |   true   |     链的已存活时间     |
|   accountcount    |  int   |   true   |         账户数         |
|    epochlength    |  int   |   true   |   当前时期包含多少块   |
|   epochduration   |  int   |   true   |    当前时期运行时间    |
| lastepochduration |  int   |   true   |   上一时期的运行时间   |
|    currentcomm    | array  |   true   | 当前这条链的委员会成员 |

请求示例:

```javascript
var response = web3.thk.GetStats('2')
```

```json
response
{
    "currentheight": 5290,
    "txcount": 5295,
    "tps": 0,
    "tpsLastEpoch": 0,
    "lives": 10714,
    "accountcount": 6,
    "epochlength": 80,
    "epochduration": 162,
    "lastepochduration": 162,
    "currentcomm": [
        "0x96dc94580e0eadd78691807f6eac9759b9964daa8b46da4378902b040e0eb102cb48413308d2131e9e5557321f30ba9287794f689854e6d2e63928a082e79286",
        "0x4ce2edd98452036c804f3f2eeef157672be2ccf647369eb42eb49ab9f428821f9990efde3cf7f16e4c64616c10b673077f4278c6dd2fc6021da8ad0085a522a2"
    ]
}
```

# 5. 获取指定账户在对应链上一定高度范围内的交易信息(web3.thk.GetTransactions)

请求参数
           

|   参数名    |  类型  | 是否必须 |      含义      |
| :---------: | :----: | :------: | :------------: |
|   chainId   | string |   true   |      链id      |
|   address   | string |   true   |     链地址     |
| startHeight | string |   true   | 查询的起始块高 |
|  endHeight  | string |   true   | 查询的截止块高 |

响应参数:
           

|  参数名   |  类型  | 是否必须 |                含义                |
| :-------: | :----: | :------: | :--------------------------------: |
|  chainId  |  int   |   true   |                链id                |
|   from    | string |   true   |          交易发起账户地址          |
|    to     | string |   true   |          交易接受账户地址          |
|   nonce   |  int   |   true   | 交易的发起者在之前进行过的交易数量 |
|   value   |  int   |   true   |              转账金额              |
| timestamp |  int   |   true   |            交易的时间戳            |
|   input   | string |   true   |          调用合约时的参数          |
|   hash    | string |   true   |              交易hash              |

请求示例:

```javascript
var response = web3.thk.GetTransactions('2',"4fa1c4e6182b6b7f3bca273390cf587b50b47311", 50, 70);

```

```json
response:
[
    {
        "chainid": 2,
        "from": "0x2c7536e3605d9c16a7a3d7b1898e529396a65c23",
        "to": “0x0000000000000000000000000000000000020000”,
        "nonce": 0,
        "value": 0,
        "input":
        "0x000000022c7536e3605d9c16a7a3d7b1898e529396a65c230000000000000000000000034fa1c4e6182b6b7f3bca273390cf587b50b4731100000000000456440101",
        "hash":
        "0x0ea5dad47833fc6286357b6bd6c1a4e910def5f4432a1a59bde0f816c3dd18e0",
        "timestamp": 1560425588
    },
    {
        "chainid": 2,
        "from": "0x2c7536e3605d9c16a7a3d7b1898e529396a65c23",
        "to": "0x133c5bfef5d486052b061b44af113f20057341a8",
        "nonce": 1,
        "value": 0,
        "input":
        "0xa9059cbb00000000000000000000000066261e3faf00ef1537b22f37d8db85f57066f58f0000000000000000000000000000000000000000000000000000000000004e20",
        "hash":
        "0x1dbbda2d229db82ff12b3bea82d49225e6bebd645def4c06da157ddbe5660066",
        "timestamp": 1560425596
    }
]

```

# 6. 调用交易（web3.thk.CallTransaction）

请求参数
           

|   参数名    |  类型  | 是否必须 |                含义                |
| :---------: | :----: | :------: | :--------------------------------: |
|   chainId   | string |   true   |                链id                |
| fromChainId | string |   true   |       交易发起账户地址的链id       |
|  toChainId  | string |   true   |       交易接受账户地址的链id       |
|    from     | string |   true   |          交易发起账户地址          |
|     to      | string |   true   |          交易接受账户地址          |
|    nonce    | string |   true   | 交易的发起者在之前进行过的交易数量 |
|    value    | string |   true   |              转账金额              |
|    input    | string |   true   |          调用合约时的参数          |

响应参数:
           

|     参数名      |    类型     | 是否必须 |                    含义                     |
| :-------------: | :---------: | :------: | :-----------------------------------------: |
|   Transaction   |    dict     |   true   |                  交易详情                   |
|      root       |   string    |   true   | 保存了创建该receipt对象时，“账户”的当时状态 |
|     status      |     int     |   true   |          交易状态: 1:成功, 0:失败           |
|      logs       | array[dict] |   true   |         这个交易产生的日志对象数组          |
| transactionHash |   string    |   true   |                  交易hash                   |
| contractAddress |   string    |   true   |                合约账户地址                 |
|       out       |   string    |   true   |              调用返回结果数据               |

Transaction:

| 参数名  |  类型  | 是否必须 |                含义                |
| :-----: | :----: | :------: | :--------------------------------: |
| chainId | string |   true   |                链id                |
|  from   | string |   true   |          交易发起账户地址          |
|   to    | string |   true   |          交易接受账户地址          |
|  nonce  | string |   true   | 交易的发起者在之前进行过的交易数量 |
|   val   | string |   true   |              转账金额              |
|  input  | string |   true   |          调用合约时的参数          |

请求示例:

```javascript
var response = web3.thk.CallTransaction({
    chainId:'2',
    fromChainId:'2',
    toChainId:'2', 
    from:'0x0000000000000000000000000000000000000000',
    to:'0x0e50cea0402d2a396b0db1c5d08155bd219cc52e',
    nonce:'22',
    value:'0',
    input:'0xe98b7f4d0000000000000000000000000000000000000000000000000000000000000001'
});

```

```json
response:
{
    "Transaction": {
        "chainID": 2,
        "from": "0x0000000000000000000000000000000000000000",
        "to": "0x0e50cea0402d2a396b0db1c5d08155bd219cc52e",
        "nonce": 2,
        "value": 0,
        "input": "0xe98b7f4d0000000000000000000000000000000000000000000000000000000000000001",
        "hash": '',
		"timestamp": 0
    },
    "root": null,
    "status": 0,
    "logs": null,
    "transactionHash": "0x9936cab441360985fc9e27904f0767c1c39fe8e0edb83709a0cdad52470a4592",
    "contractAddress": "0x0000000000000000000000000000000000000000",
    "out": "0x"
}

```

# 7. 获取指定块高信息(web3.thk.GetBlockHeader)

请求参数
           

| 参数名  |  类型  | 是否必须 |     含义     |
| :-----: | :----: | :------: | :----------: |
| chainId | string |   true   |     链id     |
| height  | string |   true   | 查询块的块高 |

响应参数:
           

|    参数名    |  类型  | 是否必须 |          含义          |
| :----------: | :----: | :------: | :--------------------: |
|     hash     | string |   true   |       此块的hash       |
| previoushash | string |   true   |       父块的hash       |
|   chainid    |  int   |   true   |          链id          |
|    height    |  int   |   true   |      查询块的块高      |
|  mergeroot   | string |   true   | 合并其他链转账数据hash |
|  deltaroot   | string |   true   |    跨链转账数据hash    |
|  stateroot   | string |   true   |        状态hash        |
|   txcount    |  int   |   true   |        交易总数        |
|  timestamp   |  int   |   true   |         时间戳         |

请求示例:

```javascript
var response = web3.thk.GetBlockHeader('2', '30');

```

```json
response:
{
    "hash": "0x71603186004fd46d32cda0780c4f4cf77ce13b396b1b8132b2c632173441b9d2",
    "previoushash": "0xd0f6e9c89eb6be655632911e3743b5a994423c3526653dc55b62ebea3ff56c43",
    "chainid": 2,
    "height": 30,
    "mergeroot": "0xdddfde85423a0d7da064c1b5a8cc1ff18d4a209027ef95ecceae0e6ed8f7c1af",
    "deltaroot": "0xdddfde85423a0d7da064c1b5a8cc1ff18d4a209027ef95ecceae0e6ed8f7c1af",
    "stateroot": "0x0b672749b02da6bf8f3aa50238140ce7fae5af3e926d4eb06d4cfb707a90702e",
    "txcount": 1,
    "timestamp": 1547777358
}

```

# 8. 获取指定块的交易(web3.thk.GetBlockTxs)

请求参数
       

| 参数名  |  类型  | 是否必须 |     含义     |
| :-----: | :----: | :------: | :----------: |
| chainId | string |   true   |     链id     |
| height  | string |   true   | 查询块的块高 |
|  page   | string |   true   |     页码     |
|  size   | string |   true   |   页的大小   |

响应参数:
           

|     参数名     | 类型  | 是否必须 |   含义   |
| :------------: | :---: | :------: | :------: |
|   elections    | dict  |   true   | 交易详情 |
| accountchanges | array |   true   | 交易信息 |

accountchanges:

|  参数名   |  类型  | 是否必须 |                含义                |
| :-------: | :----: | :------: | :--------------------------------: |
|  chainId  | string |   true   |                链id                |
|  height   |  int   |   true   |           查询的起始块高           |
|   from    | string |   true   |          交易发起账户地址          |
|    to     | string |   true   |          交易接受账户地址          |
|   nonce   |  int   |   true   | 交易的发起者在之前进行过的交易数量 |
|   value   |  int   |   true   |              转账金额              |
| timestamp |  int   |   true   |            交易的时间戳            |

请求示例:

```javascript
var response = web3.thk.GetBlockTxs('2', '30','1','10');

```

```json
response:
{
    "elections": null,
    "accountchanges": [
        {
            "chainId": 2,
            "height": 30,
            "from": "0x4fa1c4e6182b6b7f3bca273390cf587b50b47311",
            "to": "0x4fa1c4e6182b6b7f3bca273390cf587b50b47311",
            "nonce": 30,
            "value": 1,
            "input": "0x",
			"hash":
"0x4bff6fad0cd46599289e4e465987cfc94278363b12eca3f37572be8c2ce1b061",
            "timestamp": 1547777358
        }
    ]
}

```

# 9. 编译合约(solc.compile)

**Web3.js-thk项目example目录contractTest.js 文件有示例**

请求参数

```javascript
var input = {
    language: 'Solidity',
    sources: {
        'test.sol': {      //合约文件名称
          content: contractContent     //合约文件内容
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
```

请求示例:

```javascript

var solc = require('solc');
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
    //output.contracts里面可能有多个合约文件，key文件名称
}
let contents = 'pragma solidity >= 0.5.0;contract MyFirst{uint256 a = 21233;string str = "Hello";function getA() public view returns(uint256 data){return a;}function getString() public view returns(string memory data){return str;}function setString(string memory data) public{str = data;}}'
var contractObj_MyFirst = getCompileContract(contents)['MyFirst'];    //返回合约对象里面可能有多个contract类， key为contract名称
var contractAbi = contractObj_MyFirst.abi;
var contractByteCode = contractObj_MyFirst.evm.bytecode.object.slice(0,2) === '0x' ? contractObj_MyFirst.evm.bytecode.object : '0x'+contractObj_MyFirst.evm.bytecode.object;


//最后获取合约abi 和 byteCode 字节码
```

# 10. 部署合约（web3.thk.contract(abi).new({data: code});）

# 调用合约方法 (web3.thk.contract(abis,contractAddress).at(contractAddress))

**Web3.js-thk项目example目录contractTest.js 文件有示例**

请求参数

```javascript
var contractAbi = contractObj_MyFirst.abi;
var contractByteCode = contractObj_MyFirst.evm.bytecode.object.slice(0,2) === '0x' ? contractObj_MyFirst.evm.bytecode.object : '0x'+contractObj_MyFirst.evm.bytecode.object;
//编译合约生成的abi 和byteCode 字节码
```

请求示例:

```javascript
//部署合约 参数为合约abi 和 byteCode 字节码
function deployContract(abis, codes){
    let contracts = web3.thk.contract(abis).new({data: codes});
    if(contracts.transactionHash){
        sleep(5000)
        var conresp = web3.thk.GetTransactionByHash(web3.thk.defaultChainId, contracts.transactionHash);
        return conresp.contractAddress
    }
    return ''
}
//发布合约
var contractAddress = deployContract(contractAbi,contractByteCode)
console.log('get contract address',contractAddress, contractAbi);
//返回的为部署后的合约地址


//获取合约对象，调用合约方法，参数为合约abi 和 合约地址
function callContractObj(abis, address){
    let contractObj = web3.thk.contract(abis,address).at(address);
    return contractObj;
}
var MyContract = callContractObj(contractAbi,contractAddress)
//调用合约内的 setString  和 getString方法
MyContract.setString("world")
sleep(5000)    //合约内的修改方法需要等待hash成功后，此处等待5秒，酌情修改等待时长
console.log("get contract function res:",MyContract.getString());

```

# 

# 11. ping（web3.thk.Ping）

请求参数
           

| 参数名  |  类型  | 是否必须 |  含义   |
| :-----: | :----: | :------: | :-----: |
| address | string |   true   | ip+端口 |

响应参数:
           

|    参数名     |  类型  | 是否必须 |      含义      |
| :-----------: | :----: | :------: | :------------: |
|    nodeId     | string |   true   |     节点id     |
|    version    | string |   true   |      版本      |
|  isDataNode   |  bool  |   true   | 是否是数据节点 |
|  dataNodeOf   |  int   |   true   |    数据节点    |
|  lastMsgTime  | int64  |   true   | 上一个信息时间 |
| lastEventTime | int64  |   true   | 上一个事件时间 |
| lastBlockTime | int64  |   true   |  上一个块时间  |
|   overflow    |  bool  |   true   |      溢出      |
|  lastBlocks   |  map   |   true   |   最后一个块   |
|    opTypes    |  map   |   true   |      类型      |

请求示例:

```javascript
var response = web3.thk.Ping("192.168.1.13:22010")

```

```json
response:
{
    "nodeId":
    "0x5e17128ba224a96d6e84be0c7f899febea26c55c78940610d78a0d22dbd0ab03cc3233491d
    e0b5eb770dbf850b509bd191723df4fc40520bcbab565d46543d6e",
    "version": "V1.0.0",
    "isDataNode": true,
    "dataNodeOf": 0,
    "lastMsgTime": 1560850367,
    "lastEventTime": 1560850367,
    "lastBlockTime": 1560850367,
    "overflow": false,
    "lastBlocks": {
    	"0": 159927
    },
    "opTypes": {
        "0": [
        	"DATA"
        ]
    }
}

```

# 12. 生成支票的证明(web3.thk.RpcMakeVccProof)

请求参数
           

|   参数名    | 类型 | 是否必须 |   含义   |
| :---------: | :--: | :------: | :------: |
| transaction | dict |   true   | 交易对象 |

transaction：
           

|    参数名    |  类型  | 是否必须 |                含义                |
| :----------: | :----: | :------: | :--------------------------------: |
|   chainId    | string |   true   |                链id                |
| fromChainId  | string |   true   |       交易发起账户地址的链id       |
|  toChainId   | string |   true   |       交易接受账户地址的链id       |
|     from     | string |   true   |          交易发起账户地址          |
|      to      | string |   true   |          交易接受账户地址          |
|    nonce     | string |   true   | 交易的发起者在之前进行过的交易数量 |
|    value     | string |   true   |              转账金额              |
| ExpireHeight |  int   |   true   |              过期高度              |

响应参数:
           

| 参数名 |  类型  | 是否必须 |      含义      |
| :----: | :----: | :------: | :------------: |
| input  | string |   true   | 生成的支票证明 |

请求示例:

```javascript
let obj = {
    chainId: '2',
    from: '0x2c7536e3605d9c16a7a3d7b1898e529396a65c23',
    to: '0x2c7536e3605d9c16a7a3d7b1898e529396a65c23',
    fromChainId: '2',
    toChainId: '3',
    value: '1000000000000000',
    expireheight: '54223',
    nonce: '47'
}
var response = web3.thk.RpcMakeVccProof(obj)

```

```json
response:
{
    "input":
  '0x95000000022c7536e3605d9c16a7a3d7b1898e529396a65c23000000000000002f000000032c7536e3605d9c16a7a3d7b1898e529396a65c23000000000000d3cf07038d7ea4c6800002a2d30bc06dc891383f7c61c310c9109aae0407508ced3f5562670b13cc5f093777a65a0193941093a1b6df76df5387752a24b904aac80067c3aa0ea7eb1b40074d4a30889e0083412744c2000080809409934080c20202808100018187aa9f339cf1ba6ffe6986f68c639a835fac453ac37d0df6e72091b1cd1cd30001019424930080c20000c02c83b4898418ce3324a2deeacf5848d49981f8ad2ad60c810c23e78e840dbc1781000524ac33cdd9e9bf0cbdfc4d357d81d5d1638dd7516ec38d779300f5f6e76d9b7ee0eccda334e611eb97288b59a36e78b25eb15746f593036a56ab50f89174f60062e715f8969d49b1ada75ce66977ab01219068e1adcf104eb328442fa3002759eca078605c1b0ad6ff4323f7c23307585d3dddd504f96e7a7f722f9802d2a1b7130047aeaaba37848d7c13a6df0328565e15ba9401b2485ac662423afcc01bb4000110'
}

```

# 13. 生成取消支票的证明(web3.thk.MakeCCCExistenceProof)

请求参数
           

|   参数名    | 类型 | 是否必须 |   含义   |
| :---------: | :--: | :------: | :------: |
| transaction | dict |   true   | 交易对象 |

transaction：
           

|    参数名    |  类型  | 是否必须 |                含义                |
| :----------: | :----: | :------: | :--------------------------------: |
|   chainId    | string |   true   |                链id                |
| fromChainId  | string |   true   |       交易发起账户地址的链id       |
|  toChainId   | string |   true   |       交易接受账户地址的链id       |
|     from     | string |   true   |          交易发起账户地址          |
|      to      | string |   true   |          交易接受账户地址          |
|    nonce     | string |   true   | 交易的发起者在之前进行过的交易数量 |
|    value     | string |   true   |              转账金额              |
| ExpireHeight |  int   |   true   |              过期高度              |

响应参数:
           

|  参数名   |  类型  | 是否必须 |      含义      |
| :-------: | :----: | :------: | :------------: |
|   input   | string |   true   | 生成的支票证明 |
| existence |  bool  |   true   |  是否存过支票  |

请求示例:

```javascript
let obj = {
    chainId: '2',
    from: '0x2c7536e3605d9c16a7a3d7b1898e529396a65c23',
    to: '0x2c7536e3605d9c16a7a3d7b1898e529396a65c23',
    fromChainId: '2',
    toChainId: '3',
    value: '1000000000000000',
    expireheight: '54223',
    nonce: '47'
}
var response = web3.thk.MakeCCCExistenceProof(obj)

```

```json
response:
{
    "existence": false,
    "input":
  '0x95000000022c7536e3605d9c16a7a3d7b1898e529396a65c23000000000000002f000000032c7536e3605d9c16a7a3d7b1898e529396a65c23000000000000d3cf07038d7ea4c6800002a2d30bc06dc891383f7c61c310c9109aae0407508ced3f5562670b13cc5f093777a65a0193941093a1b6df76df5387752a24b904aac80067c3aa0ea7eb1b40074d4a30889e0083412744c2000080809409934080c20202808100018187aa9f339cf1ba6ffe6986f68c639a835fac453ac37d0df6e72091b1cd1cd30001019424930080c20000c02c83b4898418ce3324a2deeacf5848d49981f8ad2ad60c810c23e78e840dbc1781000524ac33cdd9e9bf0cbdfc4d357d81d5d1638dd7516ec38d779300f5f6e76d9b7ee0eccda334e611eb97288b59a36e78b25eb15746f593036a56ab50f89174f60062e715f8969d49b1ada75ce66977ab01219068e1adcf104eb328442fa3002759eca078605c1b0ad6ff4323f7c23307585d3dddd504f96e7a7f722f9802d2a1b7130047aeaaba37848d7c13a6df0328565e15ba9401b2485ac662423afcc01bb4000110'
}

```

# 14. 获取链结构（ web3.thk.GetChainInfo）

请求参数
           

|  参数名  |  类型  | 是否必须 |            含义            |
| :------: | :----: | :------: | :------------------------: |
| chainIds | string |   true   | 链id（备注：传空代表所有） |

响应参数:
           

| 参数名 |    类型     | 是否必须 |    含义    |
| :----: | :---------: | :------: | :--------: |
|   []   | []chainInfo |   true   | 链信息数组 |

chainInfo：
           

|  参数名   |    类型    | 是否必须 |    含义    |
| :-------: | :--------: | :------: | :--------: |
|  chainId  |    int     |   true   |    链id    |
| datanodes | []dataNode |   true   | 数据节点群 |
|   mode    |    int     |   true   |    模式    |
|  parent   |    int     |   true   |     父     |

dataNode：
           

|    参数名    |  类型  | 是否必须 |     含义     |
| :----------: | :----: | :------: | :----------: |
|  dataNodeId  |  int   |   true   |  数据节点id  |
|  dataNodeIp  | string |   true   |  数据节点ip  |
| dataNodePort |  int   |   true   | 数据节点端口 |

请求示例:

```javascript
var response = web3.thk.GetChainInfo([])

```

```json
response:
[
    {
        "chainId": 0,
        "datanodes": [
            {
                "dataNodeId":
                "0x5e17128ba224a96d6e84be0c7f899febea26c55c78940610d78a0d22dbd0ab03cc3233491d
                e0b5eb770dbf850b509bd191723df4fc40520bcbab565d46543d6e",
                "dataNodeIp": "192.168.1.13",
                "dataNodePort": 22010
            }
        ],
        "mode": 5,
        "parent": 1048576
    },
    {
        "chainId": 1,
        "datanodes": [
            {
                "dataNodeId":
                "0x96dc94580e0eadd78691807f6eac9759b9964daa8b46da4378902b040e0eb102cb48413308
                d2131e9e5557321f30ba9287794f689854e6d2e63928a082e79286",
                "dataNodeIp": "192.168.1.13",
                "dataNodePort": 22014
            }
        ],
        "mode": 6,
        "parent": 0
    },
    {
        "chainId": 2,
        "datanodes": [
            {
                "dataNodeId":
                "0xa93b150f11c422d8700554859281be8e34a91a859e0e021af186002c7e4a2661ea2467a63b
                417030d68e2fdddeb4342943dff13225da77124abf912fd092f71f",
                "dataNodeIp": "192.168.1.13",
                "dataNodePort": 22018
            }
        ],
        28
        "mode": 6,
        "parent": 0
    },
    {
        "chainId": 3,
        "datanodes": [
            {
                "dataNodeId":
                "0x783f4b2490461ecfd8ee8d3451e434de06bacb0ffff56de53a33fe545589094fa0b929eeaa
                62dc5203d1e831ccdd37d206d0b85b193921efb223bf0cb2f37b4c",
                "dataNodeIp": "192.168.1.13",
                "dataNodePort": 22022
            }
        ],
        "mode": 7,
        "parent": 1
    },
    {
        "chainId": 4,
        "datanodes": [
            {
                "dataNodeId":
                "0x44c98ab831f3ca4553e491bba06753e959ceb55d43e18bc76539572feb1e0dbaf2fbfc19f5
                29
                71d6544e82be1c7c39760f6a023d4be4dcb9473dd580c731d03926",
                "dataNodeIp": "192.168.1.13",
                "dataNodePort": 22026
            }
        ],
        "mode": 7,
        "parent": 1
    }
]

```

# 15. 获取委员会详情（web3.thk.GetCommittee）

请求参数
           

| 参数名  |  类型  | 是否必须 |   含义   |
| :-----: | :----: | :------: | :------: |
| chainId | string |   true   |   链id   |
|  epoch  | string |   true   | 参选轮次 |

响应参数:
           

|    参数名     |   类型   | 是否必须 |    含义    |
| :-----------: | :------: | :------: | :--------: |
| MemberDetails | []string |   true   | 委员会详情 |

请求示例:

```javascript
var response = web3.thk.GetCommittee("1","411")

```

```javascript
response:
[
    "0xe90a151759bf070969aae664e00502bb08568c85a73874492a3ec480c5178d5da29c790896fc62106e32d172819dec94202ff90f3b7ba3e6adf38508bc58cf43",
    "0x3224de0da639511fec588d2e28f4472476b1600d003a10e38e0456426337624aaecd6636e5ce7ff95fc10746471ce7b680f664ccbf17057ca18c761706afa391",
    "0xad88dc0c0cf7d9e4a62f97e81f33556f65abba96b3c7108a732ff20f1a23530ca7730a6885d91ac718e1bb6ebad5e18bf8b7a58b91cbf717b48b723c7ceedef6",
    "0x8c7872c0c96a9f5b396120a0a45706678ab7a34c34a146ce9329c894f8cb9de41ec10edbf6b9c85796fd9e91d8d651a53578f164c8ee71a2d2cbfef9d5a4c6a4",
    "0xdb3e5b5ea24e1d760a59cf22cfafeed5a4e57af2108fc0df3bf457a82f754264b3fdf9d77fcab306a9809ebcd76de91e382d912a90e3f37edf4eb04f3f036d0b",
    "0x4ce2edd98452036c804f3f2eeef157672be2ccf647369eb42eb49ab9f428821f9990efde3cf7f16e4c64616c10b673077f4278c6dd2fc6021da8ad0085a522a2", 
    "0xd1f889690f8c75bbada89a4c8893b8bf6fe29be3b5c3d8a2d772024a340d59d375f39ed88498666a57da10af885ad63a414f8a10153fb739eb1ebfcef57cc883"
]

```

# 16. 新建一个合约对象(web3.thk.contract)

请求参数
           

| 参数名  |  类型  | 是否必须 |                        含义                        |
| :-----: | :----: | :------: | :------------------------------------------------: |
|   abi   | string |   true   | abi数组(合约中的response["info"]["abiDefinition"]) |
| address | string |   true   |                      合约地址                      |

请求示例:

```javascript
// myCon对象可以直接调用合约内方法
URL : test.thinkey.xyz
var myCon = web3.thk.contract(getcontract["<stdin>:" + cotractName]["info"]["abiDefinition"]).at(contractAddress);
// 调用方法前手动设置账户
web3.thk.setCaller("0x0000000000000000000000000000000000000000")
web3.thk.setVal("0")
// 调用合约内set方法
myCon.set(2)
//调用合约内get方法, 需调用set方法后几秒钟再调用get
myCon.get()

```

