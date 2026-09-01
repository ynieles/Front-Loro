import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/category.types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useListCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
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

  const getCategories = useCallback(
    async (page: number = currentPage) => {
      setIsLoading(true);

      try {
        const response = await CategoryService.getAll({
          page: page.toString(),
          search: searchParameter,
          activo: statusFilter === "all" ? undefined : statusFilter === "true",
        });

        setCategories(response.data || []);

        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          if (response.pagination.totals) {
            setTotals(response.pagination.totals);
          }
        }
      } catch (error) {
        console.error("Error al cargar categorías", error);
        setCategories([]);
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
      getCategories(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getCategories(currentPage);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchParameter, getCategories, statusFilter]);

  return {
    categories,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParameter,
    setSearchParameter,
    statusFilter,
    setStatusFilter,
    totals,
    refetch: () => getCategories(currentPage),
  };
};
