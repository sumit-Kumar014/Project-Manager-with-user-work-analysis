import type z from "zod"
import { signUpSchema } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useSignUpMutation } from "hooks/use-auth"
import { toast } from "sonner"

export type SignupFormData = z.infer<typeof signUpSchema>

const SignUp = () => {

  const navigate = useNavigate()

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const {mutate, isPending} = useSignUpMutation()

  const handleOnSubmit = (formData: SignupFormData) => {
    mutate(formData, {
      onSuccess: () => {
        toast.success("Account created successfully", {
          description: "Please check your email for verification link, if you don't see it, please check your spam folder"
        })
        form.reset()
        navigate("/sign-in")
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "An error occured"
        console.log(error)
        toast.error(errorMessage)
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl sm:p-8">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Create an account to continue</CardDescription>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} />
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
                    <FormLabel className="font-medium">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full transition-colors">
                {isPending ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="underline hover:underline-offset-2 text-primary font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp
