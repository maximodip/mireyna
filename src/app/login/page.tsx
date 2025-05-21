import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/auth";
import LoginForm from "@/components/login-form";

export default async function Home() {
  const userRole = await getUserRole();

  if (userRole === "admin") {
    redirect("/dashboard");
  }

  return (
    <section className="flex mt-32 flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Panel de administración</h1>
          <p className="text-muted-foreground">
            Inicia sesión para acceder al panel de administración
          </p>
        </div>
        <LoginForm />
      </div>
    </section>
  );
}
