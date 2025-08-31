import { validateRequest } from "zod-express-middleware"
import { Router } from "express"
import { loginSchema, registerSchema, resetPasswordRequestSchema, resetPasswordSchema, verificationSchema } from "../libs/validate-schema.js"
import { registerUser, loginUser, verifyEmail, resetPasswordRequest, verifyResetPasswordTokenAndResetPassword } from "../controllers/auth.controller.js"

const router = Router()

router.post("/register",
    validateRequest({ // it check the imcoming request body(req.body) matches the rules defined in workspaceSchema which is written use zod
        body: registerSchema
    }),
    registerUser
)

router.post("/login",
    validateRequest({
        body: loginSchema
    }),
    loginUser
)

router.post("/verify-email", 
    validateRequest({
        body: verificationSchema
    }),
    verifyEmail
)

router.post("/reset-password-request",
    validateRequest({
        body: resetPasswordRequestSchema
    }),
    resetPasswordRequest
)

router.post("/reset-password",
    validateRequest({
        body: resetPasswordSchema
    }),
    verifyResetPasswordTokenAndResetPassword
)

export default router