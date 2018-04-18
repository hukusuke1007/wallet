import {AccountHttp, NEMLibrary, NetworkTypes, Address, SimpleWallet, Password} from 'nem-library'
NEMLibrary.bootstrap(NetworkTypes.MAIN_NET)

const PASSWORD = 'password'

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

// 秘密鍵を取得.
exports.getPrivateKey = (account) => {
  const password = new Password(PASSWORD)
  const wallet = account.open(password)
  console.log(wallet)
  // const address = wallet['address']['value']
  // const publicKey = wallet['publicKey']
  const privateKey = wallet['privateKey']
  return privateKey
}

// accountを保存する方が良い
exports.createWallet = (name) => {
  const password = new Password(PASSWORD)
  const account = SimpleWallet.create(name, password)
  console.log(account)
  return account
}

exports.createWalletWithPrivateKey = (name, privateKey) => {
  const password = new Password(PASSWORD)
  const account = SimpleWallet.createWithPrivateKey(name, password, privateKey)
  console.log(account)
  const wallet = account.open(password)
  console.log(wallet)

  const address = wallet['address']['value']
  const publicKey = wallet['publicKey']
  console.log(address)
  console.log(publicKey)
  console.log(privateKey)
}
