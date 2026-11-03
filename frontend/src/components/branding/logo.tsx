import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Dibs logo of a cookie with a face"
      className="h-auto w-auto"
      priority
      width={100}
      height={100}
      sizes="25vw"
    />
  );
}
