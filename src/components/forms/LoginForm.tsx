import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/buttons/Button";
import { LoginFormValues, loginSchema } from "../../schemas/login.ts";
import ErrorIcon from "../../assets/images/icon-error.svg?react";
import EyeIcon from "../../assets/images/icon-eye.svg?react";
import {apiService} from "../../services/api.ts";

export function LoginForm(): JSX.Element {
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await apiService.login(data);
            window.location.href = "/list";
        } catch (error: any) {
            setLoginError(error.message || "Invalid email or password");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full"
        >
            {loginError && (
                <div className="flex flex-row items-center gap-2 p-3 rounded-6 bg-pink-50 border border-pink-200">
                    <ErrorIcon className="shrink-0" />
                    <p className="text-pink700 text-preset5">{loginError}</p>
                </div>
            )}
            <div className="flex flex-col gap-1">
                <label className="text-preset5 text-neutral600" htmlFor="email">
                    Email Address
                </label>
                <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="e.g. alex@example.com"
                    className="border border-neutral-900 placeholder-neutral-600 p-4 mt-2 w-full rounded-6 focus:ring-2 focus:ring-yellow500 outline-none transition-all"
                />
                {errors.email && (
                    <div className="flex flex-row items-center gap-1.5 mt-2">
                        <ErrorIcon className="shrink-0" />
                        <p className="text-pink700 text-preset5">{errors.email.message}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-preset5 text-neutral600" htmlFor="password">
                    Password
                </label>
                <div className="relative mt-2">
                    <input
                        {...register("password")}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="border border-neutral-900 placeholder-neutral-600 p-4 w-full rounded-6 pr-12 focus:ring-2 focus:ring-yellow500 outline-none transition-all"
                    />
                    <Button
                        onClick={() => setShowPassword(!showPassword)}
                        icon={<EyeIcon />}
                        variant="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                    />
                </div>
                {errors.password && (
                    <div className="flex flex-row items-center gap-1.5 mt-2">
                        <ErrorIcon className="shrink-0" />
                        <p className="text-pink700 text-preset5">{errors.password.message}</p>
                    </div>
                )}
            </div>

            <Button
                type="submit"
                text={isSubmitting ? "Logging in..." : "Login"}
                onClick={() => {}}
                className="w-full bg-yellow500 cursor-pointer border-neutral900 border-1 py-4 rounded-12 text-preset3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none mt-2 transition-all disabled:opacity-50"
            />
        </form>
    );
}