import { useTranslation } from "react-i18next";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../authSlice.ts";
import {useUpdatePasswordMutation} from "../../api/authApi.ts";

const buildSchema = (t: (key: string) => string) =>
    z
        .object({
            currentPassword: z
                .string()
                .min(6, t("validation.passwordMinLength")),
            newPassword: z
                .string()
                .min(6, t("validation.passwordMinLength")),
            confirmPassword: z
                .string().min(6, t("validation.passwordMinLength")),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t("resetPassword.passwordsMustMatch"),
            path: ["confirmPassword"], // Champ ciblé pour l'erreur de confirmation
        })
        .refine((data) => data.newPassword !== data.currentPassword, {
            message: t("resetPassword.sameAsCurrentPassword"),
            path: ["newPassword"],
        });

type UpdatePasswordForm = z.infer<ReturnType<typeof buildSchema>>;

export const useUpdatePasswordController = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("auth");
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
    const user = useSelector(selectCurrentUser);

    const schema = buildSchema(t);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<UpdatePasswordForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: UpdatePasswordForm) => {
        try {
            await updatePassword({currentPassword: data.currentPassword, newPassword: data.newPassword}).unwrap();

            reset(); // vider les champs sensibles après succès
            navigate(`/user/${user?.id}/collection`);
        } catch (err) {
            const status = (err as { status?: number })?.status;

            if (status === 401) {
                setError("currentPassword", { // Erreur sur le champ concerné, pas sur root
                    message: t("resetPassword.incorrectCurrentPassword"),
                });
            } else if (status === 403) {
                setError("root", {
                    message: t("resetPassword.forbidden"),
                });
            } else {
                // Fallback générique pour 404, 500, erreur réseau, etc.
                setError("root", {
                    message: t("resetPassword.serverError"),
                });
            }
        }
    };

    return {
        form: {
            register,
            handleSubmit,
            formState: { errors },
        },
        onSubmit,
        isLoading,
    };
}