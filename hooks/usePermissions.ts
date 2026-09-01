import { useCurrentUser } from "./useCurrentUser";

export const usePermissions = () => {
  const { user } = useCurrentUser();

  const hasRole = (...allowedRoles: string[]): boolean => {
    if (!user || !user.rol) return false;
    const userRoleLower = user.rol.toLowerCase().trim();
    return allowedRoles.some(
      (role) => role.toLowerCase().trim() === userRoleLower,
    );
  };

  const isAdmin = hasRole("admin", "administrador");

  return {
    user,
    role: user?.rol,
    hasRole,
    isAdmin,
  };
};
