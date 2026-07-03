import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForgotPasswordMutation} from "../../api/authApi.ts";
import { useState } from "react";

const schemaBuilder =(t: (key: string) => string) =>
    z.object({
        email: z.email({ message: t("validation.invalidEmail") }),
    });

type ForgotPasswordForm = z.infer<ReturnType<typeof schemaBuilder>>;

export const useForgotPasswordController = () => {
    const { t } = useTranslation('auth');
    const [ localError, setLocalError ] = useState("");
    const [forgotPassword, {isLoading, isSuccess}] = useForgotPasswordMutation();
    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(schemaBuilder(t)),
        defaultValues: { email: '' },
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setLocalError("");
        try {
            await forgotPassword(data.email).unwrap();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            const message =
                status === 404
                    ? t('forgotPassword.notFoundEmail')
                    : t('forgotPassword.serverError');

            setLocalError(message);
        }
    };

    return {
        localError,
        form,
        onSubmit,
        isLoading,
        isSuccess,
    };
}