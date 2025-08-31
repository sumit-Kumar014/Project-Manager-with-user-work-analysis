import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { resetPasswordSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useResetPasswordMutation } from "hooks/use-auth"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useSearchParams } from "react-router"
import { toast } from "sonner"
import type z from "zod"

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
const ResetPassword = () => {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })


  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const { mutate: resetPassword, isPending } = useResetPasswordMutation()

  const [isSuccess, setIsSuccess] = useState(false)

  const onSubmit = (data: ResetPasswordFormData) => {
    if(!token) {
      toast.error("Invalid token")
      return
    }

    resetPassword({...data, token: token as string}, {
      onSuccess: () => {
        setIsSuccess(true)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message
        toast.error(errorMessage || "Something went wrong!")
        console.log(error)
      }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">Enter your password below</p>
        </div>
        <Card>
          <CardHeader>
            <Link to="/sign-in" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
            </Link>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <h1 className="text-2xl font-bold">
                  Password Reset Successfully
                </h1>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your new password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your new password again"
                            aria-label="New Password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword
