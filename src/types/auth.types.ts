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
    user: User
    token: string
    expiresIn: number
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
}