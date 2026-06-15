import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { messaging } from "../../../../../public/firebaseConfig.js";

export const useFirebaseController = () => {
    const [token, setToken] = useState<string | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

    useEffect(() => {
        const requestPermissionAndGetToken = async () => {
            try {
                if (!("Notification" in window)) {
                    console.log("Ce navigateur ne supporte pas les notifications");
                    return;
                }

                let permission = Notification.permission;
                if (permission !== "granted" && permission !== "denied") {
                    permission = await Notification.requestPermission();
                }

                setNotificationPermission(permission);

                if (permission === "granted") {
                    const vapidKey = import.meta.env.VITE_API_KEY;

                    if (!vapidKey) {
                        console.error("La clé VAPID n'est pas définie dans .env");
                        return;
                    }

                    const currentToken = await getToken(messaging, { vapidKey });
                    if (currentToken) {
                        setToken(currentToken);
                        // Envoi au backend Spring Boot
                        await fetch("/api/notifications/register-token", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ token: currentToken }),
                        });
                    } else {
                        console.log("Aucun token FCM disponible");
                    }
                } else {
                    console.log("Permission de notification refusée");
                }
            } catch (error) {
                console.error("Erreur lors de la demande de permission FCM", error);
            }
        };

        requestPermissionAndGetToken();
    }, []);

    useEffect(() => {
        if (token) {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log("Message reçu au premier plan", payload);
                alert(payload.notification?.title);
            });
            return unsubscribe;
        }
    }, [token]);

    return { token, notificationPermission };
};