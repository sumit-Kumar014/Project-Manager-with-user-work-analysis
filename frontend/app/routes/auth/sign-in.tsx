import type z from "zod";
import { signInSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "hooks/use-auth";
import { toast } from "sonner";
import { Loader2Icon, LogInIcon } from "lucide-react";
import { useAuth } from "provider/auth-context";

type SigninFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutate, isPending } = useLoginMutation();

  const handleOnSubmit = (formData: SigninFormData) => {
    mutate(formData, {
      onSuccess: (data) => {
        login(data);
        toast.success("Login Successful");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "An error Occurred";
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Illustration / Gradient */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white p-10">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-4xl font-bold">Welcome Back to TaskTribe</h1>
          <p className="text-lg text-white/90">
            Manage your projects, track progress, and stay productive with ease.
          </p>
          <div className="flex justify-center">
            <img
              src="/signin-illustration.svg"
              alt="Sign in"
              className="w-72 drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-muted/30">
        <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl">
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Sign In
            </CardTitle>
            <CardDescription className="text-base">
              Access your account and start working smarter
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleOnSubmit)}
                className="space-y-6"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          className="rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-semibold">Password</FormLabel>
                        <Link
                          to="/forget-password"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          className="rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-medium rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition-all"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <LogInIcon className="w-5 h-5 mr-2" />
                  )}
                  Sign In
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex items-center justify-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/sign-up"
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
