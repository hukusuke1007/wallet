import {AccountHttp, NEMLibrary, NetworkTypes, Address, SimpleWallet, Password, EncryptedPrivateKey} from 'nem-library'
NEMLibrary.bootstrap(NetworkTypes.MAIN_NET)

const PASSWORD = 'password'
const PUBLICK_KEY = 'publicKey'
const PRIVATE_KEY = 'privateKey'

exports.PUBLICK_KEY = PUBLICK_KEY
exports.PRIVATE_KEY = PRIVATE_KEY

// Using custom NIS Node
const accountHttp = new AccountHttp([
  {protocol: 'https', domain: 'strategic-trader-1.supernode.me', port: 7891},
  {protocol: 'https', domain: 'strategic-trader-2.supernode.me', port: 7891},
  {protocol: 'https', domain: 'thomas1.supernode.me.supernode.me', port: 7891},
  {protocol: 'https', domain: 'shibuya.supernode.me', port: 7891},
  {protocol: 'https', domain: 'qora01.supernode.me', port: 7891},
  {protocol: 'https', domain: 'pegatennnag.supernode.me', port: 7891}
])
// const accountHttp = new AccountHttp()

exports.getAccount = (addr) => {
  let promise = new Promise((resolve, reject) => {
    const address = new Address(addr)
    accountHttp.getFromAddress(address).subscribe(accountInfoWithMetaData => {
      console.log(accountInfoWithMetaData)
      resolve(accountInfoWithMetaData)
    })
  })
  return promise
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
  console.log(pairKey)
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
