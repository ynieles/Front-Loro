import { AssignmentService } from "@/services/assignment.service";
import { Assignment } from "@/types/assignment.types";
import { useCallback, useEffect, useRef, useState } from "react";
export const useListAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchParameter, setSearchParameter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("true");
  const [totals, setTotals] = useState<{
    all: number;
    activos: number;
    inactivos: number;
  }>({
    all: 0,
    activos: 0,
    inactivos: 0,
  });
  const getAssignments = useCallback(
    async (page: number = currentPage) => {
      setIsLoading(true);
      try {
        const response = await AssignmentService.getAll({
          page: page.toString(),
          search: searchParameter,
          activo: statusFilter === "all" ? undefined : statusFilter === "true",
        });
        setAssignments(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          if (response.pagination.totals) {
            setTotals(response.pagination.totals);
          }
        }
      } catch (error) {
        console.error("Error al cargar asignaciones", error);
        setAssignments([]);
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
      getAssignments(currentPage);
      isFirstRender.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      getAssignments(currentPage);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [currentPage, searchParameter, getAssignments, statusFilter]);
  return {
    assignments,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParameter,
    setSearchParameter,
    statusFilter,
    setStatusFilter,
    totals,
    refetch: () => getAssignments(currentPage),
  };
};
