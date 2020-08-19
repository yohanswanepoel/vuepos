var cacheName = 'cache_SPA_CACHE_NAME';

var filesToCache = [
  './',
  './index.html',
  './src/app.js',
  './src/helpers.js',
  './src/deps/axios.min.js',
  './src/deps/jquery-3.5.min.js',
  './src/deps/pouchdb-7.1.1.min.js',
  './src/deps/pouchdb.authentication.min.js',
  './src/deps/vue.js',
  './src/deps/vuex.js',
  './src/deps/charts.min.js',
  './src/deps/vue-router.js',
  './src/deps/popper.min.js',
  './src/deps/bootstrap.min.js',
  './src/styles/bootstrap.min.css',
  './src/styles/myapp.css',
  './src/styles/offline.css',
  './src/styles/icons.css',
  './src/styles/icons.woff2',
  './src/components/datatypes.js',
  './src/components/listproducts.js',
  './src/components/listsales.js',
  './src/components/product.js',
  './src/components/sale.js',
  './src/components/reports.js',
  './src/components/vuexstate.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("Caching it all");
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    }).catch(function(err){
        console.log(err);
        return caches.open(cacheName)
          .then(function(cache) {
            return cache.match('/offline.html');
          });
    })
  );
});