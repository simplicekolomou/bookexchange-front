import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQueryWithUnauthorizedHandler} from "./baseQueryWithUnauthorizedHandler.ts";

export const apiSlice = createApi({
    reducerPath: 'api',
    /**
     * Base query personnalisé pour gérer les erreurs 401 Unauthorized et 403 Forbidden.
     * Il ajoute automatiquement le token d'authentification aux requêtes
     * et intercepte les réponses pour détecter les erreurs 401 et 403.
     * En cas d'erreur 401 ou 403, il peut déclencher une action de déconnexion globale.
     */
    baseQuery: baseQueryWithUnauthorizedHandler,
    // Tags globaux pour l'invalidation des caches
    tagTypes: ['User', 'Auth', 'Profile', 'Picture', 'Book', 'Message', 'Chat', 'Users'],
    // Endpoints seront injectés dans les features
    endpoints: () => ({}),
})