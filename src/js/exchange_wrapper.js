import axios from 'axios'

const axiosZaif = axios.create({
  baseURL: 'https://api.zaif.jp/api/1/last_price',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
    'Access-Control-Max-Age': '3600',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'ContentType': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
})

// レートを取得.
exports.getRateJpyXem = () => {
  let promise = new Promise((resolve, reject) => {
    axiosZaif.get('/xem_jpy').then((responce) => {
      resolve(responce)
    }).catch((err) => {
      reject(err)
    })
  })
  return promise
}
