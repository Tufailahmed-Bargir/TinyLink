 
import LoginPage from "@/components/loginPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession();
  if (session?.user?.name) {
    redirect("/");
  }
  return (
    <>
      <LoginPage />
    </>
  );
}
