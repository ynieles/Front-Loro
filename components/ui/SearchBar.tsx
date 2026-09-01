"use client";

import { InputHTMLAttributes } from "react";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeValue,
  placeholder = "Buscar...",
  className = "",
  ...props
}: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-72 md:w-80">
      {/* Icono de Lupa */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <i className="bi bi-search text-base" />
      </div>
      {/* Input de Búsqueda */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-green-primary focus:ring-2 focus:ring-green-600/20 pl-10 pr-9 py-2 rounded-xl text-sm text-gray-700 placeholder-gray-400 transition-all outline-none shadow-xs ${className}`}
        {...props}
      />
      {/* Botón para limpiar (Solo se muestra cuando hay texto escrito) */}
      {value && (
        <button
          type="button"
          onClick={() => onChangeValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 transition-colors"
          title="Limpiar búsqueda"
        >
          <i className="bi bi-x-circle-fill text-sm" />
        </button>
      )}
    </div>
  );
}
