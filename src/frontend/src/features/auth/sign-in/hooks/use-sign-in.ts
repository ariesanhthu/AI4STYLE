"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInService } from "../services/sign-in.service";
import type { SignInDto } from "../types/sign-in.types";

export const useSignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (formData: SignInDto) => {
    setIsLoading(true);
    setError(null);

    try {
      await signInService.signIn({
        email: formData.email,
        password: formData.password,
      });

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during sign in";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
    error,
  };
};
