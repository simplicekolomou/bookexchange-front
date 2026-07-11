import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {useGetUserQuery, useUpdateProfileMutation, useUpdateProfilePictureMutation} from "../../api/authApi.ts";
import {selectCurrentUserId} from "../../authSlice.ts";
import type { UpdateProfileRequest } from "../../types/auth.types.ts";
import {skipToken} from "@reduxjs/toolkit/query/react";

// Schéma de validation zod
const schemaBuilder = (t: (key: string) => string) =>
    z.object({
        firstName: z.string().min(2, t("profile:firstNameRequired")),
        lastName: z.string().min(2, t("profile:lastNameRequired")),
        bio: z.string().optional(),
        visible: z.boolean(),
        adress: z.object({
            locality: z.string().optional(),
            zipCode: z.string().optional(),
            street: z.string().optional(),
            postalBoxNumber: z.string().optional(),
            country: z.string().optional(),
        }),
    });

export type SettingsFormData = z.infer<ReturnType<typeof schemaBuilder>>;

export const useSettingsController = () => {
    const { t } = useTranslation(["profile", "common"]);
    const navigate = useNavigate();
    const userId = useSelector(selectCurrentUserId);
    const { data: user } = useGetUserQuery(userId ? { userId } : skipToken);

    const [updateProfile, { isSuccess: isUpdateSuccess }] = useUpdateProfileMutation();
    const [updateProfilePicture] = useUpdateProfilePictureMutation();

    const [localError, setLocalError] = useState("");
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture ?? "");

    // Initialisation de react-hook-form
    const form = useForm<SettingsFormData>({
        resolver: zodResolver(schemaBuilder(t)),
        defaultValues: {
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            bio: user?.bio ?? "",
            visible: user?.isVisible ?? false,
            adress: {
                locality: user?.adress?.locality ?? "",
                street: user?.adress?.street ?? "",
                zipCode: user?.adress?.zipCode ?? "",
                country: user?.adress?.country ?? "",
                postalBoxNumber: user?.adress?.postalBoxNumber ?? "",
            },
        },
    });

    // Réinitialiser le formulaire si l'utilisateur change (ex: après mise à jour)
    useEffect(() => {
        if (user) {
            form.reset({
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                bio: user.bio ?? "",
                visible: user.isVisible ?? false,
                adress: {
                    locality: user.adress?.locality ?? "",
                    street: user.adress?.street ?? "",
                    zipCode: user.adress?.zipCode ?? "",
                    country: user.adress?.country ?? "",
                    postalBoxNumber: user.adress?.postalBoxNumber ?? "",
                },
            });
            setProfilePicture(user.profilePicture ?? "");
        }
    }, [user, form]);

    // Surveiller la valeur de "visible" pour l'afficher dans le Switch
    const isVisible = useWatch<SettingsFormData, "visible">({ control: form.control, name: "visible" });

    // Navigation après mise à jour réussie
    useEffect(() => {
        if (isUpdateSuccess && user?.id) {
            setLocalError("");
            navigate(`/user/${user.id}/collection`);
        }
    }, [isUpdateSuccess, navigate, user?.id]);

    const handlePrivacyToggle = (checked: boolean) => {
        form.setValue("visible", checked);
    };

    const handleFileChange = (files: File[] | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            setProfilePictureFile(file);
            setProfilePicture(URL.createObjectURL(file));
        }
    };

    // Soumission avec react-hook-form
    const onSubmit = async (data: SettingsFormData) => {
        setLocalError("");

        // On construit l'objet attendu par updateProfile, en reprenant
        // les champs du formulaire.
        const updateInfo: UpdateProfileRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
            bio: data.bio,
            visible: data.visible,
            adress: {
                locality: data.adress?.locality,
                street: data.adress?.street,
                zipCode: data.adress?.zipCode,
                country: data.adress?.country,
                postalBoxNumber: data.adress?.postalBoxNumber,
            },
        };

        try {
            // Envoyer la photo si elle a changée
            if (profilePictureFile) {
                const profilePictureUrl = await updateProfilePicture(profilePictureFile).unwrap();
                setProfilePicture(profilePictureUrl.profilePicture);
            }

            // Mise à jour du reste des infos du profil (nom, prénom, adresse...).
            await updateProfile(updateInfo).unwrap();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 400 || status === 401) {
                setLocalError(t("profile:invalidInformation"));
            } else {
                setLocalError(t("profile:serverError"));
            }
        }
    }

    return {
        t,
        user,
        form,           // ← expose l'objet form (avec register, errors, setValue, etc.)
        isVisible,
        profilePicture,
        localError,
        isUpdateSuccess,
        handlePrivacyToggle,
        handleFileChange,
        onSubmit,   // ← fonction de soumission prête
    };
};