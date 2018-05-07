import Vue from 'vue'
import Vuex from 'vuex'
import Nem from '@/store/nem_store'
// import router from './router'
/*
getter ・・・テンプレートへ値を返します
state ・・・値を保持する
mutation・・・stateの値を変更する
action ・・・mutationを呼び出す
*/
Vue.use(Vuex)

const Top = {
  namespaced: true,
  state: {
    title: 'NEM fest',
    descriptionNotAuth: '本人確認できていません。<br>TOPページで認証してください。'
  },
  getters: {
    title: state => state.title,
    descriptionNotAuth: state => state.descriptionNotAuth
  },
  mutations: {
    setTitle (state, value) {
      console.log('setTitle', value)
      state.title = value
    },
    setDescriptionNotAuth (state, value) {
      console.log('setDescriptionNotAuth', value)
      state.descriptionNotAuth = value
    }
  },
  actions: {
    doTitle ({ commit, getters }, value) {
      commit('setTitle', value)
    },
    doDescriptionNotAuth ({ commit, getters }, value) {
      commit('setDescriptionNotAuth', value)
    }
  }
}

const Auth = {
  namespaced: true,
  state: {
    isAuth: false,
    authPassword: ''
  },
  getters: {
    isAuth: state => state.isAuth,
    authPassword: state => state.authPassword
  },
  mutations: {
    setAuth (state, value) {
      console.log('setAuth: ' + value)
      state.isAuth = value
    },
    setAuthPassword (state, value) {
      console.log('setAuthPassword: ' + value)
      state.authPassword = value
    }
  },
  actions: {
    doAuth ({ commit, getters }, value) {
      commit('setAuth', value)
    },
    doAuthPassword ({ commit, getters }, value) {
      commit('setAuthPassword', value)
    }
  }
}

export default new Vuex.Store({
  modules: {
    Top,
    Auth,
    Nem
  }
})
