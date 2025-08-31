import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { forgetPasswordSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForgetPasswordMutation } from "hooks/use-auth"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
import { toast } from "sonner"
import type z from "zod"

export type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>

const ForgetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const { mutate: forgetPassword, isPending } = useForgetPasswordMutation()
  const form = useForm<ForgetPasswordData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: ""
    },
  })

  const onSubmit = (data: ForgetPasswordData) => {
    forgetPassword(data, {
      onSuccess: () => {
        setIsSuccess(true)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message
        console.error("Password reset failed:", error)
        toast.error(errorMessage)
      }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground">
            Enter your email to reset your password
          </p>
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
                  Password reset email sent
                </h1>
                <p className="text-muted-foreground">
                  Check your email for a link to reset your password
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
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

export default ForgetPassword
