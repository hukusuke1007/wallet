# genio-wallet

> genio-wallet

## Build Setup

``` bash
# install dependencies
npm install

# install for library
npm uninstall sw-precache-webpack-plugin
npm install --save-dev workbox-webpack-plugin
# -> ref:https://qiita.com/gyarasu/items/2f18edc4ae251180d89e

npm install --save node-sass sass-loader
npm install vue-router vuetify --save
npm install axios --save
npm install vue-qrcode-reader --save

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
