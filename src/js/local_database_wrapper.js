import localForage from 'localforage'
localForage.setDriver(localForage.LOCALSTORAGE)

const KEY_WALLET_INFO = 'key_wallet_info'
const VALUE_PRIMARY_ID = 'id'
const VALUE_DATA = 'data'
const VALUE_ALL = 'all'
const MESSAGE_SUCCESS = 'success'
const MESSAGE_ERROR = 'error'

// Keyの最大値を取得.
var getKeyMaxNumber = (data, keyName) => {
  let maxNumber = -1
  if (data === null) return maxNumber
  data.forEach((element, index, array) => {
    let id = element[keyName]
    if (maxNumber < id) maxNumber = id
  })
  return maxNumber
}

// 該当するKeyのデータを取得.
var getDataFromKey = (data, keyName, keyId) => {
  let result = null
  if (data === null) return result
  data.forEach((element, index, array) => {
    if (keyId === element[keyName]) { return element }
  })
  return result
}

// 該当するKeyを配列から削除した配列を取得.
var getDataRemovedFromKey = (data, keyName, keyId) => {
  let result = null
  if (data === null) return result
  result = data.filter((element) => (keyId !== element[keyName]))
  return result
}

// 保存
exports.setItem = (key, data) => {
  var promise = new Promise((resolve, reject) => {
    // ウォレット情報
    if (key === KEY_WALLET_INFO) {
      localForage.getItem(key)
        .then((result) => {
          console.log('got value:', result)
          let storeList = []
          if (result) { storeList = result }
          let id = getKeyMaxNumber(result, VALUE_PRIMARY_ID) + 1
          let storeData = {}
          storeData[VALUE_PRIMARY_ID] = id
          storeData[VALUE_DATA] = data
          storeList.push(storeData)
          localForage.setItem(key, storeList)
            .then((result) => {
              console.log('result', result)
              resolve(MESSAGE_SUCCESS)
            }).catch((err) => {
              console.log('err:' + err)
              reject(err)
            })
        }).catch((err) => {
          console.log('err:' + err)
          reject(err)
        })
    } else {
      localForage.setItem(key, data)
        .then((result) => {
          console.log('result', result)
          resolve(MESSAGE_SUCCESS)
        }).catch((err) => {
          console.log('err' + err)
          reject(err)
        })
    }
  })
  return promise
}

// 取得
exports.getItem = (key, id) => {
  var promise = new Promise((resolve, reject) => {
    // ウォレット情報
    if (key === KEY_WALLET_INFO) {
      localForage.getItem(key)
        .then((result) => {
          console.log('result:', result)
          if (id === VALUE_ALL) {
            resolve(result)
          } else {
            resolve(getDataFromKey(result, VALUE_PRIMARY_ID, id))
          }
        }).catch((err) => {
          console.log('err:' + err)
          reject(err)
        })
    } else {
      localForage.getItem(key)
        .then((result) => {
          console.log('result:', result)
          resolve(result)
        }).catch((err) => {
          console.log('err:' + err)
          reject(err)
        })
    }
  })
  return promise
}

// 削除
exports.removeItem = (key, id) => {
  var promise = new Promise((resolve, reject) => {
    // ウォレット情報
    if (key === KEY_WALLET_INFO) {
      localForage.getItem(key)
        .then((result) => {
          console.log('result:', result)
          if (result) {
            // 該当する要素を除いた配列データを再度保存する.
            let reStoreData = getDataRemovedFromKey(result, VALUE_PRIMARY_ID, id)
            localForage.setItem(key, reStoreData)
              .then((result) => {
                console.log('result', result)
                resolve(MESSAGE_SUCCESS)
              }).catch((err) => {
                console.log('err:' + err)
                reject(err)
              })
          } else {
            resolve(MESSAGE_ERROR)
          }
        }).catch((err) => {
          console.log('err:' + err)
          reject(err)
        })
    } else {
      localForage.removeItem(key)
        .then((result) => {
          console.log('result:', result)
          resolve(MESSAGE_SUCCESS)
        }).catch((err) => {
          console.log('err:' + err)
          reject(err)
        })
    }
  })
  return promise
}
