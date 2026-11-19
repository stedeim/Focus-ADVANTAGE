// Keep app navigation and auth callbacks on the network. Show a recovery page
// when the connection is unavailable without storing any account data.
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || request.mode !== 'navigate' ||
      url.origin !== self.location.origin || url.pathname !== '/') {
    return;
  }

  event.respondWith(fetch(request).catch(() => new Response(
    '<!doctype html><html lang="en"><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Focus Advantage is offline</title>' +
    '<body style="background:#050B15;color:#fff;font:1rem system-ui;padding:2rem">' +
    '<h1>You’re offline</h1><p>Reconnect to open Focus Advantage.</p>' +
    '<a style="color:#FACC15" href="/">Try again</a></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  )));
});
