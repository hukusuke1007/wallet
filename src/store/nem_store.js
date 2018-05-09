import nemWrapper from '@/js/nem_wrapper'
import nemSDK from 'nem-sdk'

// テスト用にLCNEMを採用
// const MOSAIC_FEST = { namespaceId: 'nems', name: 'festcoin' }

export default {
  namespaced: true,
  state: {
    walletItem: null,
    address: '',
    pairKey: {},
    nemBalance: 0,
    // festBalance: 0,
    mosaics: [],
    transaction: [],
    transactionStatus: 'none',
    // targetMosaicNamespace: MOSAIC_FEST,
    isLoading: false
  },
  getters: {
    walletItem: state => state.walletItem,
    address: state => state.address,
    pairKey: state => state.pairKey,
    nemBalance: state => state.nemBalance,
    mosaics: state => state.mosaics,
    transaction: state => state.transaction,
    transactionStatus: state => state.transactionStatus,
    // targetMosaicNamespace: state => state.targetMosaicNamespace,
    isLoading: state => state.isLoading
  },
  mutations: {
    setWalletItem (state, value) {
      console.log('setWalletItem', value)
      state.walletItem = value
    },
    setAddress (state, value) {
      console.log('setAddress', value)
      state.address = value
    },
    setPairKey (state, value) {
      // console.log('setPairKey', value)
      state.pairKey = value
    },
    setNemBalance (state, value) {
      console.log('setNemBalance', value)
      state.nemBalance = value
    },
    /*
    setFestBalance (state, value) {
      console.log('setFestBalance', value)
      state.festBalance = value
    },
    */
    setMosaics (state, value) {
      console.log('setMosaics', value)
      state.mosaics = value
    },
    setTransactions (state, value) {
      console.log('setTransactions', value)
      state.transaction = value
    },
    setTransactionStatus (state, value) {
      console.log('setTransactionStatus', value)
      state.transactionStatus = value
    },
    /*
    setTargetMosaicNamespace (state, value) {
      console.log('setTargetMosaicNamespace', value)
      state.targetMosaicNamespace = value
    },
    */
    setIsLoading (state, value) {
      console.log('setIsLoading', value)
      state.isLoading = value
    }
  },
  actions: {
    doUpdateNemBalance ({ dispatch, commit, getters }) {
      if ('publicKey' in getters.pairKey) {
        dispatch('doIsLoading', true)
        nemWrapper.getAccountFromPublicKey(getters.pairKey.publicKey)
          .then((result) => {
            let value = result.balance.balance / nemWrapper.NEM_UNIT
            commit('setNemBalance', value)
            dispatch('doIsLoading', false)
          }).catch((err) => {
            console.log(err)
            dispatch('doIsLoading', false)
          })
      } else {
        console.log('nothing publicKey')
      }
    },
    doUpdateMosaicsBalance ({ dispatch, commit, getters }) {
      console.log('doUpdateMosaicsBalance')
      let mosaics = []
      if (getters.address.length > 0) {
        dispatch('doIsLoading', true)
        nemWrapper.getMosaics(getters.address)
          .then((result) => {
            console.log('get Mosaics')
            result.forEach((element) => {
              let mosaic = {}
              mosaic.text = element.mosaicId.namespaceId + ':' + element.mosaicId.name
              mosaic.namespaceId = element.mosaicId.namespaceId
              mosaic.name = element.mosaicId.name
              mosaic.amount = element.amount
              mosaic.divisibility = element.properties.divisibility
              mosaic.initialSupply = element.properties.initialSupply
              mosaic.supplyMutable = element.properties.supplyMutable
              mosaic.transferable = element.properties.transferable
              mosaics.push(mosaic)
            })
            commit('setMosaics', mosaics)
            dispatch('doIsLoading', false)
          }).catch((err) => {
            console.log('get_mosaic_error: ' + err)
            dispatch('doIsLoading', false)
          })
      } else {
        console.log('nothing address')
      }
    },
    doUpdateTransaction ({ dispatch, commit, getters }) {
      let address = getters.address
      let transaction = []
      dispatch('doIsLoading', true)
      nemWrapper.getTransaction(address, 100, undefined, undefined)
        .then((allResult) => {
          transaction = allResult
          return nemWrapper.getUnconfirmedTransaction(address)
        }).then((unResult) => {
          console.log('getUnconfirmedTransaction', unResult)
          transaction = unResult.concat(transaction)
          commit('setTransactions', transaction)
          dispatch('doIsLoading', false)
        }).catch((err) => {
          console.error(err)
          dispatch('doIsLoading', false)
        })
    },
    doObserveTransaction ({ dispatch, commit, getters }) {
      if (getters.address.length !== 0) {
        let address = getters.address
        console.log('doObserveTransaction', address)
        let node = 'https://aqualife1.supernode.me'
        let port = '7779'
        let endpoint = nemSDK.model.objects.create('endpoint')(node, port)
        let connector = nemSDK.com.websockets.connector.create(endpoint, address)
        connector.connect().then(() => {
          console.log('Websocket connected')
          // ソケット受信.
          nemSDK.com.websockets.subscribe.account.data(connector, res => {
            console.log('data', res)
            setTimeout(() => {
              console.log('setTimeout account')
              dispatch('doUpdateNemBalance')
              dispatch('doUpdateMosaicsBalance')
            }, 1000)
          })
          nemSDK.com.websockets.subscribe.account.transactions.recent(connector, res => {
            console.log('recent', res)
            dispatch('doUpdateTransaction')
          })
          nemSDK.com.websockets.subscribe.account.transactions.unconfirmed(connector, res => {
            console.log('unconfirmed', res)
            setTimeout(() => {
              dispatch('doTransactionStatus', 'unconfirmed')
              dispatch('doUpdateTransaction')
            }, 1000)
          })
          nemSDK.com.websockets.subscribe.account.transactions.confirmed(connector, res => {
            console.log('confirmed', res)
            setTimeout(() => {
              dispatch('doTransactionStatus', 'confirmed')
              console.log('setTimeout confirmed')
              dispatch('doUpdateTransaction')
            }, 1000)
          })
          // リクエスト必須.
          nemSDK.com.websockets.requests.account.data(connector)
          nemSDK.com.websockets.requests.account.transactions.recent(connector)
          nemSDK.com.websockets.requests.account.mosaics.definitions(connector)
          nemSDK.com.websockets.requests.account.mosaics.owned(connector)
          nemSDK.com.websockets.requests.account.namespaces.owned(connector)
        }).catch((err) => {
          console.error('doObserveTransaction', err)
        })
      }
    },
    doTransactionStatus ({ commit, getters }, value) {
      commit('setTransactionStatus', value)
    },
    doClearAll ({ commit, getters }) {
      commit('setWalletItem', null)
      commit('setAddress', '')
      commit('setPairKey', {})
      commit('setNemBalance', 0)
      // commit('setFestBalance', 0)
      commit('setMosaics', [])
    },
    doWalletItem ({ commit, getters }, value) {
      commit('setWalletItem', value)
    },
    doAddress ({ commit, getters }, value) {
      commit('setAddress', value)
    },
    doPairKey ({ commit, getters }, value) {
      commit('setPairKey', value)
    },
    doNemBalance ({ commit, getters }, value) {
      commit('setNemBalance', value)
    },
    /*
    doFestBalance ({ commit, getters }, value) {
      commit('setFestBalance', value)
    },
    */
    doMosaics ({ commit, getters }, value) {
      commit('setMosaics', value)
    },
    /*
    doTargetMosaicNamespace ({ commit, getters }, value) {
      commit('setTargetMosaicNamespace', value)
    },
    */
    doIsLoading ({ commit, getters }, value) {
      commit('setIsLoading', value)
    }
  }
}
