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
import { signup } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const { login: authLogin } = useAuth();

  const validateName = (name: string) => {
    if (!name) return "Full name is required";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!email.endsWith("@gmail.com") && !email.endsWith("@gov.in") && !email.endsWith("@respondr.in")) {
      return "Email must end with @gmail.com, @gov.in, or @respondr.in";
    }
    if (email.endsWith("@respondr.in") && email !== "admin@respondr.in") {
      return "Only admin@respondr.in is allowed for @respondr.in domain";
    }
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    if (!/^[6-9]\d{9}$/.test(phone)) return "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    const errors = {
      name: nameError,
      email: emailError,
      phone: phoneError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };

    setFieldErrors(errors);

    if (nameError || emailError || phoneError || passwordError || confirmPasswordError) {
      setError(nameError || emailError || phoneError || passwordError || confirmPasswordError);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      console.log('Signup form submitted:', { name, email, phone_number: phone, password });
      const response = await signup({ name, email, password, phone_number: phone });
      console.log('Signup response:', response);
      authLogin(response.token, response.userId, response.role);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || "Failed to create account. Please try again.");
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
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Create an account</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign up to help save lives during emergencies
            </CardDescription>
            <p className="text-sm text-gray-600">
              Use <span className="font-medium text-red-600">@gov.in</span> email for Driver account or{" "}
              <span className="font-medium text-red-600">@respondr.in</span> for Admin account
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
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    setFieldErrors((prev) => ({ ...prev, name: validateName(val) }));
                  }}
                  required
                  className="h-11 transition-all duration-200 focus:ring-red-500 focus:border-red-500 bg-white"
                />
                {fieldErrors.name && <p className="text-sm text-red-600">{fieldErrors.name}</p>}
              </div>

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
                <Label htmlFor="phone" className="text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPhone(val);
                    setFieldErrors((prev) => ({ ...prev, phone: validatePhone(val) }));
                  }}
                  required
                  className="h-11 transition-all duration-200 focus:ring-red-500 focus:border-red-500 bg-white"
                />
                {fieldErrors.phone && <p className="text-sm text-red-600">{fieldErrors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
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
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-sm text-red-600">{fieldErrors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfirmPassword(val);
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(val) }));
                    }}
                    required
                    className="h-11 transition-all duration-200 focus:ring-red-500 focus:border-red-500 pr-10 bg-white"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <p className="text-sm text-red-600">{fieldErrors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-2 bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2 pb-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-red-600 font-medium hover:text-red-800 hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}