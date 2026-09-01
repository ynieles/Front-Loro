import { RoleService } from "@/services/role.service";
import { Role } from "@/types/roles.types";
import { useEffect, useState } from "react";

export const useRole = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getRoles = async () => {
    setIsLoading(true);
    try {
      const response = await RoleService.getAll({
        activo: true,
        limit: "100",
      });

      setRoles(response.data || []);
    } catch (error) {
      console.error("Error al cargar roles", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  return {
    roles,
    isLoading,
    refetchRoles: getRoles,
  };
};
