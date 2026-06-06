import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {email, z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForgotPasswordMutation} from "../api/forgotPasswordApi.ts";

export const useForgotPasswordController = () => {
    const { t } = useTranslation('auth');
    const schema = z.object({
        email: z.string().pipe(email({ message: t("validation.invalidEmail") })),
    });
    type ForgotPasswordForm = z.infer<typeof schema>;
    const [forgotPassword, { isSuccess, isLoading }] = useForgotPasswordMutation();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitSuccessful },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(schema),
        defaultValues: { email: '' },
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            await forgotPassword(data.email).unwrap();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            const message =
                status === 404
                    ? t('forgotPassword.notFoundEmail')
                    : t('forgotPassword.serverError');

            setError('email', { type: 'server', message });
        }
    };

    /**
     * isSubmitted est true uniquement si la soumission du formulaire a réussi et que la requête de
     * mot de passe oublié a été traitée avec succès. Cela garantit que le message de confirmation ne
     * s'affiche que lorsque les deux conditions sont remplies.
     */
    const isSubmitted = isSubmitSuccessful && isSuccess;

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isLoading,
        isSubmitted,
        t,
    };
}