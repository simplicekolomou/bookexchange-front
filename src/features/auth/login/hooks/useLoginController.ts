import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/authApi.ts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";

const schemaBuilder = (t: (key: string) => string) =>
    z.object({
        email: z.email(t("validation.invalidEmail")),
        password: z.string().nonempty(t("validation.requiredPassword")),
    });

type LoginForm = z.infer<ReturnType<typeof schemaBuilder>>;

export const useLoginController = () => {
    const { t } = useTranslation("auth");
    const navigate = useNavigate();
    const [login] = useLoginMutation();
    const [localError, setLocalError] = useState("");

    const form = useForm<LoginForm>({
        resolver: zodResolver(schemaBuilder(t)),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginForm) => {
        setLocalError("");
        try {
            const result = await login(data).unwrap();
            const userId = result?.id;
            if (userId) {
                navigate(`/user/${userId}/collection`);
            } else {
                // Cas limite : le backend a répondu succès mais sans id
                // (ne devrait normalement jamais arriver, mais on se protège)
                setLocalError(t("login.serverError"));
            }
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 400 || status === 401) {
                setLocalError(t("login.invalidCredentials"));
            } else {
                setLocalError(t("login.serverError"));
            }
        }
    };

    return {
        localError,
        onSubmit,
        form,
    };
};