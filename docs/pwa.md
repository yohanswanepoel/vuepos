# Progressive Web Apps (PWA)
For this application the PWA allows me to do two things
* Cache all the static content locally
* Make the app installable as a desktop application

For offical documentation see: https://codelabs.developers.google.com/codelabs/your-first-pwapp/#0

## Usage in the app
For PWA's you require a manifest, service worker and a loaded service worker. This controlls replication and networking proxying for offline use. For debugging you can also disable the service workers.

### Load the service worker
See [app.js](../app/app.js) - this loads the service worker and specifies the scope. The sw.js file is in the root folder.
``` javascript
beforeCreate: function(){
    if ('serviceWorker' in navigator) {
    navigator.serviceWorker
            .register('./sw.js', {
                scope : '/'
            });
    }
}
```


### Service worker content
The service worker file found in [sw.js](../app/sw.js) specifies files to cache and event listeners that cache and install the app.

You have to specify every file you want to cache. Webpack builders help here.
```javascript
var filesToCache = [
  '/',
  '/index.html',
  '/src/app.js',
  ...
  ...
  '/src/components/serverconfig.js'
];
```

### Manifest
The [Manifest](../manifest.json) file specifies components such as starting url and icons ect required to do an offline install.

```json
{
    "name": "Canteen POS",
    "short_name": "Canteen POS",
    "icons": [{
        "src": "images/icon-128.png",
          "sizes": "128x128",
          "type": "image/png"
       ...
       ...
       }],
    "lang": "en-US",
    "start_url": "/index.html",
    "display": "standalone",
    "background_color": "white",
    "theme_color": "white"
  }
```