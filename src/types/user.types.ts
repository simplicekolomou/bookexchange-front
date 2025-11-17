import type {User} from "./auth.types.ts";

export interface UserProfile extends User {
    bio?: string
    location?: string
    avatarUrl?: string
}

export interface UserStats {
    totalBooks: number
    booksLent: number
    successfulExchanges: number
    rating?: number
    memberSince: string
}

export interface UpdateProfileData {
    firstName?: string
    lastName?: string
    email?: string
    bio?: string
    address?: Address
}

export interface ChangePasswordData {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export interface NotificationSettings {
    emailNotifications: boolean
    bookRequests: boolean
    messages: boolean
}

export interface Address {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
}