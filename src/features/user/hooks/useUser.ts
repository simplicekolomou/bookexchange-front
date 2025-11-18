import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
    useUploadAvatarMutation,
} from '../userApi.ts'
import type {UpdateProfileData, ChangePasswordData} from '../../../types/user.types'
import { toaster } from '../../../components/ui/toaster'

export const useUser = (userId: string) => {
    const { t } = useTranslation('user')

    const [updateProfile] = useUpdateUserProfileMutation()
    const [changePassword] = useChangePasswordMutation()
    const [uploadAvatar] = useUploadAvatarMutation()

    const handleUpdateProfile = async (updates: UpdateProfileData) => {
        try {
            const result = await updateProfile({ userId, updates }).unwrap()
            toaster.create({
                title: t('profileUpdated'),
                duration: 3000,
            })
            return result
        } catch (error) {
            toaster.create({
                title: t('updateError'),
                duration: 5000,
            })
            throw error
        }
    }

    const handleChangePassword = useCallback(async (data: ChangePasswordData) => {
        try {
            await changePassword({
                userId,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }).unwrap()
            toaster.create({
                title: t('passwordChanged'),
                duration: 3000,
            })
        } catch (error) {
            toaster.create({
                title: t('passwordChangeError'),
                duration: 5000,
            })
            throw error
        }
    }, [userId, changePassword, toaster, t])

    const handleUploadAvatar = useCallback(async (file: File) => {
        const formData = new FormData()
        formData.append('avatar', file)

        try {
            const result = await uploadAvatar({ userId, formData }).unwrap()
            toaster.create({
                title: t('avatarUpdated'),
                duration: 3000,
            })
            return result
        } catch (error) {
            toaster.create({
                title: t('avatarError'),
                duration: 5000,
            })
            throw error
        }
    }, [userId, uploadAvatar, toaster, t])

    return {
        updateProfile: handleUpdateProfile,
        changePassword: handleChangePassword,
        uploadAvatar: handleUploadAvatar,
    }
}