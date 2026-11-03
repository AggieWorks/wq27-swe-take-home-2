"use client";

import { useRouter } from "next/navigation";

import { appEnv } from "@/lib/env";


const SigninButton = () => {
  const router = useRouter();

  const handleLoginButton = () => {
    router.push(`${appEnv.BASE_API_URL}/api/auth/google`);
  };

  return (
    <button onClick={handleLoginButton} className="flex items-center justify-center flex-row gap-2 rounded-full border border-primary bg-white hover:bg-[#F2F2F2] px-6 py-[6px]">
      <p className="h-[20px] text-center whitespace-nowrap text-base font-semibold text-t-dark">
        Sign In
      </p>
    </button>
  );
};

export default SigninButton;
