import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../app/hooks.ts";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/authApi.ts";
import { useState } from "react";
import {setCredentials} from "../../authSlice.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {email, z} from "zod";

const schemaBuilder = (t: (key: string) => string) =>
    z.object({
        email: z
            .string()
            .nonempty(t("validation.requiredEmail"))
            .pipe(email({ message: t("validation.invalidEmail") })),
        password: z.string().nonempty(t("validation.requiredPassword")),
    });

type LoginForm = z.infer<ReturnType<typeof schemaBuilder>>;

export const useLoginController = () => {
    const { t } = useTranslation("auth");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login] = useLoginMutation();
    //const userId: string | undefined = useSelector(selectCurrentUserId);
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
            dispatch(setCredentials(result));

            // Naviguer immédiatement avec l'ID renvoyé par l'API
            const userId = result?.id;
            if (userId) {
                navigate(`/user/${userId}/collection`);
            } else {
                // En cas d'absence d'ID, rester sur place ou gérer l'erreur
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