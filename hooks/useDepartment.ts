import { DepartmentService } from "@/services/department.service";
import { Department } from "@/types/department.types";
import { useEffect, useState } from "react";

export const useDepartment = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDepartments = async () => {
    setIsLoading(true);
    try {
      const response = await DepartmentService.getAll({
        activo: true,
        limit: "100",
      });
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error al cargar departamentos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  return {
    departments,
    isLoading,
    refetchDepartments: getDepartments,
  };
};
