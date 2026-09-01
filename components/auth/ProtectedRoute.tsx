"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.replace("/");
      return;
    }

    if (user) {
      if (allowedRoles && allowedRoles.length > 0) {
        const userRoleLower = (user.rol || "").toLowerCase().trim();
        const hasAccess = allowedRoles.some(
          (role) => role.toLowerCase().trim() === userRoleLower,
        );

        if (!hasAccess) {
          router.replace("/dashboard");
          return;
        }
      }

      setIsAuthorized(true);
    }
  }, [user, allowedRoles, router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner className="size-8 text-green-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
