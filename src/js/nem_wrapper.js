import nemSDK from 'nem-sdk'
const MAX_DEFINE = 100

exports.getAccount = (addr) => {
  console.log('getAccount' + addr)
  console.log('getAccount' + MAX_DEFINE)
  var endpoint = nemSDK.model.objects.create('endpoint')('https://aqualife1.supernode.me', 7891)
  console.log(endpoint)
}
