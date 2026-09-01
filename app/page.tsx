"use client";

import { useLogin } from "@/hooks/useLogin";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "./login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/services/auth.service";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, isSubmitting, serverError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    const success = await loginUser(data);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col space-y-5 justify-center items-center min-h-screen p-4 bg-gray-50/50">
      <div className="flex flex-col justify-center items-center text-center">
        <div className="mb-4 shadow-sm p-3 rounded-2xl bg-white border border-gray-100">
          <Image
            src="/logo-loro.jpeg"
            alt="Logo de la Empresa"
            width={120}
            height={40}
            priority
          />
        </div>
        <div className="flex flex-col text-center gap-1">
          <h1 className="text-3xl font-bold text-green-800 tracking-wide">
            Inventario
          </h1>
          <h2 className="text-base font-medium text-gray-500">
            Administración de Dispositivos
          </h2>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 shadow-lg w-full max-w-md bg-white rounded-2xl space-y-5 border border-gray-100"
      >
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-700"
          >
            Correo Electrónico
          </label>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <i className="bi bi-envelope text-lg" />
            </span>
            <input
              {...register("email")}
              type="email"
              placeholder="admin@ejemplo.com"
              disabled={isSubmitting}
              className={`w-full bg-gray-50 border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-green-primary focus:ring-green-600/20"
              } focus:bg-white focus:ring-2 outline-none pl-11 pr-4 py-3 rounded-xl text-sm transition-all`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 font-medium mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>
        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-gray-700"
          >
            Contraseña
          </label>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <i className="bi bi-lock text-lg" />
            </span>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full bg-gray-50 border ${
                errors.password
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-green-primary focus:ring-green-600/20"
              } focus:bg-white focus:ring-2 outline-none pl-11 pr-4 py-3 rounded-xl text-sm transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-lg`}
              />
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 font-medium mt-0.5">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2.5">
            <i className="bi bi-exclamation-triangle-fill text-base shrink-0 text-red-500" />
            <span>{serverError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-primary hover:bg-green-hover text-white font-medium py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Spinner className="size-5 text-white" />
              <span>Iniciando Sesión...</span>
            </>
          ) : (
            <>
              <span>Iniciar Sesión</span>
              <i className="bi bi-box-arrow-in-right text-xl" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
