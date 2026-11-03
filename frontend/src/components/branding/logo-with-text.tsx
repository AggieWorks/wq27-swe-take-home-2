import Image from "next/image";
import Link from "next/link";

export default function LogoWithText({ alt }: { alt?: boolean }) {
  return (
    <Link className="" href="/">
      {alt ? (
        <Image
          src="/logo_with_text_alt.svg"
          alt="Dibs Logo"
          className="h-auto w-auto"
          width={92}
          height={24}
          priority
        />
      ) : (
        <Image
          src="/logo_with_text.svg"
          alt="Dibs Logo"
          className="h-auto w-auto"
          width={92}
          height={24}
          priority
        />
      )}
    </Link>
  );
}
