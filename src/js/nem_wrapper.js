import {AccountHttp, NEMLibrary, NetworkTypes, Address} from 'nem-library'

const MAX_DEFINE = 100

exports.getAccount = (addr) => {
  console.log('getAccount' + addr)
  console.log('getAccount' + MAX_DEFINE)

  NEMLibrary.bootstrap(NetworkTypes.MAIN_NET)
  const address = new Address('NBHWRG6STRXL2FGLEEB2UOUCBAQ27OSGDTO44UFC')
  const accountHttp = new AccountHttp()
  accountHttp.getFromAddress(address).subscribe(accountInfoWithMetaData => {
    console.log(accountInfoWithMetaData)
  })
}
