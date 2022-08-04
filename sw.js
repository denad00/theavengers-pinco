
self.addEventListener('fetch', event => {
    // Fires whenever the app requests a resource (file or data)  normally this is where the service worker would check to see
    // if the requested resource is in the local cache before going to the server to get it. 
    console.log(`[SW] Fetch event for ${event.request.url}`);

});


const cacheName = "v2";
const urlsToCache = [ "/","/index.html","/livetracking.html",
  "/checkin.js", "/contact.js","/script.js","/prerecorded-calls.js","/sos-button.js","/spa.js","/app.webmanifest", "css/style.css",
  "/icons/icon-192x192.png", "/icons/icon-512x512.png",
  "/signin.html", "signup.html",];

  console.log(urlsToCache)
// NEVER cache service worker itself ( don't include sw.js in the array)

self.addEventListener('install', (event) => { // invoked when a browser installs this SW
    // here we cache the resources that are defined in the urlsToCache[] array
    console.log(`[SW] Event fired: ${event.type}`);
    event.waitUntil(       // waitUntil tells the browser to wait for the input promise to finish
		  caches.open( cacheName )		//caches is a global object representing CacheStorage
			  .then( ( cache ) => { 			// open the cache with the name cacheName*
				  return cache.addAll( urlsToCache );      	// pass the array of URLs to cache**. it returns a promise
		}));
    self.skipWaiting();  // it tells browser to activate this SW and discard old one immediately (useful during development)
    console.log(`[SW] installed`);
});

self.addEventListener('activate', (event) => { // invoked after the SW completes its installation. 
    // It's a place for the service worker to clean up from previous SW versions
    console.log(`[SW] Event fired: ${event.type}`);
    event.waitUntil( deleteOldCache() )    // waitUntil tells the browser to wait for the input promise to finish

    console.log(`[SW] activated`);
});

// iterates over cache entries for this site and delete all except the one matching cacheName
async function deleteOldCache() {
  const keyList = await caches.keys();
  return Promise.all( keyList.map( ( key ) => {
    if ( key !== cacheName  ) {    // compare key with the new cache Name in SW
      return caches.delete( key );  // delete any other cache
    }
  }));
}


self.addEventListener('fetch', event => { // invoked whenever the app requests a resource (file or data) 
    // this is where the service worker can have different strategies
    // to use cache storage (if exists) or forward the request to server. 
    console.log(`[SW] Fetch event for ${event.request.url}`);

    //Option 1. No Strategy, forwards all requests (i.e. doesn't use Cache Storage - on offline support)
    //event.respondWith(fetch(event.request));

    //Option 2. see CACHE FIRST, THEN NETWORK below
    //event.respondWith( CacheFirstThenNetworkStrategy(event) );

    //Option 3. see NETWORK FIRST, THEN CACHE below
    event.respondWith( NetworkFirstThenCacheStrategy(event) );

});

// CACHE FIRST, THEN NETWORK STRATEGY
async function CacheFirstThenNetworkStrategy(event) {
  const cachedResponse = await caches.match( event.request);
  return cachedResponse || fetch( event.request );  // returns cachedResponse or server fetch  if no cachedResponse
}

// NETWORK FIRST, THEN CACHE STRATEGY
async function NetworkFirstThenCacheStrategy(event) {
  try {
      return await fetch( event.request );  // returns server fetch
  } catch(error) { 
      return caches.match( event.request ); // returns cached response if server fetch fails (e.g. user is offline)
  }
}
