"use client";

import { Department } from "@/types/department.types";
import { forwardRef } from "react";

interface DepartmentSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  departments: Department[];
  error?: string;
}

const DepartmentSelect = forwardRef<HTMLSelectElement, DepartmentSelectProps>(
  ({ departments, error, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <label className="block text-sm font-medium text-gray-700">
          Departamento:
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
            -- Seleccione un departamento --
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={String(dept.id)}>
              {dept.nombre}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  },
);

DepartmentSelect.displayName = "DepartmentSelect";
export default DepartmentSelect;
