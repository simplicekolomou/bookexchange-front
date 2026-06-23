import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {email, z} from "zod";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../app/hooks.ts";
import { setCredentials } from "../../authSlice.ts";
import {useRegisterMutation} from "../../api/authApi.ts";

// Schéma Zod avec messages localisés (recréé si la langue change)
const schema = (t: (key: string) =>string) => z.object({
    firstName: z
        .string()
        .min(2, t("validation.firstNameMinLength"))
        .max(100, t("validation.firstNameMaxLength")),
    lastName: z
        .string()
        .min(2, t("validation.lastNameMinLength"))
        .max(60, t("validation.lastNameMaxLength")),
    email: z
        .string()
        .min(2, t("validation.requiredEmail"))
        .pipe(email(t("validation.invalidEmail"))),
    password: z
        .string()
        .min(6, t("validation.passwordMinLength")),
    confirmPassword: z
        .string()
})
    .refine((data) => data.password === data.confirmPassword, {
        message: t("validation.passwordsMustMatch"),
        path: ["confirmPassword"],
    });

type RegisterForm = z.infer<ReturnType<typeof schema>>;

export const useRegisterColler = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation("auth");
    const [localError, setLocalError] = useState("");
    const [registerUser] = useRegisterMutation();

    const form = useForm<RegisterForm>({
        resolver: zodResolver(schema(t)),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterForm) => {
        setLocalError("");
        const newUser = {
            email: data.email.trim(),
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            password: data.password,
        };

        try {
            const result = await registerUser(newUser).unwrap();
            dispatch(setCredentials(result));
            const userId = result?.id;
            navigate(`/user/${userId}/collection`, { replace: true });
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 400 || status === 409) {
                setLocalError(t("registration.emailAlreadyExists"));
            } else {
                setLocalError(t("registration.serverError"));
            }
        }
    };

    // Props de style communes pour les inputs (utilisant les tokens Chakra)
    const inputProps = {
        borderWidth: "2px",
        borderColor: "border.default",
        borderRadius: "md",
        bg: "bg.surface",
        color: "fg.default",
        _placeholder: { color: "fg.placeholder" },
        _hover: { borderColor: "colorPalette.emphasized" },
        _focus: {
            borderColor: "colorPalette.emphasized",
            boxShadow: "0 0 0 4px rgba(59,130,246,0.12)",
            outline: "none",
        },
    } as const;

    return {
        form,
        onSubmit,
        localError,
        inputProps,
    };
};