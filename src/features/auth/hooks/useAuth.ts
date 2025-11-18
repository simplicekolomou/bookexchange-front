import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { useLogoutMutation } from '../authApi.ts'

export const useAuth = () => {
    const navigate = useNavigate()
    const [logoutApi] = useLogoutMutation()

    const { user, token, isAuthenticated } = useAppSelector((state) => state.auth)

    const logout = async () => {
        try {
            await logoutApi().unwrap()
        } catch (error) {
            console.error('Logout API error:', error)
        } finally {
            navigate('/login')
        }
    }
    return {
        user,
        token,
        isAuthenticated,
        logout,
    }
}