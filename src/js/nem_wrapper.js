import {/* UnconfirmedTransactionListener, ConfirmedTransactionListener, */
  Account, AccountHttp, MosaicHttp, NEMLibrary, NetworkTypes, Address,
  SimpleWallet, Password, EncryptedPrivateKey, TimeWindow, Message, PlainMessage, XEM,
  TransactionHttp, TransferTransaction, AccountOwnedMosaicsService, MosaicId} from 'nem-library'
import {Observable} from 'rxjs/Observable'
import encoding from 'encoding-japanese'
import nem from 'nem-sdk'

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET)

const PASSWORD = 'password'
const PUBLICK_KEY = 'publicKey'
const PRIVATE_KEY = 'privateKey'
const NEM_UNIT = 1000000

exports.PUBLICK_KEY = PUBLICK_KEY
exports.PRIVATE_KEY = PRIVATE_KEY
exports.NEM_UNIT = NEM_UNIT
exports.PASSWORD = PASSWORD

const nodes = [
  {protocol: 'https', domain: 'aqualife2.supernode.me', port: 7891},
  {protocol: 'https', domain: 'aqualife3.supernode.me', port: 7891},
  // {protocol: 'https', domain: 'beny.supernode.me', port: 7891}, 調子悪い？
  {protocol: 'https', domain: 'happy.supernode.me', port: 7891},
  {protocol: 'https', domain: 'mnbhsgwbeta.supernode.me', port: 7891},
  // {protocol: 'https', domain: 'nemstrunk.supernode.me', port: 7891}, 調子悪い？
  // {protocol: 'https', domain: 'nemstrunk2.supernode.me', port: 7891}, 調子悪い？
  {protocol: 'https', domain: 'nsm.supernode.me', port: 7891},
  {protocol: 'https', domain: 'kohkei.supernode.me', port: 7891},
  {protocol: 'https', domain: 'mttsukuba.supernode.me', port: 7891},
  {protocol: 'https', domain: 'strategic-trader-1.supernode.me', port: 7891},
  {protocol: 'https', domain: 'strategic-trader-2.supernode.me', port: 7891},
  {protocol: 'https', domain: 'shibuya.supernode.me', port: 7891},
  {protocol: 'https', domain: 'qora01.supernode.me', port: 7891},
  {protocol: 'https', domain: 'pegatennnag.supernode.me', port: 7891}
]
/*
const webScoketNodes = [
  {protocol: 'https', domain: 'aqualife2.supernode.me', port: 7779},
  {protocol: 'https', domain: 'aqualife3.supernode.me', port: 7779},
  // {protocol: 'https', domain: 'beny.supernode.me', port: 7891}, 調子悪い？
  {protocol: 'https', domain: 'happy.supernode.me', port: 7779},
  {protocol: 'https', domain: 'mnbhsgwbeta.supernode.me', port: 7779},
  {protocol: 'https', domain: 'nemstrunk.supernode.me', port: 7779},
  {protocol: 'https', domain: 'nemstrunk2.supernode.me', port: 7779},
  {protocol: 'https', domain: 'nsm.supernode.me', port: 7779},
  {protocol: 'https', domain: 'kohkei.supernode.me', port: 7779},
  {protocol: 'https', domain: 'mttsukuba.supernode.me', port: 7779},
  {protocol: 'https', domain: 'strategic-trader-1.supernode.me', port: 7779},
  {protocol: 'https', domain: 'strategic-trader-2.supernode.me', port: 7779},
  {protocol: 'https', domain: 'shibuya.supernode.me', port: 7779},
  {protocol: 'https', domain: 'qora01.supernode.me', port: 7779},
  {protocol: 'https', domain: 'pegatennnag.supernode.me', port: 7779}
]
*/
// Using custom NIS Node
const accountHttp = new AccountHttp(nodes)
const mosaicHttp = new MosaicHttp(nodes)
const transactionHttp = new TransactionHttp(nodes)

let getStr2Array = (str) => {
  let array = []
  for (let i = 0; i < str.length; i++) {
    array.push(str.charCodeAt(i))
  }
  return array
}

// アカウントステータスを確認.
exports.getStatus = (addr) => {
  let promise = new Promise((resolve, reject) => {
    console.log(addr)
    const address = new Address(addr)
    accountHttp.status(address).subscribe(
      AccountStatus => { resolve(AccountStatus) },
      error => { reject(error) }
    )
  })
  return promise
}

// アカウント取得.
exports.getAccount = (addr) => {
  let promise = new Promise((resolve, reject) => {
    console.log(addr)
    const address = new Address(addr)
    accountHttp.getFromAddress(address).subscribe(
      accountInfoWithMetaData => { resolve(accountInfoWithMetaData) },
      error => { reject(error) }
    )
  })
  return promise
}

// アカウント取得(公開鍵).
exports.getAccountFromPublicKey = (publicKey) => {
  let promise = new Promise((resolve, reject) => {
    accountHttp.getFromPublicKey(publicKey).subscribe(
      accountInfoWithMetaData => { resolve(accountInfoWithMetaData) },
      error => { reject(error) }
    )
  })
  return promise
}

// トランザクション履歴を取得
exports.getTransaction = (addr, pageSize, hash, id) => {
  let promise = new Promise((resolve, reject) => {
    console.log(addr)
    const address = new Address(addr)
    let params = { pageSize: pageSize, hash: hash, id: id }
    accountHttp.allTransactions(address, params).subscribe(
      transaction => { resolve(transaction) },
      error => { reject(error) }
    )
  })
  return promise
}

// 未承認トランザクションの取得.
exports.getUnconfirmedTransaction = (addr) => {
  let promise = new Promise((resolve, reject) => {
    console.log(addr)
    const address = new Address(addr)
    accountHttp.unconfirmedTransactions(address).subscribe(
      unconfirmedTransaction => { resolve(unconfirmedTransaction) },
      error => { reject(error) }
    )
  })
  return promise
}

// 所有モザイクを取得
exports.getMosaics = (addr) => {
  let promise = new Promise((resolve, reject) => {
    let address = new Address(addr)
    let accountOwnedMosaics = new AccountOwnedMosaicsService(accountHttp, mosaicHttp)
    accountOwnedMosaics.fromAddress(address).subscribe(
      mosaics => { resolve(mosaics) },
      error => { reject(error) }
    )
  })
  return promise
}

// 所有モザイクを取得
exports.getMosaicDefinition = (mosaic) => {
  let promise = new Promise((resolve, reject) => {
    mosaicHttp.getMosaicDefinition(mosaic).subscribe(
      mosaicDefinition => { resolve(mosaicDefinition) },
      error => { reject(error) }
    )
  })
  return promise
}

// メッセージ取得.
exports.getMessageFromPlain = (hex) => {
  return Message.decodeHex(hex)
}

// 公開鍵と秘密鍵を取得.
exports.getPairKey = (account, pass) => {
  const address = new Address(account.address.value)
  const encryptedPrivateKey = new EncryptedPrivateKey(account.encryptedPrivateKey.encryptedKey, account.encryptedPrivateKey.iv)
  const simpleWallet = new SimpleWallet(account.name, account.network, address, account.creationDate, encryptedPrivateKey)

  const password = new Password(pass)
  const wallet = simpleWallet.open(password)
  // console.log(wallet)
  let pairKey = {}
  pairKey[PUBLICK_KEY] = wallet[PUBLICK_KEY]
  pairKey[PRIVATE_KEY] = wallet[PRIVATE_KEY]
  // console.log(pairKey)
  return pairKey
}

// ウォレット作成.
exports.createWallet = (name, pass) => {
  console.log('createWallet', name, pass)
  const password = new Password(pass)
  const account = SimpleWallet.create(name, password)
  console.log(account)
  return account
}

// 秘密鍵からウォレット作成.
exports.createWalletWithPrivateKey = (name, pass, privateKey) => {
  const password = new Password(pass)
  const account = SimpleWallet.createWithPrivateKey(name, password, privateKey)
  console.log(account)
  return account
}

// XEM送信の手数料を取得.
exports.getFeeTransferXem = (senderAddr, amount, message) => {
  let address = new Address(senderAddr)
  let xem = new XEM(amount)
  let tx = TransferTransaction.create(
    TimeWindow.createWithDeadline(),
    address,
    xem,
    PlainMessage.create(message)
  )
  let result = tx.fee / NEM_UNIT
  console.log('xemFee', result)
  return result
}

// モザイク送信の手数料を取得.
exports.getFeeTransferMosaics = (senderAddr, mosaicData, message) => {
  let promise = new Promise((resolve, reject) => {
    console.log(mosaicData)
    let address = new Address(senderAddr)
    let dataList = []
    let isXEM = false
    let xemQuantity
    mosaicData.forEach((element) => {
      let data = {}
      if ((element.namespaceId === 'nem') && (element.name === 'xem')) {
        isXEM = true
        xemQuantity = element.quantity
      } else {
        data.mosaic = new MosaicId(element.namespaceId, element.name)
        data.quantity = element.quantity
        dataList.push(data)
      }
    })
    // 送金
    if ((dataList.length === 0) && (isXEM)) {
      // XEMのみの場合.
      let transaction = TransferTransaction.create(
        TimeWindow.createWithDeadline(),
        address,
        new XEM(xemQuantity),
        PlainMessage.create(message)
      )
      resolve(transaction.fee / NEM_UNIT)
    } else {
      // それ以外.
      Observable.from(dataList)
        .flatMap(mosaicWithAmount => mosaicHttp.getMosaicTransferableWithAmount(
          mosaicWithAmount.mosaic,
          mosaicWithAmount.quantity
        ))
        .toArray()
        .map(mosaics => {
          if (isXEM) { mosaics.unshift(new XEM(xemQuantity)) }
          return mosaics
        })
        .map(mosaics => TransferTransaction.createWithMosaics(
          TimeWindow.createWithDeadline(),
          address,
          mosaics,
          PlainMessage.create(message)
        ))
        .subscribe(
          transaction => {
            let result = transaction.fee / NEM_UNIT
            console.log('mosaicsFee', result)
            resolve(result)
          },
          error => { reject(error) }
        )
    }
  })
  return promise
}

// 送金(nem)
exports.transferTransaction = (senderAddr, amount, message, privateKey) => {
  let promise = new Promise((resolve, reject) => {
    let account = Account.createWithPrivateKey(privateKey)
    let address = new Address(senderAddr)
    let xem = new XEM(amount)
    let tx = TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      address,
      xem,
      PlainMessage.create(message)
    )
    let signedTransaction = account.signTransaction(tx)
    transactionHttp.announceTransaction(signedTransaction).subscribe(
      result => { resolve(result) },
      error => { reject(error) }
    )
  })
  return promise
}

// 送金(モザイク)
exports.transferTransactionMosaics = (senderAddr, mosaicData, message, privateKey) => {
  let promise = new Promise((resolve, reject) => {
    let account = Account.createWithPrivateKey(privateKey)
    let address = new Address(senderAddr)
    let dataList = []
    let isXEM = false
    let xemQuantity
    mosaicData.forEach((element) => {
      let data = {}
      if ((element.namespaceId === 'nem') && (element.name === 'xem')) {
        isXEM = true
        xemQuantity = element.quantity
      } else {
        data.mosaic = new MosaicId(element.namespaceId, element.name)
        data.quantity = element.quantity
        dataList.push(data)
      }
    })

    // 送金
    if ((dataList.length === 0) && (isXEM)) {
      // XEMのみの場合.
      let mosaics = []
      mosaics.push(new XEM(xemQuantity))
      let transaction = TransferTransaction.createWithMosaics(
        TimeWindow.createWithDeadline(),
        address,
        mosaics,
        PlainMessage.create(message)
      )
      let signedTransaction = account.signTransaction(transaction)
      transactionHttp.announceTransaction(signedTransaction).subscribe(
        result => { resolve(result) },
        error => { reject(error) }
      )
    } else {
      // 送金
      Observable.from(dataList)
        .flatMap(mosaicWithAmount => mosaicHttp.getMosaicTransferableWithAmount(
          mosaicWithAmount.mosaic,
          mosaicWithAmount.quantity
        ))
        .toArray()
        .map(mosaics => {
          if (isXEM) { mosaics.unshift(new XEM(xemQuantity)) }
          return mosaics
        })
        .map(mosaics => TransferTransaction.createWithMosaics(
          TimeWindow.createWithDeadline(),
          address,
          mosaics,
          PlainMessage.create(message)
        ))
        .map(transaction => account.signTransaction(transaction))
        .flatMap(signedTransaction => transactionHttp.announceTransaction(signedTransaction))
        .subscribe(
          nemAnnounceResult => { resolve(nemAnnounceResult) },
          error => { reject(error) }
        )
    }
  })
  return promise
}

// NEMのQRコード用のJSONデータを取得.
exports.getJSONInvoiceForQRcode = (v, type, nameVal, addr, amountVal, msgVal) => {
  // v:2, type:1 アカウント, type:2 請求書
  let amount = amountVal * Math.pow(10, 6)
  let json = {
    type: type,
    data: {
      name: nameVal,
      addr: addr,
      amount: amount,
      msg: msgVal
    },
    v: v
  }
  let jsonString = JSON.stringify(json)
  let result = encoding.codeToString(encoding.convert(getStr2Array(jsonString), 'UTF8'))
  return result
}

// JPYのQRコード用のJSONデータを取得.
exports.getJSONInvoiceForQRcodeJPY = (v, type, name, addr, amountJpy, msg) => {
  // v:2, type:1 アカウント, type:2 請求書
  let json = {
    type: type,
    data: {
      name: name,
      addr: addr,
      amount: 0,
      msg: msg,
      office_nem: {
        type: 'JPY',
        amount: amountJpy
      }
    },
    v: v
  }
  let jsonString = JSON.stringify(json)
  let result = encoding.codeToString(encoding.convert(getStr2Array(jsonString), 'UTF8'))
  return result
}

// QRコード用のJSONデータを取得.
exports.getJsonQRcode = (qrText) => {
  console.log(qrText)
  let qrJson = JSON.parse(qrText)
  console.log(qrJson)
  return qrJson
}

// 時価総額を取得.
exports.getTotalAmountJpyXem = (amount, jpyXem, precision) => {
  let total = Number(amount) * Number(jpyXem)
  let factor = Math.pow(10, precision)
  return Math.round(total * factor) / factor
}

// 日本円からXEMを取得.
exports.getTotalAmountXemJpy = (jpy, jpyXem, precision) => {
  let total = Number(jpy) / Number(jpyXem)
  let factor = Math.pow(10, precision)
  return Math.round(total * factor) / factor
}

/* use NEM-sdk */
const MOSAIC_NAMESPACE = 'mikun'
const MOSAIC_NAME = 'thanks'
const MOSAIC_DIVISIBILITY = 0
const divisibility = () => {
  return Math.pow(10, MOSAIC_DIVISIBILITY)
}

exports.getMosaicBalance = (address) => {
  return new Promise((resolve, reject) => {
    getOwnMosaicBalance(address)
      .then((res) => {
        let balance = 0
        res.some((obj) => {
          if ((obj.namespace === MOSAIC_NAMESPACE) &&
              (obj.name === MOSAIC_NAME)) {
            balance = obj.amount
            return true
          }
        })
        resolve(balance)
      }).catch((e) => {
        console.error('getMosaicBalance', e)
        reject(e)
      })
  })
}

const getOwnMosaicBalance = (address) => {
  return new Promise((resolve, reject) => {
    const NODE = { node: 'https://aqualife1.supernode.me', port: '7891' }
    let endpoint = nem.model.objects.create('endpoint')(NODE.node, NODE.port)
    let methods = [
      nem.com.requests.account.mosaics.owned(endpoint, address),
      nem.com.requests.account.mosaics.allDefinitions(endpoint, address)
    ]
    Promise.all(methods)
      .then((res) => {
        console.log(res)
        let dataList = []
        let ownList = res[0].data
        let defineList = res[1].data
        ownList.forEach((ownObj) => {
          defineList.forEach((defineObj) => {
            if ((ownObj.mosaicId.namespaceId === defineObj.id.namespaceId) &&
                (ownObj.mosaicId.name === defineObj.id.name)) {
              let divisibility = 0
              defineObj.properties.some((prop) => {
                if (prop.name === 'divisibility') {
                  divisibility = prop.value
                  return true
                }
              })
              let amount = ownObj.quantity / Math.pow(10, divisibility)
              let data = {
                namespace: ownObj.mosaicId.namespaceId,
                name: ownObj.mosaicId.name,
                amount: amount
              }
              dataList.push(data)
            }
          })
        })
        resolve(dataList)
      }).catch((e) => {
        console.error('getOwnMosaicBalance', e)
        reject(e)
      })
  })
}
exports.getOwnMosaicBalance = getOwnMosaicBalance

exports.getTransactionHistoryEndpoint = (address) => {
  return new Promise((resolve, reject) => {
    const NODE = { node: 'https://aqualife1.supernode.me', port: '7891' }
    let endpoint = nem.model.objects.create('endpoint')(NODE.node, NODE.port)
    getMosaicHistory(endpoint, address)
      .then((res) => resolve(res)).catch((e) => reject(e))
  })
}

const getMosaicHistory = (endpoint, address) => {
  return new Promise((resolve, reject) => {
    nem.com.requests.account.transactions.all(endpoint, address)
      .then((res) => {
        let txs = getMosaicTxData(res.data, address)
        console.log('txs', txs.data, txs.lastHash)
        if (txs.lastHash) {
          getAllMosaicHistoryData(endpoint, txs.lastHash, address).then((txs) => {
            resolve(txs.data)
          }).catch((e) => {
            reject(e)
          })
        } else {
          resolve(txs.data)
        }
        // resolve(txs)
        /*
          address: "NCVQMBRARF32HRPLVWA5D7P4ZST7FEDQVPAZL6CE"
          amount: 1
          from: "NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC"
          hash: "91c66a4d09346ab7ff41fdf6cd536b7c5480cdef537d1374f1e09d27bde8ce38"
          message: "test"
          mosaic:
            amount: 100
            name: "thanks"
            namespace: "mikun"
          time: "2018/6/25 14:41:16"
          to: "NCVQMBRARF32HRPLVWA5D7P4ZST7FEDQVPAZL6CE"
          type: "out"
        */
      }).catch((e) => {
        console.error('getTransactionHistory', e)
        reject(e)
      })
  })
}

const getMosaicTxData = (history, address) => {
  let txs = {
    data: [],
    lastHash: ''
  }
  history.forEach((obj) => {
    let tx = obj
    let data = getTxData(tx, address)
    txs.lastHash = data.hash
    data.mosaic = undefined
    if ('mosaics' in obj.transaction) {
      obj.transaction.mosaics.some((mosaic) => {
        if ((mosaic.mosaicId.namespaceId === MOSAIC_NAMESPACE) &&
            (mosaic.mosaicId.name === MOSAIC_NAME)) {
          data.mosaic = {
            namespace: mosaic.mosaicId.namespaceId,
            name: mosaic.mosaicId.name,
            amount: mosaic.quantity / divisibility()
          }
          return true
        }
      })
    } else {
      console.log('This is NEM')
    }
    txs.data.push(data)
  })
  return txs
}

/*
exports.getTransactionHistory = (address) => {
  return new Promise((resolve, reject) => {
    const NODE = { node: 'https://aqualife1.supernode.me', port: '7891' }
    let endpoint = nem.model.objects.create('endpoint')(NODE.node, NODE.port)
    nem.com.requests.account.transactions.all(endpoint, address)
      .then((res) => {
        var mosaics = []
        res.data.forEach((obj) => {
          console.log('obj', obj)
          if ('mosaics' in obj.transaction) {
            obj.transaction.mosaics.forEach((mosaic) => {
              var data = {
                namespace: mosaic.mosaicId.namespaceId,
                name: mosaic.mosaicId.name,
                amount: mosaic.quantity
              }
              mosaics.push(data)
            })
          } else {
            console.log('This is NEM', obj)
          }
        })
        getMosaicDefinitionMetaDataPair(mosaics)
          .then((mosaicDefinitionMetaDataPair) => {
            mosaics = mosaics.filter((mosaic) => {
              let fullMosaicName = mosaic.namespace + ':' + mosaic.name
              if ((mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition.id.namespaceId === mosaic.namespace) &&
                  (mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition.id.name === mosaic.name)) {
                let divisibility = 0
                mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition.properties.forEach((prop) => {
                  if (prop.name === 'divisibility') { divisibility = prop.value }
                })
                mosaic.amount = mosaic.amount / Math.pow(10, divisibility)
                console.log('[divisibility quantity]', divisibility, mosaic.amount)
              }
              return mosaic
            })
            let txs = []
            res.data.forEach((obj) => {
              let tx = obj
              let data = getTxData(tx, address)
              let mosaic = {
                namespace: MOSAIC_NAMESPACE,
                name: MOSAIC_NAME,
                amount: 0
              }
              data.mosaics = []
              data.mosaics.push(mosaic)
              txs.push(data)
            })
            console.log('txs', txs)
            resolve(mosaics)
          }).catch((e) => {
            console.error('getTransactionHistory', e)
            reject(e)
          })
        if (lastHash) {
          getAllHistoryData(endpoint, txs, lastHash, address).then((txs) => {
            resolve(txs)
          })
        } else {
          resolve(txs)
        }
      }).catch((e) => {
        console.error('getTransactionHistory', e)
        reject(e)
      })
  })
}
*/

const getAllMosaicHistoryData = (endpoint, hash, address) => {
  return new Promise((resolve, reject) => {
    nem.com.requests.account.transactions.all(endpoint, address, hash).then((res) => {
      let txs = getMosaicTxData(res.data, address)
      console.log('txs', txs.data, txs.lastHash)
      if (txs.lastHash) {
        getAllMosaicHistoryData(endpoint, txs.lastHash, address).then((txs) => {
          resolve(txs.data)
        })
      } else {
        resolve(txs.data)
      }
    }).catch((e) => {
      console.dir(e)
      reject(e)
    })
  })
}

const getTxData = (tx, myAddress) => {
  var date = ''
  var amount = 0
  var message = ''
  if (tx.transaction.otherTrans) {
    date = nemDateFormat(tx.transaction.otherTrans.timeStamp)
    amount = tx.transaction.otherTrans.amount
    message = nem.utils.format.hexMessage(tx.transaction.otherTrans.message)
  } else {
    date = nemDateFormat(tx.transaction.timeStamp)
    amount = tx.transaction.amount
    message = nem.utils.format.hexMessage(tx.transaction.message)
  }
  if (amount) {
    amount = amount / Math.pow(10, 6)
  }
  var from = nem.utils.format.pubToAddress(tx.transaction.signer, nem.model.network.data.mainnet.id)
  var to = tx.transaction.recipient
  var type = ''
  var address = ''
  if (to === myAddress) {
    type = 'in'
    address = from
  } else {
    type = 'out'
    address = to
  }
  var data = {
    type: type,
    time: date,
    amount: amount,
    message: message,
    hash: tx.meta.hash.data,
    from: from,
    to: to,
    address: address
  }
  return data
}

const TIMEZONEOFFSET = -9
const nemDateFormat = (timestamp) => {
  let dt = new Date(nem.utils.format.nemDate(timestamp))
  let dtJs = new Date(dt.getTime() - (TIMEZONEOFFSET * 60 - dt.getTimezoneOffset()) * 60000)
  return dtJs.toLocaleString()
}

exports.createNamespace = (name, description, privateKey, properties) => {
  let promise = new Promise((resolve, reject) => {
    const NODE = { node: 'https://aqualife1.supernode.me', port: '7891' }
    let endpoint = nem.model.objects.create('endpoint')(NODE.node, NODE.port)
    let common = nem.model.objects.create('common')('', privateKey)
    let tx = nem.model.objects.get('namespaceProvisionTransaction')
    tx.namespaceName = name
    tx.mosaicDescription = description
    tx.properties = properties
    let net = nem.model.network.data.mainnet.id
    let transactionEntity = nem.model.transactions.prepare('namespaceProvisionTransaction')(common, tx, net)
    nem.model.transactions.send(common, transactionEntity, endpoint)
      .then((result) => {
        console.log(result)
        resolve(result)
      }).catch((error) => {
        console.error(error)
        reject(error)
      })
  })
  return promise
}

exports.createMosaic = (namespace, name, description, privateKey, properties) => {
  let promise = new Promise((resolve, reject) => {
    const NODE = { node: 'https://aqualife1.supernode.me', port: '7891' }
    let endpoint = nem.model.objects.create('endpoint')(NODE.node, NODE.port)
    let common = nem.model.objects.create('common')('', privateKey)
    let tx = nem.model.objects.get('mosaicDefinitionTransaction')
    tx.mosaicName = name
    tx.namespaceParent = {
      'fqn': namespace
    }
    tx.mosaicDescription = description
    tx.properties = properties
    let net = nem.model.network.data.mainnet.id
    let transactionEntity = nem.model.transactions.prepare('mosaicDefinitionTransaction')(common, tx, net)
    nem.model.transactions.send(common, transactionEntity, endpoint)
      .then((result) => {
        console.log(result)
        resolve(result)
      }).catch((error) => {
        console.error(error)
        reject(error)
      })
  })
  return promise
}

exports.sendMosaic = (mosaics, addr, message, privateKey) => {
  let promise = new Promise((resolve, reject) => {
    console.log('sendMosaicController')
    const NODE = { node: 'https://aqualife1.supernode.me', port: '7891' }
    let endpoint = nem.model.objects.create('endpoint')(NODE.node, NODE.port)
    let common = nem.model.objects.create('common')('', privateKey)
    let transferTransaction = nem.model.objects.create('transferTransaction')(addr, 1, message)
    getMosaicDefinitionMetaDataPair(mosaics)
      .then((mosaicDefinitionMetaDataPair) => {
        console.log('mosaicDefinitionMetaDataPair', mosaicDefinitionMetaDataPair)
        // モザイクの情報を設定しtransactionを作成
        mosaics.forEach((mosaic) => {
          let fullMosaicName = mosaic.namespace + ':' + mosaic.name
          if ((mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition.id.namespaceId === mosaic.namespace) &&
              (mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition.id.name === mosaic.name)) {
            let divisibility = 0
            mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition.properties.forEach((prop) => {
              if (prop.name === 'divisibility') { divisibility = prop.value }
            })
            let quantity = mosaic.amount * Math.pow(10, divisibility)
            console.log('[divisibility quantity]', divisibility, quantity)
            let mosaicAttachment = nem.model.objects.create('mosaicAttachment')(mosaic.namespace, mosaic.name, quantity)
            transferTransaction.mosaics.push(mosaicAttachment)
          }
        })
        console.log('transferTransaction', transferTransaction)
        // 送信
        let NET = nem.model.network.data.mainnet.id
        let transactionEntity = nem.model.transactions.prepare('mosaicTransferTransaction')(common, transferTransaction, mosaicDefinitionMetaDataPair, NET)
        console.log('transactionEntity', transactionEntity)
        nem.model.transactions.send(common, transactionEntity, endpoint)
          .then((result) => {
            resolve(result)
          }).catch((error) => {
            reject(error)
          })
      }).catch((error) => {
        console.error(error)
      })
  })
  return promise
}

/* モザイクの定義を取得(複数) */
const getMosaicDefinitionMetaDataPair = (mosaics) => {
  console.log('getMosaicDefinitionMetaDataPair')
  let promise = new Promise((resolve, reject) => {
    const NODE = { node: 'https://aqualife1.supernode.me', port: '7891' }
    let endpoint = nem.model.objects.create('endpoint')(NODE.node, NODE.port)
    let mosaicDefinitionMetaDataPair = nem.model.objects.get('mosaicDefinitionMetaDataPair')
    let mosaicCount = 0
    mosaics.forEach((mosaic) => {
      let mosaicAttachment = nem.model.objects.create('mosaicAttachment')(mosaic.namespace, mosaic.name, mosaic.amount)
      nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment.mosaicId.namespaceId)
        .then((result) => {
          mosaicCount = mosaicCount + 1
          console.log('mosaicDefinitions', result, mosaicCount)
          // リクエスト応答からモザイクのメタデータを検索
          let neededDefinition = nem.utils.helpers.searchMosaicDefinitionArray(result.data, [mosaic.name])
          let fullMosaicName = nem.utils.format.mosaicIdToName(mosaicAttachment.mosaicId)
          if (undefined === neededDefinition[fullMosaicName]) {
            console.error('Mosaic not found !', fullMosaicName)
            return
          }
          // モザイクのメタデータをmosaicDefinitionMetaDataPairに設定
          mosaicDefinitionMetaDataPair[fullMosaicName] = {}
          mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName]
          // supplyを設定しないと送金時のfeeがNULLになるため設定
          let supply = 0
          result.data.some((obj) => {
            if ((obj.mosaic.id.namespaceId === mosaic.namespace) &&
                (obj.mosaic.id.name === mosaic.name)) {
              obj.mosaic.properties.some((prop) => {
                if (prop.name === 'initialSupply') {
                  supply = prop.value
                  return true
                }
              })
            }
          })
          mosaicDefinitionMetaDataPair[fullMosaicName].supply = supply
          if (mosaicCount >= mosaics.length) { resolve(mosaicDefinitionMetaDataPair) }
        }).catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  })
  return promise
}
exports.getMosaicDefinitionMetaDataPair = getMosaicDefinitionMetaDataPair
