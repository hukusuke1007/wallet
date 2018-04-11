/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.0.1/workbox-sw.js");

importScripts(
  "./precache-manifest.25bfde2ccee1ba6ee03c445a2a18aec7.js"
);

workbox.core.setCacheNameDetails({prefix: "wallet"});

workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "e1e23a0d69e08f8891659a9f6e88cfb9"
  },
  {
    "url": "precache-manifest.2acd59856b38a3913c4ca838faa68927.js",
    "revision": "2acd59856b38a3913c4ca838faa68927"
  },
  {
    "url": "precache-manifest.49c3787b97f4d42065dd18043439cb1b.js",
    "revision": "49c3787b97f4d42065dd18043439cb1b"
  },
  {
    "url": "precache-manifest.4d9b1d50c30c24df7280bb5cbbaa6c84.js",
    "revision": "4d9b1d50c30c24df7280bb5cbbaa6c84"
  },
  {
    "url": "precache-manifest.50867cc81863bbbcd65f47394afdbfe5.js",
    "revision": "50867cc81863bbbcd65f47394afdbfe5"
  },
  {
    "url": "precache-manifest.63936336a60079e858907c30d6e1c8c6.js",
    "revision": "63936336a60079e858907c30d6e1c8c6"
  },
  {
    "url": "precache-manifest.753d2d840611356caff0eb9b4b2e3fd3.js",
    "revision": "753d2d840611356caff0eb9b4b2e3fd3"
  },
  {
    "url": "precache-manifest.9223d96dfbd34053357742771ce2efbe.js",
    "revision": "9223d96dfbd34053357742771ce2efbe"
  },
  {
    "url": "precache-manifest.94f866e48c7b3e47ad00f91661b5e113.js",
    "revision": "94f866e48c7b3e47ad00f91661b5e113"
  },
  {
    "url": "precache-manifest.9f02b7966f8a9693d130a2ab40dde359.js",
    "revision": "9f02b7966f8a9693d130a2ab40dde359"
  },
  {
    "url": "precache-manifest.a210e72b9e44d45475936a3616888801.js",
    "revision": "a210e72b9e44d45475936a3616888801"
  },
  {
    "url": "precache-manifest.a9d730d5acf3e1f6811f432e082f386b.js",
    "revision": "a9d730d5acf3e1f6811f432e082f386b"
  },
  {
    "url": "precache-manifest.ac255c862db5ffb36b5272017cefbd82.js",
    "revision": "ac255c862db5ffb36b5272017cefbd82"
  },
  {
    "url": "precache-manifest.b4d5cb12c7e5ce64367cf54ce343a9ae.js",
    "revision": "b4d5cb12c7e5ce64367cf54ce343a9ae"
  },
  {
    "url": "precache-manifest.b6557fe489d4c5ee63178bb20120794f.js",
    "revision": "b6557fe489d4c5ee63178bb20120794f"
  },
  {
    "url": "precache-manifest.c43bfa50b6d13c72063f197f714c45ef.js",
    "revision": "c43bfa50b6d13c72063f197f714c45ef"
  },
  {
    "url": "precache-manifest.c4e90eb5a7fd75e9fb642699b7207ca2.js",
    "revision": "c4e90eb5a7fd75e9fb642699b7207ca2"
  },
  {
    "url": "precache-manifest.dd7f9a9138122af32f083ae4285a07d7.js",
    "revision": "dd7f9a9138122af32f083ae4285a07d7"
  },
  {
    "url": "precache-manifest.e19ad10b2f02c71171e03967918f52bb.js",
    "revision": "e19ad10b2f02c71171e03967918f52bb"
  },
  {
    "url": "precache-manifest.e3d5a4fcb02aae692809929bdd177c50.js",
    "revision": "e3d5a4fcb02aae692809929bdd177c50"
  },
  {
    "url": "precache-manifest.ecd7b9844d801912574e44816f31aea7.js",
    "revision": "ecd7b9844d801912574e44816f31aea7"
  },
  {
    "url": "precache-manifest.f0960585907a1d38427d908be31c628e.js",
    "revision": "f0960585907a1d38427d908be31c628e"
  },
  {
    "url": "precache-manifest.fd576987203d61c2d81f9ed6d4a86d02.js",
    "revision": "fd576987203d61c2d81f9ed6d4a86d02"
  },
  {
    "url": "service-worker.js",
    "revision": "b931134b02e5c4968bca5c2d336e9a89"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.*api.*/, workbox.strategies.networkFirst({ cacheName: "api", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":86400})] }), 'GET');
