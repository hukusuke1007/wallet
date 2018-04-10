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
  "./precache-manifest.4d9b1d50c30c24df7280bb5cbbaa6c84.js"
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
    "url": "precache-manifest.753d2d840611356caff0eb9b4b2e3fd3.js",
    "revision": "753d2d840611356caff0eb9b4b2e3fd3"
  },
  {
    "url": "precache-manifest.94f866e48c7b3e47ad00f91661b5e113.js",
    "revision": "94f866e48c7b3e47ad00f91661b5e113"
  },
  {
    "url": "service-worker.js",
    "revision": "2997172716c42cc66d3edffce06688f9"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.*api.*/, workbox.strategies.networkFirst({ cacheName: "api", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":86400})] }), 'GET');
