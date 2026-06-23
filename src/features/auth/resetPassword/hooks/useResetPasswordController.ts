import {useTranslation} from "react-i18next";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAppDispatch} from "../../../../app/hooks.ts";
import {useForm} from "react-hook-form";
import {setCredentials} from "../../authSlice.ts";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useResetPasswordMutation} from "../../api/authApi.ts";

const schema = (t: (key:string) =>string) => z.object({
    password: z
        .string()
        .min(6, t("validation.passwordMinLength")),
    confirmPassword: z
        .string(),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: t("validation.passwordsMustMatch"),
        path: ["confirmPassword"],
    });

type ResetPasswordForm = z.infer<ReturnType<typeof schema>>;

export const useResetPasswordController = () => {
    const { t } = useTranslation("auth");
    const [resetPassword] = useResetPasswordMutation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(schema(t)),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            const result = await resetPassword({ token, password: data.password }).unwrap();
            dispatch(setCredentials(result));
            navigate("/login");
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 404 || status === 401 || status === 500) {
                setError("root", {
                    message: t("resetPassword.serverError"),
                });
            }
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit
    };
}