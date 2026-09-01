"use client";

import HasRole from "@/components/auth/HasRole";
import { AuthService } from "@/services/auth.service";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${
      isActive
        ? "bg-yellow-primary text-yellow-800 shadow-sm"
        : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-800"
    }`;
  };

  return (
    <>
      {/* 1. BOTÓN HAMBURGUESA MÓVIL */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-6 py-2 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-loro.jpeg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-lg object-contain"
          />
          <span className="font-bold text-green-800">Inventario</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none p-2 rounded-lg hover:bg-gray-100"
        >
          {isOpen ? (
            <i className="bi bi-x-lg text-2xl"></i>
          ) : (
            <i className="bi bi-list text-2xl"></i>
          )}
        </button>
      </div>
      {/* 2. OVERLAY MÓVIL */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}
      {/* 3. BARRA LATERAL (SIDEBAR) */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col justify-between bg-white border-r border-gray-200 shadow-sm tracking-wide h-screen
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20 p-3" : "w-64 p-6"}
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* SECCIÓN SUPERIOR */}
        <div className="flex flex-col gap-8">
          {/* Encabezado y botón de colapsar */}
          <div
            className={`flex items-center flex-col-reverse ${
              isCollapsed ? "justify-center" : "justify-between"
            } mt-2 lg:mt-0 border-b border-gray-100 pb-4`}
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 shrink-0">
                <Image
                  src="/logo-loro.jpeg"
                  alt="Logo de la Empresa"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                  priority
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-green-800 leading-tight">
                    Inventario
                  </span>
                  <span className="text-gray-400 text-xs font-medium whitespace-nowrap">
                    Distribuidora El Loro
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Menú de navegación principal */}
          <nav
            className="flex flex-col gap-1.5"
            onClick={() => setIsOpen(false)}
          >
            <Link
              href="/dashboard"
              className={getLinkClass("/dashboard")}
              title={isCollapsed ? "Inicio" : ""}
            >
              <i className="bi bi-house text-lg shrink-0" />
              {!isCollapsed && <span>Inicio</span>}
            </Link>
            <Link
              href="/dashboard/employees"
              className={getLinkClass("/dashboard/employees")}
              title={isCollapsed ? "Empleados" : ""}
            >
              <i className="bi bi-people text-lg shrink-0" />
              {!isCollapsed && <span>Empleados</span>}
            </Link>
            <HasRole roles={["admin"]}>
              <Link
                href="/dashboard/departments"
                className={getLinkClass("/dashboard/departments")}
                title={isCollapsed ? "Departamentos" : ""}
              >
                <i className="bi bi-building text-lg shrink-0" />
                {!isCollapsed && <span>Departamentos</span>}
              </Link>
            </HasRole>
            <HasRole roles={["admin"]}>
              <Link
                href="/dashboard/roles"
                className={getLinkClass("/dashboard/roles")}
                title={isCollapsed ? "Cargos" : ""}
              >
                <i className="bi bi-briefcase text-lg shrink-0" />
                {!isCollapsed && <span>Cargos</span>}
              </Link>
            </HasRole>
            <HasRole roles={["admin"]}>
              <Link
                href="/dashboard/categories"
                className={getLinkClass("/dashboard/categories")}
                title={isCollapsed ? "Categorías" : ""}
              >
                <i className="bi bi-tags text-lg shrink-0" />
                {!isCollapsed && <span>Categorías</span>}
              </Link>
            </HasRole>
            <Link
              href="/dashboard/devices"
              className={getLinkClass("/dashboard/devices")}
              title={isCollapsed ? "Equipos" : ""}
            >
              <i className="bi bi-laptop text-lg shrink-0" />
              {!isCollapsed && <span>Equipos</span>}
            </Link>
            <Link
              href="/dashboard/assignments"
              className={getLinkClass("/dashboard/assignments")}
              title={isCollapsed ? "Asignaciones" : ""}
            >
              <i className="bi bi-clipboard-check text-lg shrink-0" />
              {!isCollapsed && <span>Asignaciones</span>}
            </Link>

            <HasRole roles={["admin"]}>
              <Link
                href="/dashboard/users"
                className={getLinkClass("/dashboard/users")}
                title={isCollapsed ? "Usuarios" : ""}
              >
                <i className="bi bi-person text-lg shrink-0" />
                {!isCollapsed && <span>Usuarios</span>}
              </Link>
            </HasRole>
          </nav>
        </div>
        {/* SECCIÓN INFERIOR: Cerrar Sesión */}
        <div className="pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={AuthService.logout}
            className={`flex items-center gap-3 cursor-pointer ${
              isCollapsed ? "justify-center px-2 py-3" : "px-4 py-3"
            } rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors text-sm w-full`}
            title={isCollapsed ? "Cerrar Sesión" : ""}
          >
            <i className="bi bi-box-arrow-right text-lg shrink-0" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
