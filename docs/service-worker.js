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
  "./precache-manifest.b361d304b97364abcc7cff7a9a759c7b.js"
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
    "revision": "6e5d3f40206d3cb7cf9fb03e8ee34e59"
  },
  {
    "url": "precache-manifest.00636609815fc1967681b0d3252ddccc.js",
    "revision": "00636609815fc1967681b0d3252ddccc"
  },
  {
    "url": "precache-manifest.00a60a62e608f2f92c6eaa26614b4be8.js",
    "revision": "00a60a62e608f2f92c6eaa26614b4be8"
  },
  {
    "url": "precache-manifest.0549816dfa35f1a060678c346de2d7df.js",
    "revision": "0549816dfa35f1a060678c346de2d7df"
  },
  {
    "url": "precache-manifest.08ba9a4a95bc8b2f65fb954dbf597e55.js",
    "revision": "08ba9a4a95bc8b2f65fb954dbf597e55"
  },
  {
    "url": "precache-manifest.0943355d41c599f737fa73ca0e1e8ff9.js",
    "revision": "0943355d41c599f737fa73ca0e1e8ff9"
  },
  {
    "url": "precache-manifest.0e0dee87a0fbf9bf5ca7fbaa4eb758d4.js",
    "revision": "0e0dee87a0fbf9bf5ca7fbaa4eb758d4"
  },
  {
    "url": "precache-manifest.1693cebe33ca50b5d13ad7d0a49ee266.js",
    "revision": "1693cebe33ca50b5d13ad7d0a49ee266"
  },
  {
    "url": "precache-manifest.1a4b56c633dfed4411673db11e697bfe.js",
    "revision": "1a4b56c633dfed4411673db11e697bfe"
  },
  {
    "url": "precache-manifest.1dd4b538a8cbaa4d19b2c24856108fef.js",
    "revision": "1dd4b538a8cbaa4d19b2c24856108fef"
  },
  {
    "url": "precache-manifest.25bfde2ccee1ba6ee03c445a2a18aec7.js",
    "revision": "25bfde2ccee1ba6ee03c445a2a18aec7"
  },
  {
    "url": "precache-manifest.26ffe10cca38a53e9065c763a6ba7627.js",
    "revision": "26ffe10cca38a53e9065c763a6ba7627"
  },
  {
    "url": "precache-manifest.2acd59856b38a3913c4ca838faa68927.js",
    "revision": "2acd59856b38a3913c4ca838faa68927"
  },
  {
    "url": "precache-manifest.301659822a9aa259ff4d09df32296624.js",
    "revision": "301659822a9aa259ff4d09df32296624"
  },
  {
    "url": "precache-manifest.3ba4c284bfc8f67e369aecb94bd3e430.js",
    "revision": "3ba4c284bfc8f67e369aecb94bd3e430"
  },
  {
    "url": "precache-manifest.43d7b58eb917e60b3583b28917ce3447.js",
    "revision": "43d7b58eb917e60b3583b28917ce3447"
  },
  {
    "url": "precache-manifest.48cfcf6962e97d7aa3ddcb8505e1615c.js",
    "revision": "48cfcf6962e97d7aa3ddcb8505e1615c"
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
    "url": "precache-manifest.5216aab0aad9b50e82c6f4df31c74d37.js",
    "revision": "5216aab0aad9b50e82c6f4df31c74d37"
  },
  {
    "url": "precache-manifest.5976b0ed3648b86baaeeca6b32a774bd.js",
    "revision": "5976b0ed3648b86baaeeca6b32a774bd"
  },
  {
    "url": "precache-manifest.5f6b303b8d9a601f67158318e3847b44.js",
    "revision": "5f6b303b8d9a601f67158318e3847b44"
  },
  {
    "url": "precache-manifest.63936336a60079e858907c30d6e1c8c6.js",
    "revision": "63936336a60079e858907c30d6e1c8c6"
  },
  {
    "url": "precache-manifest.73181311999e0c2a7a9f5df7dbfa7554.js",
    "revision": "73181311999e0c2a7a9f5df7dbfa7554"
  },
  {
    "url": "precache-manifest.753d2d840611356caff0eb9b4b2e3fd3.js",
    "revision": "753d2d840611356caff0eb9b4b2e3fd3"
  },
  {
    "url": "precache-manifest.789b79030681a9504c2108bf947d0e33.js",
    "revision": "789b79030681a9504c2108bf947d0e33"
  },
  {
    "url": "precache-manifest.799bcf1ffd53e5d415ca082d8e157c04.js",
    "revision": "799bcf1ffd53e5d415ca082d8e157c04"
  },
  {
    "url": "precache-manifest.892731b093129274fc96e6c2b00ec1a7.js",
    "revision": "892731b093129274fc96e6c2b00ec1a7"
  },
  {
    "url": "precache-manifest.8e72f2ea366094928e9be67ec2f68f77.js",
    "revision": "8e72f2ea366094928e9be67ec2f68f77"
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
    "url": "precache-manifest.983a111630547467f45dcf3ea7e97d6e.js",
    "revision": "983a111630547467f45dcf3ea7e97d6e"
  },
  {
    "url": "precache-manifest.98831782f4c6b5f2666c7abc7b75c09a.js",
    "revision": "98831782f4c6b5f2666c7abc7b75c09a"
  },
  {
    "url": "precache-manifest.9bbadeabb32f52e19eb23b22460d1368.js",
    "revision": "9bbadeabb32f52e19eb23b22460d1368"
  },
  {
    "url": "precache-manifest.9ce2254c64927fb494ec0d5fddd92f89.js",
    "revision": "9ce2254c64927fb494ec0d5fddd92f89"
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
    "url": "precache-manifest.a258ff3d09643c3f34e4bc5ea11cd7f0.js",
    "revision": "a258ff3d09643c3f34e4bc5ea11cd7f0"
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
    "url": "precache-manifest.b0ca869966645c8f098aa4626de32854.js",
    "revision": "b0ca869966645c8f098aa4626de32854"
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
    "url": "precache-manifest.bec5f59640f8181d8117e769634a94e5.js",
    "revision": "bec5f59640f8181d8117e769634a94e5"
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
    "url": "precache-manifest.d3dfca9a1cc578e4a294fffa6843aac1.js",
    "revision": "d3dfca9a1cc578e4a294fffa6843aac1"
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
    "url": "precache-manifest.eb8e4d461a09afdc5d57df4e27f5475e.js",
    "revision": "eb8e4d461a09afdc5d57df4e27f5475e"
  },
  {
    "url": "precache-manifest.ecd7b9844d801912574e44816f31aea7.js",
    "revision": "ecd7b9844d801912574e44816f31aea7"
  },
  {
    "url": "precache-manifest.ef61973021b15c26112c42bc27f2ec0d.js",
    "revision": "ef61973021b15c26112c42bc27f2ec0d"
  },
  {
    "url": "precache-manifest.f0960585907a1d38427d908be31c628e.js",
    "revision": "f0960585907a1d38427d908be31c628e"
  },
  {
    "url": "precache-manifest.f594ca2e0a46c6eee99cffba6083ae0f.js",
    "revision": "f594ca2e0a46c6eee99cffba6083ae0f"
  },
  {
    "url": "precache-manifest.fd576987203d61c2d81f9ed6d4a86d02.js",
    "revision": "fd576987203d61c2d81f9ed6d4a86d02"
  },
  {
    "url": "service-worker.js",
    "revision": "ef6c8846b678f236be56b9c5b5851f4e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.*api.*/, workbox.strategies.networkFirst({ cacheName: "api", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":86400})] }), 'GET');
