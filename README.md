# Wallet My Algo

![myalgo-logo](my-algo.png)

* [Overview](#Overview)
* [Installation](#Installation)
* [API Usage](#API-Usage)
  * [Connect to My Algo](#Connect-to-My-Algo)
  * [Payment transaction (with note)](#Payment-transaction-with-note)
  * [Payment transaction (with closeTo)](#Payment-transaction-with-closeTo)
  * [Payment transaction (with rekey)](#Payment-transaction-with-rekey)
  * [Payment transaction (with signer)](#Payment-transaction-with-signer)
  * [Asset transfer (with note)](#Asset-transfer-with-note)
  * [Asset transfer (with closeTo)](#Asset-transfer-with-closeTo)
  * [Asset freeze (with note)](#Asset-freeze-with-note)
  * [Asset config (create ASA)](#Asset-config-create-ASA)
  * [Asset config (update ASA)](#Asset-config-update-ASA)
  * [Asset config (remove ASA)](#Asset-config-remove-ASA)
  * [Keyreg](#Keyreg)
  * [Sign Teal](#Sign-Teal)
* [Copyright and License](#Copyright-and-License)

### Overview

Wallet My Algo is a Javascript library developed by Rand Labs to securely sign transactions with [My Algo](https://wallet.myalgo.com)

### Installation  

The library can be installed via npm:
```sh
npm i @randlabs/myalgo-connect
```

### API Usage  

#### Connect to My Algo  

```js

import MyAlgo from '@randlabs/myalgo-connect';


const myAlgoWallet = new MyAlgo();

/*Warning: Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interation */
const connectToMyAlgo = async() => {
  try {
    const accounts = await myAlgoWallet.connect();

    const addresses = accounts.map(account => account.address);
    
  } catch (err) {
    console.error(err);
  }
}
```

#### Payment transaction (with note)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'pay',
      from: addresses[0],
      to:  '...',
      amount: 1000000,
      note: new Uint8Array(Buffer.from('Hello World'))
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Payment transaction (with closeTo)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {
  
    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'pay',
      from: addresses[0],
      to:  '...',
      amount: 1000000,
      closeRemainderTo: '...' // closeTo address
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```


### Payment transaction (with rekey)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'pay',
      from: addresses[0],
      to:  addresses[0],
      amount: 0,
      reKeyTo: '...' //Authorized address for signing
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Payment transaction (with signer)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'pay',
      from: '...', // Rekeyed address
      to:  '...',
      amount: 1000000,
      signer: addresses[0] // Authorized adresses for signing
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Asset transfer (with note)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'axfer',
      assetIndex: 123,
      from: addresses[0],
      to:  '...',
      amount: 1000000,
      note: new Uint8Array(Buffer.from('Hello World'))
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Asset transfer (with closeTo)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {
  
    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'axfer',
      assetIndex: 123,
      from: addresses[0],
      to:  '...',
      amount: 1000000,
      closeRemainderTo: '...'
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Asset freeze (with note)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'afrz',
      from: addresses[0],
      assetIndex: 123,
      freezeAccount:  '...', // Address to freeze
      note: new Uint8Array(Buffer.from('Hello World')),
      freezeState: true
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Asset config (create ASA)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'acfg',
      from: addresses[0],
      assetName: 'My New Coin',
      assetUnitName: 'MNC',
      assetDecimals: 2,
      assetTotal: 50000000,
      assetURL: 'developer.algorand.org',
      assetFreeze: '...',
      assetManager: '...',
      assetReserve: '...',
      assetDefaultFrozen: false
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Asset config (update ASA)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'acfg',
      from: addresses[0],
      assetIndex: 123,
      assetFreeze: '...',
      assetManager: '...',
      assetReserve: '...',
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Asset config (remove ASA)

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'acfg',
      from: addresses[0],
      assetIndex: 123,
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Keyreg

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 2000,
      flatFee: true,
      type: 'keyreg',
      from: addresses[0],
      voteKey: 'eXq34wzh2UIxCZaI1leALKyAvSz/+XOe0wqdHagM+bw=',
      selectionKey: 'X84ReKTmp+yfgmMCbbokVqeFFFrKQeFZKEXG89SXwm4=',
      voteFirst: 6000000,
      voteLast: 9000000,
      voteKeyDilution: 1730,
    };
  
    let signedTxn = await myAlgoWallet.signTransaction(txn);
    console.log(signedTxn.txID);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Sign Teal

```js

import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


(async () => {
  try {

    let txn = await algodClient.getTransactionParams().do();
      
    txn = {
      ...txn,
      fee: 1000,
      flatFee: true,
      type: 'pay',
      from: '...',
      to: '...',
      amount: 10000,
    };

    let program = new Uint8Array(Buffer.from('ASABASI=', "base64")); // int 1

    let lsig = algosdk.makeLogicSig(program);
    lsig.sig = await myAlgoWallet.signLogicSig(program, addresses[0]);
  
    let signedTxn = algosdk.signLogicSigTransaction(txn, lsig);
  
    await algodClient.sendRawTransaction(signedTxn.blob).do();

  
  } catch(err) {
    console.error(err); 
  }
})();

```

### Copyright and License  

See [LICENSE](LICENSE.md) file.
