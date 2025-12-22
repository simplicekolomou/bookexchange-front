// source : https://github.com/mdn/serviceworker-cookbook/blob/master/push-payload/service-worker.js
self.addEventListener("push", async (event)=>  {
    const payload = event.data.json();

    // Keep the service worker alive until the notification is created.
    event.waitUntil(
        // Show a notification with title 'ServiceWorker Cookbook' and use the payload
        // as the body.
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: "/icons/manifest-icon-192.maskable.png",
            vibrate: [500,100,500],
            requireInteraction: true
        })
    );
})
