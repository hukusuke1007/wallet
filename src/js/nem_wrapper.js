import {Account, AccountHttp, NEMLibrary, NetworkTypes, Address, SimpleWallet, Password, EncryptedPrivateKey, TimeWindow, Message, PlainMessage, XEM, TransactionHttp, TransferTransaction} from 'nem-library'
NEMLibrary.bootstrap(NetworkTypes.MAIN_NET)

const PASSWORD = 'password'
const PUBLICK_KEY = 'publicKey'
const PRIVATE_KEY = 'privateKey'
const NEM_UNIT = 1000000

exports.PUBLICK_KEY = PUBLICK_KEY
exports.PRIVATE_KEY = PRIVATE_KEY
exports.NEM_UNIT = NEM_UNIT

// Using custom NIS Node
const accountHttp = new AccountHttp([
  {protocol: 'https', domain: 'strategic-trader-1.supernode.me', port: 7891},
  {protocol: 'https', domain: 'strategic-trader-2.supernode.me', port: 7891},
  // {protocol: 'https', domain: 'thomas1.supernode.me.supernode.me', port: 7891}, 死んだ？
  {protocol: 'https', domain: 'shibuya.supernode.me', port: 7891},
  {protocol: 'https', domain: 'qora01.supernode.me', port: 7891},
  {protocol: 'https', domain: 'pegatennnag.supernode.me', port: 7891}
])
// const accountHttp = new AccountHttp()

// アカウント取得.
exports.getAccount = (addr) => {
  let promise = new Promise((resolve, reject) => {
    console.log(addr)
    const address = new Address(addr)
    accountHttp.getFromAddress(address).subscribe(accountInfoWithMetaData => {
      // console.log(accountInfoWithMetaData)
      resolve(accountInfoWithMetaData)
    })
  })
  return promise
}

// トランザクション履歴を取得
exports.getTransaction = (addr, pageSize, hash, id) => {
  let promise = new Promise((resolve, reject) => {
    console.log(addr)
    const address = new Address(addr)
    let params = { pageSize: pageSize, hash: hash, id: id }
    accountHttp.allTransactions(address, params).subscribe(transaction => {
      // console.log(transaction)
      resolve(transaction)
    })
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
    let transactionHttp = new TransactionHttp()
    transactionHttp.announceTransaction(signedTransaction).subscribe(result => {
      console.log(result)
      resolve(result)
    })
  })
  return promise
}

// QRコード用のJSONデータを取得.
exports.getJSONInvoiceForQRcode = (v, type, name, addr, amount, msg) => {
  let json = {
    v: v,
    type: type,
    data: {
      name: name,
      addr: addr,
      amount: amount,
      msg: msg
    }
  }
  return json
}
