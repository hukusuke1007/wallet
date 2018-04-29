import axios from 'axios'

// レートを取得.
exports.getRateJpyXem = () => {
  let promise = new Promise((resolve, reject) => {
    let poloUrl = 'https://poloniex.com/public?command=returnTicker'
    let blchainUrl = 'https://blockchain.info/ticker?cors=true'
    let polo = null
    axios.get(poloUrl)
      .then((poloResult) => {
        polo = poloResult
        return axios.get(blchainUrl)
      }).then((blchainResult) => {
        let price = polo.data.BTC_XEM.last * blchainResult.data.JPY.last
        resolve(price)
      }).catch((err) => {
        reject(err)
      })
  })
  return promise
}
