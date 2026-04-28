"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP verify dialog state
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const router = useRouter();

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message === "Email not confirmed") {
        // Auto-send OTP then open dialog
        await supabase.auth.resend({ type: "signup", email });
        setUnverifiedEmail(email);
        setResendCooldown(60);
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleVerifyOtp = async () => {
    if (!unverifiedEmail || otp.length !== 6) return;
    const supabase = createClient();
    setOtpLoading(true);
    setOtpError(null);

    const { error } = await supabase.auth.verifyOtp({
      email: unverifiedEmail,
      token: otp,
      type: "signup",
    });

    if (error) {
      setOtpError(error.message);
      setOtpLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleResend = async () => {
    if (!unverifiedEmail || resendCooldown > 0) return;
    const supabase = createClient();
    setResending(true);
    await supabase.auth.resend({ type: "signup", email: unverifiedEmail });
    setResending(false);
    setResendCooldown(60);
    setOtp("");
    setOtpError(null);
  };

  const closeDialog = () => {
    setUnverifiedEmail(null);
    setOtp("");
    setOtpError(null);
    setResendCooldown(0);
  };

  return (
    <>
      <Dialog open={!!unverifiedEmail} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription>
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{unverifiedEmail}</span>.
              Enter it below to confirm your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="grid gap-2">
              <Label htmlFor="otp">Verification code</Label>
              <Input
                id="otp"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center tracking-widest text-lg"
              />
            </div>
            {otpError && <p className="text-sm text-destructive">{otpError}</p>}
            <Button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || otpLoading}
              className="w-full"
            >
              {otpLoading ? "Verifying..." : "Verify"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || resending}
                className="underline underline-offset-4 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resending ? "Sending..." : "Resend"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <PasswordInput
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
