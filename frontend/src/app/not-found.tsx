import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main
      id="error-page"
      className="fullscreen-minus-header flex flex-col items-center justify-center gap-10"
    >
      <h1 className="text-[1.75rem] font-semibold">Page Not Found</h1>
      <Image src="/not_found.svg" alt="" width={330} height={92} priority />
      <Link href="/" className="font-semibold text-t-secondary hover:underline">
        Back to home
      </Link>
    </main>
  );
}
