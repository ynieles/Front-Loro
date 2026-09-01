import { DeviceService } from "@/services/device.service";
import { Device } from "@/types/devices.types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useListDevice = () => {
  const [devices, setDevices] = useState<Device[]>([]);
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

  const getDevices = useCallback(
    async (page: number = currentPage) => {
      setIsLoading(true);

      try {
        const response = await DeviceService.getAll({
          page: page.toString(),
          search: searchParameter,
          activo: statusFilter === "all" ? undefined : statusFilter === "true",
        });

        setDevices(response.data || []);

        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          if (response.pagination.totals) {
            setTotals(response.pagination.totals);
          }
        }
      } catch (error) {
        console.error("Error al cargar equipos", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, searchParameter, statusFilter]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParameter, statusFilter]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      getDevices(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getDevices(currentPage);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchParameter, getDevices, statusFilter]);

  return {
    devices,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParameter,
    setSearchParameter,
    statusFilter,
    setStatusFilter,
    totals,
    refetch: () => getDevices(currentPage),
  };
};
