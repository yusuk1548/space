const CACHE_NAME = 'safespace-v1';

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // 앱 구동에 필요한 최소한의 파일을 오프라인 저장소에 강제 보관
            return cache.addAll([
                '/space/',
                '/space/index.html',
                '/space/manifest.json',
                '/space/icon-192.png',
                '/space/icon-512.png'
            ]);
        })
    );
});

self.addEventListener('activate', (e) => {
    self.clients.claim();
    // 과거의 쓰레기 캐시를 청소하여 꼬임 방지
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => {
                if (k !== CACHE_NAME) return caches.delete(k);
            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        })
    );
});