import { redirect } from "next/navigation";

import { getUser } from "@/actions/user";

export default async function ProfilePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser(true);

  if (!user) {
    console.log("Redirecting to /");
    return redirect("/");
  }

  return children;
}
