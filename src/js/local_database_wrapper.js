import localForage from 'localforage'
localForage.setDriver(localForage.INDEXEDDB)

// データーベースのkey.
const KEY_WALLET_INFO = 'key_wallet_info'
const KEY_INVOICE = 'key_invoice'

// 値のkey.
const VALUE_PRIMARY_ID = 'id'
const VALUE_ALL = 'all'
const VALUE_NAME = 'name'
const VALUE_DESCRIPTION = 'description'
const VALUE_WALLET_ACCOUNT = 'account'
const VALUE_CRYPTO_KIND = 'cryptoKind'
const VALUE_ADDRESS = 'address'
const VALUE_CREATION_DATE = 'creationDate'

// メッセージ.
const MESSAGE_SUCCESS = 'success'
const MESSAGE_ERROR = 'error'

// 外部公開.
exports.KEY_WALLET_INFO = KEY_WALLET_INFO
exports.KEY_INVOICE = KEY_INVOICE
exports.VALUE_PRIMARY_ID = VALUE_PRIMARY_ID
exports.VALUE_ALL = VALUE_ALL
exports.VALUE_NAME = VALUE_NAME
exports.VALUE_DESCRIPTION = VALUE_DESCRIPTION
exports.VALUE_WALLET_ACCOUNT = VALUE_WALLET_ACCOUNT
exports.VALUE_CRYPTO_KIND = VALUE_CRYPTO_KIND
exports.VALUE_ADDRESS = VALUE_ADDRESS
exports.VALUE_CREATION_DATE = VALUE_CREATION_DATE

// KeyNameの最大値を取得.
var getKeyMaxNumber = (dataList, keyName) => {
  let maxNumber = -1
  if (dataList === null) return maxNumber
  dataList.forEach((element, index, array) => {
    let id = element[keyName]
    if (maxNumber < id) maxNumber = id
  })
  return maxNumber
}

// 該当するKeyIDのデータを取得.
var getDataFromKey = (dataList, keyName, keyId) => {
  let result = null
  if (dataList === null) return result
  dataList.forEach((element, index, array) => {
    if (keyId === element[keyName]) { result = element }
  })
  return result
}

// 該当するKeyIDのデータを更新した配列を取得.
var getDataArrayUpdateFromKey = (dataList, updateData, keyName, keyId) => {
  let result = null
  if (dataList === null) return result
  result = dataList.map((element) => {
    if (keyId === element[keyName]) {
      return updateData
    } else {
      return element
    }
  })
  return result
}

// 該当するKeyのデータを削除した配列を取得.
var getDataArrayRemovedFromKey = (dataList, keyName, keyId) => {
  let result = null
  if (dataList === null) return result
  result = dataList.filter((element) => (keyId !== element[keyName]))
  return result
}

// 保存
exports.setItem = (key, data) => {
  let promise = new Promise((resolve, reject) => {
    localForage.setItem(key, data)
      .then((result) => {
        console.log('setItem result', result)
        resolve(MESSAGE_SUCCESS)
      }).catch((err) => {
        console.error('err' + err)
        reject(err)
      })
  })
  return promise
}

// 保存(配列データ)
exports.setItemArray = (key, data, isUpdate, updateId) => {
  let promise = new Promise((resolve, reject) => {
    localForage.getItem(key)
      .then((result) => {
        console.log('setItemArray get result:', result)
        let storeList = []
        if (result) { storeList = result }
        if (isUpdate) {
          storeList = getDataArrayUpdateFromKey(storeList, data, VALUE_PRIMARY_ID, updateId) // 該当する要素を更新した配列を取得.
        } else {
          let id = getKeyMaxNumber(result, VALUE_PRIMARY_ID) + 1
          let storeData = data
          storeData[VALUE_PRIMARY_ID] = id
          storeList.push(storeData)
        }
        localForage.setItem(key, storeList)
          .then((result) => {
            console.log('setItemArray set result', result)
            resolve(MESSAGE_SUCCESS)
          }).catch((err) => {
            console.error('err:' + err)
            reject(err)
          })
      }).catch((err) => {
        console.error('err:' + err)
        reject(err)
      })
  })
  return promise
}

// 取得
exports.getItem = (key) => {
  let promise = new Promise((resolve, reject) => {
    localForage.getItem(key)
      .then((result) => {
        console.log('getItem result:', result)
        resolve(result)
      }).catch((err) => {
        console.error('getItem err:' + err)
        reject(err)
      })
  })
  return promise
}

// 取得(配列データ)
exports.getItemArray = (key, id) => {
  let promise = new Promise((resolve, reject) => {
    localForage.getItem(key)
      .then((result) => {
        // console.log('getItemArray result:', result)
        if (id === VALUE_ALL) {
          resolve(result)
        } else {
          let data = getDataFromKey(result, VALUE_PRIMARY_ID, id)
          resolve(data)
        }
      }).catch((err) => {
        console.error('getItemArray err:' + err)
        reject(err)
      })
  })
  return promise
}

// 削除
exports.removeItem = (key) => {
  let promise = new Promise((resolve, reject) => {
    localForage.removeItem(key)
      .then((result) => {
        console.log('removeItem result:', result)
        resolve(MESSAGE_SUCCESS)
      }).catch((err) => {
        console.error('err:' + err)
        reject(err)
      })
  })
  return promise
}

// 削除(配列データ)
exports.removeItemArray = (key, id) => {
  let promise = new Promise((resolve, reject) => {
    if (id === VALUE_ALL) {
      localForage.removeItem(key)
        .then((result) => {
          console.log('removeItemArray result:', result)
          resolve(MESSAGE_SUCCESS)
        }).catch((err) => {
          console.error('err:' + err)
          reject(err)
        })
    } else {
      localForage.getItem(key)
        .then((result) => {
          console.log('removeItemArray get result:', result)
          if (result) {
            let reStoreData = getDataArrayRemovedFromKey(result, VALUE_PRIMARY_ID, id) // 該当する要素を除いた配列データを再度保存する.
            localForage.setItem(key, reStoreData)
              .then((result) => {
                console.log('removeItemArray set result', result)
                resolve(MESSAGE_SUCCESS)
              }).catch((err) => {
                console.error('err:' + err)
                reject(err)
              })
          } else {
            resolve(MESSAGE_ERROR)
          }
        }).catch((err) => {
          console.error('err:' + err)
          reject(err)
        })
    }
  })
  return promise
}
