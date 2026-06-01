import type {User} from "../../auth/types/auth.types.ts";

export interface UserProfile extends User {
    bio?: string
    profilePicture?: string
    adress?: Address
    isVisible: boolean
}

export interface ProfileStats {
    totalBooks: number
    booksLent: number
    successfulExchanges: number
    rating?: number
    memberSince: string
}

export interface UpdateProfileData {
    firstName?: string
    lastName?: string
    bio?: string
    address?: Address
    isVisible?: boolean
    profilePicture?: string
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
    street?: string
    locality?: string
    zipCode?: string
    country?: string
    postalBoxNumber?: string
}