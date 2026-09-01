"use client";

import { Category } from "@/hooks/useCategory";
import { forwardRef } from "react";

interface CategorySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  categories: Category[];
  error?: string;
}

const CategorySelect = forwardRef<HTMLSelectElement, CategorySelectProps>(
  ({ categories, error, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <label className="block text-sm font-medium text-gray-700">
          Categoría:
        </label>
        <select
          ref={ref}
          className={`w-full bg-gray-50 border ${
            error
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-200 focus:border-green-primary focus:ring-green-600/20"
          } px-3 py-2 rounded-md transition-all outline-none text-sm`}
          {...props}
        >
          <option value="" disabled>
            -- Seleccione una categoría --
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  },
);

CategorySelect.displayName = "CategorySelect";
export default CategorySelect;
