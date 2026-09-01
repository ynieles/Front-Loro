import { EmployeeService } from "@/services/employee.service";
import { Employee } from "@/types/employees.types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useListEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchParameter, setSearchParameter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [totals, setTotals] = useState<{
    all: number;
    activos: number;
    inactivos: number;
  }>({
    all: 0,
    activos: 0,
    inactivos: 0,
  });

  const getEmployees = useCallback(
    async (page: number = currentPage) => {
      setIsLoading(true);

      try {
        const response = await EmployeeService.getAll({
          page: page.toString(),
          search: searchParameter,
          activo: statusFilter === "all" ? undefined : statusFilter === "true",
        });

        setEmployees(response.data);

        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          if (response.pagination.totals) {
            setTotals(response.pagination.totals);
          }
        }
      } catch (error) {
        console.error("Error al cargar empleados", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, searchParameter, statusFilter],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParameter, statusFilter]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      getEmployees(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getEmployees(currentPage);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchParameter, getEmployees, statusFilter]);

  return {
    employees,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParameter,
    setSearchParameter,
    statusFilter,
    setStatusFilter,
    totals,
    refetch: () => getEmployees(currentPage),
  };
};
