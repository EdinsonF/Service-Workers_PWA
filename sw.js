//Archivos a cachear para usar sin internet
const nombreCache = 'apv-v4';
const archivos = [
'/',
'index.html',
'error.html',
'css/bootstrap.css',
'css/styles.css',
'js/app.js',
'js/apv.js'
];


//Cuando se instala el service worker

self.addEventListener('install', e => {
    console.log("Instalando el Service Worker");
    console.log(e);

    e.waitUntil(
        caches.open(nombreCache)
            .then( cache =>{
                console.log("Cacheando...");
                cache.addAll(archivos);
            })
    )



});

//Actiavar el Service Worker
self.addEventListener('activate', e =>{
    console.log("Service Worker activado");
    console.log(e);
//actualizar nuevas versiones
    e.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.filter(key => key !== nombreCache)
                        .map( key => caches.delete(key))//eliminar versiones anteriores
                )
            })
    )
});


//Evento fetch para descargar archivos estaticos

self.addEventListener('fetch', e => {
    console.log("Fetch...", e);

    e.respondWith(
        caches
          .match(e.request)
          .then(cacheResponse => (cacheResponse ? cacheResponse : caches.match('error.html')))
        
      )
});