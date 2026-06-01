/**
 * Suscribes the logged in user to push notifications.
 * @returns {Promise<boolean>} true if the subscription was successful, false otherwise.
 */
const subscribeToPush = async () => {
    const token = localStorage.getItem("auth_token")
    if (token === null) return false;
    const registration = await navigator.serviceWorker.register('serviceWorker.js');
    registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BBDyKyvknQuhwMLj-YhZrpUS6M0ZvVcCZYnm0C9R8Ir_ucJT_JPfUboTsKeCvjnrTPJQ-x2XA-dCzjrw0ONldqs"
    }).then((pushSub) => {
        fetch('/api/notifications', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pushSub),
        }).then(() => true);
    }).catch(() => false);
}
export {subscribeToPush}