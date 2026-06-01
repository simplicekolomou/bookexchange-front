import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/authApi";
import { useEffect, useState } from "react";
import { setCredentials } from "../authSlice";
import type { UserProfile } from "../../../types/profile.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {email, z} from "zod";

export const useLoginController = () => {
    const { t } = useTranslation("auth");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login, { isSuccess: isLoginSuccess }] = useLoginMutation();
    const [localError, setLocalError] = useState("");

    const schema = z.object({
        email: z
            .string()
            .nonempty(t("validation.requiredEmail"))
            .pipe(email(t("validation.invalidEmail"))),
        password: z
            .string()
            .nonempty(t("validation.requiredPassword"))
    });

    type LoginForm = z.infer<typeof schema>;

    const form = useForm<LoginForm>({
        resolver: zodResolver(schema),
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
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 400 || status === 401) {
                setLocalError(t("login.invalidCredentials"));
            } else {
                setLocalError(t("login.serverError"));
            }
        }
    };

    useEffect(() => {
        if (isLoginSuccess) {
            const user: UserProfile = JSON.parse(
                localStorage.getItem("auth_user")!
            );
            navigate(`/user/${user.id}/collection`);
        }
    }, [isLoginSuccess, navigate]);

    return {
        localError,
        onSubmit,
        form,
    };
};