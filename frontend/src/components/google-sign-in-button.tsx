import Image from "next/image";
import { useRouter } from "next/navigation";

import GoogleSignInSVG from "@/assets/svg/google-sign-in-button.svg";
import { appEnv } from "@/lib/env";

export default function GoogleSignInButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`${appEnv.BASE_API_URL}/api/auth/google`)}
    >
      <Image src={GoogleSignInSVG} alt="Google Sign In Button" />
    </button>
  );
}
