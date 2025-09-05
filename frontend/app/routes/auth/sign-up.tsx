import type z from "zod";
import { signUpSchema } from "@/lib/schema";
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
import { useSignUpMutation } from "hooks/use-auth";
import { toast } from "sonner";
import { Loader2Icon, UserPlusIcon } from "lucide-react";

export type SignupFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useSignUpMutation();

  const handleOnSubmit = (formData: SignupFormData) => {
    mutate(formData, {
      onSuccess: () => {
        toast.success("Account created successfully", {
          description:
            "Please check your email for verification link. If you don’t see it, check your spam folder.",
        });
        form.reset();
        navigate("/sign-in");
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-700 text-white p-10">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold">Join TaskTribe Today</h1>
          <p className="text-lg text-white/90">
            Create an account to organize your work, track tasks, and boost
            productivity.
          </p>
          <div className="flex justify-center">
            <img
              src="/signup-illustration.svg"
              alt="Sign up"
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
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Sign up to start managing your projects
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleOnSubmit)}
                className="space-y-6"
              >
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          {...field}
                          className="rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormLabel className="font-semibold">Password</FormLabel>
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

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Confirm Password
                      </FormLabel>
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
                  disabled={isPending}
                  type="submit"
                  className="w-full h-12 text-lg font-medium rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all"
                >
                  {isPending ? (
                    <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <UserPlusIcon className="w-5 h-5 mr-2" />
                  )}
                  {isPending ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex items-center justify-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
