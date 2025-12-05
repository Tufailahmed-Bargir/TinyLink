"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", { redirect: false });
      if (result?.error) {
        console.error("Authentication error:", result.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Unexpected error during authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-2"
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin" />
              ) : (
                <Chrome className="w-5 h-5" />
              )}
              <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
