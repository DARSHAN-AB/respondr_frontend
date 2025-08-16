"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (
      !email.endsWith("@gmail.com") &&
      !email.endsWith("@gov.in") &&
      !email.endsWith("@respondr.in")
    ) {
      return "Email must end with @gmail.com, @gov.in, or @respondr.in";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setFieldErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      console.log("Login form submitted:", { email, password });
      const response = await login({ email, password });
      console.log("Login response:", response);
      authLogin(response.token, response.userId, response.role);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
      <Button
        variant="outline"
        size="sm"
        className="absolute left-4 top-4 flex items-center gap-1 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        onClick={() => router.push("/")}
      >
        <X className="h-4 w-4" />
        <span>Cancel</span>
      </Button>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-red-600 shadow-md">
              <Image
                src="/secondry logo.png"
                alt="Company Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
        </div>

        <Card className="w-full shadow-xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
            <p className="text-sm text-gray-600">
              Use <span className="font-medium text-red-600">@gov.in</span>{" "}
              email for Driver account or{" "}
              <span className="font-medium text-red-600">@respondr.in</span> for
              Admin account
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@gmail.com or driver@gov.in"
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    setFieldErrors((prev) => ({ ...prev, email: validateEmail(val) }));
                  }}
                  required
                  className="h-11 transition-all duration-200 focus:ring-red-500 focus:border-red-500 bg-white"
                />
                {fieldErrors.email && <p className="text-sm text-red-600">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-red-600 hover:text-red-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPassword(val);
                      setFieldErrors((prev) => ({ ...prev, password: validatePassword(val) }));
                    }}
                    required
                    className="h-11 transition-all duration-200 focus:ring-red-500 focus:border-red-500 pr-10 bg-white"
                  />
                  {fieldErrors.password && <p className="text-sm text-red-600">{fieldErrors.password}</p>}
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-2 bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2 pb-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-red-600 font-medium hover:text-red-800 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}