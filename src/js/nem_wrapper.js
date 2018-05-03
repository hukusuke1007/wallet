import {UnconfirmedTransactionListener, ConfirmedTransactionListener,
  Account, AccountHttp, MosaicHttp, NEMLibrary, NetworkTypes, Address,
  SimpleWallet, Password, EncryptedPrivateKey, TimeWindow, Message, PlainMessage, XEM,
  TransactionHttp, TransferTransaction, AccountOwnedMosaicsService, MosaicId} from 'nem-library'
import {Observable} from 'rxjs/Observable'
import encoding from 'encoding-japanese'

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET)

const PASSWORD = 'password'
const PUBLICK_KEY = 'publicKey'
const PRIVATE_KEY = 'privateKey'
const NEM_UNIT = 1000000

exports.PUBLICK_KEY = PUBLICK_KEY
exports.PRIVATE_KEY = PRIVATE_KEY
exports.NEM_UNIT = NEM_UNIT

const nodes = [
  {protocol: 'https', domain: 'aqualife2.supernode.me', port: 7891},
  {protocol: 'https', domain: 'aqualife3.supernode.me', port: 7891},
  // {protocol: 'https', domain: 'beny.supernode.me', port: 7891},
  {protocol: 'https', domain: 'happy.supernode.me', port: 7891},
  {protocol: 'https', domain: 'mnbhsgwbeta.supernode.me', port: 7891},
  {protocol: 'https', domain: 'nemstrunk.supernode.me', port: 7891},
  {protocol: 'https', domain: 'nemstrunk2.supernode.me', port: 7891},
  {protocol: 'https', domain: 'nsm.supernode.me', port: 7891},
  {protocol: 'https', domain: 'kohkei.supernode.me', port: 7891},
  {protocol: 'https', domain: 'mttsukuba.supernode.me', port: 7891},
  {protocol: 'https', domain: 'strategic-trader-1.supernode.me', port: 7891},
  {protocol: 'https', domain: 'strategic-trader-2.supernode.me', port: 7891},
  {protocol: 'https', domain: 'shibuya.supernode.me', port: 7891},
  {protocol: 'https', domain: 'qora01.supernode.me', port: 7891},
  {protocol: 'https', domain: 'pegatennnag.supernode.me', port: 7891}
]
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

// 未承認トランザクション取得.
exports.getUncofirmedTransactionListener = (addr) => {
  let promise = new Promise((resolve, reject) => {
    console.log(addr)
    const address = new Address(addr)
    const listener = new UnconfirmedTransactionListener(nodes).given(address)
    listener.subscribe(
      x => { resolve(x) },
      error => { reject(error) }
    )
  })
  return promise
}

// 承認トランザクション取得.
exports.getCofirmedTransactionListener = (addr) => {
  let promise = new Promise((resolve, reject) => {
    console.log(addr)
    const address = new Address(addr)
    const listener = new ConfirmedTransactionListener(nodes).given(address)
    listener.subscribe(
      x => { resolve(x) },
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
exports.getPairKey = (account) => {
  const address = new Address(account.address.value)
  const encryptedPrivateKey = new EncryptedPrivateKey(account.encryptedPrivateKey.encryptedKey, account.encryptedPrivateKey.iv)
  const simpleWallet = new SimpleWallet(account.name, account.network, address, account.creationDate, encryptedPrivateKey)

  const password = new Password(PASSWORD)
  const wallet = simpleWallet.open(password)
  // console.log(wallet)
  let pairKey = {}
  pairKey[PUBLICK_KEY] = wallet[PUBLICK_KEY]
  pairKey[PRIVATE_KEY] = wallet[PRIVATE_KEY]
  // console.log(pairKey)
  return pairKey
}

// ウォレット作成.
exports.createWallet = (name) => {
  const password = new Password(PASSWORD)
  const account = SimpleWallet.create(name, password)
  console.log(account)
  return account
}

// 秘密鍵からウォレット作成.
exports.createWalletWithPrivateKey = (name, privateKey) => {
  const password = new Password(PASSWORD)
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
  return tx.fee / NEM_UNIT
}

// モザイク送信の手数料を取得.
exports.getFeeTransferMosaics = (senderAddr, mosaicData, message) => {
  let promise = new Promise((resolve, reject) => {
    console.log(mosaicData)
    let address = new Address(senderAddr)
    // json作成
    let dataList = []
    let isXEM = false
    let xemQuantity
    mosaicData.forEach((element) => {
      let data = {}
      if ((element.namespace === 'nem') && (element.mosaic === 'xem')) {
        isXEM = true
        xemQuantity = element.quantity
      } else {
        data.mosaic = new MosaicId(element.namespace, element.mosaic)
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
          transaction => { resolve(transaction.fee / NEM_UNIT) },
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
    console.log(mosaicData)
    // let mosaicHttp = new MosaicHttp()
    let account = Account.createWithPrivateKey(privateKey)
    let address = new Address(senderAddr)

    // json作成
    let dataList = []
    let isXEM = false
    let xemQuantity
    mosaicData.forEach((element) => {
      let data = {}
      if ((element.namespace === 'nem') && (element.mosaic === 'xem')) {
        isXEM = true
        xemQuantity = element.quantity
      } else {
        data.mosaic = new MosaicId(element.namespace, element.mosaic)
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
