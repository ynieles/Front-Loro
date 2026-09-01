import { CategoryService } from "@/services/category.service";
import { useEffect, useState } from "react";

export interface Category {
  id: number | string;
  nombre: string;
  activo?: boolean;
}

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const response = await CategoryService.getAll({
        activo: true,
        limit: "100",
      });
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error al cargar categorías", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories,
    isLoading,
    refetchCategories: getCategories,
  };
};
