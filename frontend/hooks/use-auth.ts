import { postData } from "@/lib/fetch-utils";
import type { SignupFormData } from "@/routes/auth/sign-up";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data: SignupFormData) => postData("auth/register", data)
    })
}

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (data: { email: string; password: string }) => postData("/auth/login", data)
    })
}

export const useVerifyEmailMMutation = () => {
    return useMutation({
        mutationFn: (data: { token: string }) => postData("auth/verify-email", data)
    })
}

export const useForgetPasswordMutation = () => {
    return useMutation({
        mutationFn: (data : { email : string }) => postData("/auth/reset-password-request", data)
    })
}

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (data : { token : string, newPassword: string, confirmPassword: string }) => postData("/auth/reset-password", data)
    })
}