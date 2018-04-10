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
  "./precache-manifest.f0960585907a1d38427d908be31c628e.js"
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
    "revision": "de06552b1a5f1f0c51cbe9934ad85219"
  },
  {
    "url": "precache-manifest.4d9b1d50c30c24df7280bb5cbbaa6c84.js",
    "revision": "4d9b1d50c30c24df7280bb5cbbaa6c84"
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
    "url": "precache-manifest.94f866e48c7b3e47ad00f91661b5e113.js",
    "revision": "94f866e48c7b3e47ad00f91661b5e113"
  },
  {
    "url": "precache-manifest.e3d5a4fcb02aae692809929bdd177c50.js",
    "revision": "e3d5a4fcb02aae692809929bdd177c50"
  },
  {
    "url": "precache-manifest.f0960585907a1d38427d908be31c628e.js",
    "revision": "f0960585907a1d38427d908be31c628e"
  },
  {
    "url": "service-worker.js",
    "revision": "ed2e1f3e2c343ca6c16dd4447beb81c7"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.*api.*/, workbox.strategies.networkFirst({ cacheName: "api", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":86400})] }), 'GET');
