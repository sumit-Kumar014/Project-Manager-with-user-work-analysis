import type z from "zod"
import { signInSchema } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useLoginMutation } from "hooks/use-auth"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"
import { useAuth } from "provider/auth-context"

type SigninFormData = z.infer<typeof signInSchema>
  
const SignIn = () => {
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const navigate = useNavigate()
  const { login } = useAuth()
  const { mutate, isPending } = useLoginMutation()
  
  const handleOnSubmit = (formData: SigninFormData) => {
    mutate(formData, {
      onSuccess: (data) => {
        login(data)
        toast.success("Login Successful")
        navigate("/dashboard")
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "An error Occurred"
        console.log(error)
        toast.error(errorMessage)
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl sm:p-8">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between" >
                        <FormLabel>Password</FormLabel>
                        <Link to='/forget-password' className="text-sm text-blue-600" >Forgot password?</Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full transition-colors" disabled={isPending}>
                {isPending ? <Loader2Icon className="w-4 h-4 mr-2" /> : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/sign-up"
              className="underline hover:underline-offset-2 text-primary font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn
