"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ReactNode } from "react";

interface HasRoleProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function HasRole({
  roles,
  children,
  fallback = null,
}: HasRoleProps) {
  const { user } = useCurrentUser();

  if (!user || !user.rol) {
    return <>{fallback}</>;
  }

  const userRoleLower = user.rol.toLowerCase().trim();
  const hasAccess = roles.some(
    (role) => role.toLowerCase().trim() === userRoleLower,
  );

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
