import type {UserProfile} from "../../../../types/profile.types.ts";

export function getCurrentUser(): UserProfile | null {
    const authRaw = localStorage.getItem("auth_user");
    let me: UserProfile | null = null;
    if (!authRaw) return null;
    try {
        const parsed = JSON.parse(authRaw);
        me = (parsed?.user as UserProfile) ?? null;
    } catch {
        me = null;
    }
    return me;
}