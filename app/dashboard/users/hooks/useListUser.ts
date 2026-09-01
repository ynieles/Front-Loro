import { UserService } from "@/services/user.service";
import { User } from "@/types/users.types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useListUser = () => {
  const [users, setUsers] = useState<User[]>([]);
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

  const getUsers = useCallback(
    async (page: number = currentPage) => {
      setIsLoading(true);

      try {
        const response = await UserService.getAll({
          limit: "5",
          page: page.toString(),
          search: searchParameter,
          activo: statusFilter === "all" ? undefined : statusFilter === "true",
        });

        setUsers(response.data || []);

        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          if (response.pagination.totals) {
            setTotals(response.pagination.totals);
          }
        }
      } catch (error) {
        console.error("Error al cargar usuarios", error);
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
      getUsers(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getUsers(currentPage);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchParameter, getUsers, statusFilter]);

  return {
    users,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParameter,
    setSearchParameter,
    statusFilter,
    setStatusFilter,
    totals,
    refetch: () => getUsers(currentPage),
  };
};
