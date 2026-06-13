import type { UserProfile } from "../profile/types/profile.types.ts"

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials {
    email: string
    firstName: string
    lastName: string
    password: string
}

export interface AuthResponse {
    accessToken: string
    user: UserProfile
}

export interface AuthState {
    isAuthenticated: boolean
    isLoading: boolean
    user?: UserProfile | null
}

export interface ResetPasswordRequest {
    token: string | null;
    password: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    bio?: string;
    visible?: boolean;
    profilePicture?: string;
    adress?: {
        locality?: string;
        street?: string;
        zipCode?: string;
        country?: string;
        postalBoxNumber?: string;
    };
}
