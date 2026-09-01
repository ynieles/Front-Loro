"use client";

import Table from "@/components/ui/Table";
import { useModals } from "@/hooks/useModals";
import CreateEmployeeModal from "./components/CreateEmployeeModal";
import { EmployeeFormData } from "./employee.schema";
import { useListEmployee } from "./hooks/useListEmployee";
import { useCreateEmployee } from "./hooks/useCreateEmployee";
import { toast } from "@/components/ui/toast";
import { useEditEmployee } from "./hooks/useEditEmployee";
import { Employee } from "@/types/employees.types";
import EditEmployeeModal from "./components/EditEmployeeModal";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal";
import { Item } from "@/types/models.types";
import { useDeleteEmployee } from "./hooks/useDeleteEmployee";
import { useRestoreEmployee } from "./hooks/useRestoreEmployee";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SearchBar from "@/components/ui/SearchBar";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { useState } from "react";

const columns = [
  { key: "ci", header: "CI", mobile: true },
  { key: "nombre_empleado", header: "Nombre", mobile: false },
  { key: "nombre_departamento", header: "Departamento", mobile: false },
  { key: "nombre_rol", header: "Cargo / Rol", mobile: false },
  {
    key: "activo",
    header: "Estado",
    mobile: false,
    render: (item: Item) => {
      const isActivo = Boolean(item.activo);

      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isActivo
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              isActivo ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          {isActivo ? "Activo" : "Inactivo"}
        </span>
      );
    },
  },
  { key: "actions", header: "Acciones", mobile: true },
];

export default function Employees() {
  const {
    employees,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    refetch,
    searchParameter,
    setSearchParameter,
    statusFilter,
    setStatusFilter,
    totals,
  } = useListEmployee();
  const {
    createEmployee,
    serverError: createServerError,
    clearServerError: clearCreateError,
  } = useCreateEmployee();
  const {
    updateEmployee,
    serverError: editServerError,
    clearServerError: clearEditError,
    selectedEmployee,
    setSelectedEmployee,
  } = useEditEmployee();
  const {
    deleteEmployee,
    isSubmitting: isDeleting,
    serverError: deleteServerError,
    clearServerError: clearDeleteError,
    selectedEmployee: selectDeleteEmployee,
    setSelectedEmployee: setDeleteEmployee,
  } = useDeleteEmployee();

  const {
    restoreEmployee,
    isSubmitting: isRestoring,
    serverError: restoreServerError,
    clearServerError: clearRestoreError,
    selectedEmployee: selectRestoreEmployee,
    setSelectedEmployee: setRestoreEmployee,
  } = useRestoreEmployee();

  const [detailsEmployee, setDetailsEmployee] = useState<Employee | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const { modals, toggleModal } = useModals();

  const handleOpenDetails = (employee: Employee) => {
    setDetailsEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsEmployee(null);
    setIsDetailsOpen(false);
  };

  const handleOpenRegister = () => {
    clearCreateError();
    toggleModal("register", true);
  };

  const handleCloseRegister = () => {
    clearCreateError();
    toggleModal("register", false);
  };

  const handleRegister = async (data: EmployeeFormData) => {
    const success = await createEmployee(data);
    if (success) {
      refetch();
      handleCloseRegister();
      toast.add({
        title: "Empleado registrado",
        description: "El empleado ha sido guardado exitosamente.",
        type: "success",
      });
    }
  };

  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    clearEditError();
    toggleModal("edit", true);
  };

  const handleCloseEdit = () => {
    setSelectedEmployee(null);
    clearEditError();
    toggleModal("edit", false);
  };

  const handleUpdate = async (id: string | number, data: EmployeeFormData) => {
    const success = await updateEmployee(id, data);
    if (success) {
      refetch();
      handleCloseEdit();
      toast.add({
        title: "Empleado actualizado",
        description: "Los cambios han sido guardados correctamente.",
        type: "success",
      });
    }
  };

  const handleOpenDelete = (employee: Employee) => {
    setDeleteEmployee(employee);
    clearDeleteError();
    toggleModal("delete", true);
  };

  const handleCloseDelete = () => {
    setDeleteEmployee(null);
    clearDeleteError();
    toggleModal("delete", false);
  };

  const handleDeleteConfirm = async (id: string | number, reason?: string) => {
    const success = await deleteEmployee(id, reason || "");
    if (success) {
      refetch();
      handleCloseDelete();
      toast.add({
        title: "Empleado eliminado",
        description: "El empleado ha sido desactivado.",
        type: "success",
      });
    }
  };

  const handleOpenRestore = (employee: Employee) => {
    setRestoreEmployee(employee);
    clearRestoreError();
    toggleModal("restore", true);
  };

  const handleCloseRestore = () => {
    setRestoreEmployee(null);
    clearRestoreError();
    toggleModal("restore", false);
  };

  const handleRestoreConfirm = async (id: string | number) => {
    const success = await restoreEmployee(id);
    if (success) {
      refetch();
      handleCloseRestore();
      toast.add({
        title: "Empleado restaurado",
        description: "El empleado ha sido activado",
        type: "success",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-800 font-semibold tracking-wide">
            Gestión de Empleados
          </h1>
        </div>
        <div>
          <button
            className="bg-green-primary hover:bg-green-hover shadow-sm px-2 py-2 rounded-md text-white font-semibold flex gap-2 items-center cursor-pointer transition-colors"
            onClick={handleOpenRegister}
          >
            <i className="bi bi-person-add text-xl" />
            Nuevo
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center shadow-xs justify-between gap-4 bg-white p-2 border border-gray-200 rounded-xl">
        <div className="inline-flex items-center p-1 bg-gray-100/80 rounded-xl border border-gray-200/80 w-full sm:w-auto">
          {/* TODOS */}
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "all"
                ? "bg-white text-gray-800 shadow-xs"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>Todos</span>
            <span className="px-1.5 py-0.5 rounded-full bg-gray-200/70 text-[10px] text-gray-600 font-bold">
              {totals.all}
            </span>
          </button>
          {/* ACTIVOS */}
          <button
            type="button"
            onClick={() => setStatusFilter("true")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "true"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Activos</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100/80 text-[10px] text-emerald-800 font-bold">
              {totals.activos}
            </span>
          </button>
          {/* INACTIVOS */}
          <button
            type="button"
            onClick={() => setStatusFilter("false")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "false"
                ? "bg-white text-red-700 shadow-xs"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="size-1.5 rounded-full bg-red-500" />
            <span>Inactivos</span>
            <span className="px-1.5 py-0.5 rounded-full bg-red-100/80 text-[10px] text-red-800 font-bold">
              {totals.inactivos}
            </span>
          </button>
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          <SearchBar
            value={searchParameter}
            onChangeValue={setSearchParameter}
            placeholder="Buscar por nombre o CI..."
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <Table
            columns={columns}
            data={employees}
            onView={(item) => handleOpenDetails(item as Employee)}
            onEdit={(item) => handleOpenEdit(item as Employee)}
            onDelete={(item) => handleOpenDelete(item as Employee)}
            onRestore={(item) => handleOpenRestore(item as Employee)}
          />
        )}

        <div className="flex items-center justify-between bg-gray-50/50 px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Página{" "}
            <span className="font-medium text-gray-700">{currentPage}</span> de{" "}
            <span className="font-medium text-gray-700">{totalPages}</span>
          </span>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Anterior
            </button>
            <button
              className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || isLoading}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
      <CreateEmployeeModal
        onRegister={handleRegister}
        isOpen={modals.register}
        onClose={handleCloseRegister}
        serverError={createServerError || undefined}
      />

      <EditEmployeeModal
        onUpdate={handleUpdate}
        isOpen={modals.edit}
        onClose={handleCloseEdit}
        selectedEmployee={selectedEmployee}
        serverError={editServerError || undefined}
      />

      <EmployeeDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        employee={detailsEmployee}
      />

      <ConfirmModal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        onConfirm={(reason) =>
          selectDeleteEmployee &&
          handleDeleteConfirm(String(selectDeleteEmployee.id), reason)
        }
        title="Eliminar Empleado"
        message={
          <p>
            ¿Estás seguro de que deseas eliminar a{" "}
            <span className="font-semibold text-gray-800">
              {selectDeleteEmployee?.nombre_empleado}
            </span>
            ? Su estado pasará a inactivo.
          </p>
        }
        confirmText="Eliminar"
        variant="danger"
        isSubmitting={isDeleting}
        serverError={deleteServerError || undefined}
        showReasonInput={true}
        reasonLabel="Motivo de desactivación"
        reasonPlaceholder="Ingrese la razón por la cual desactiva este empleado..."
      />

      <ConfirmModal
        isOpen={modals.restore}
        onClose={handleCloseRestore}
        onConfirm={() =>
          selectRestoreEmployee &&
          handleRestoreConfirm(String(selectRestoreEmployee.id))
        }
        title="Restaurar Empleado"
        message={
          <p>
            ¿Estás seguro de que deseas restaurar a{" "}
            <span className="font-semibold text-gray-800">
              {selectRestoreEmployee?.nombre_empleado}
            </span>
            ? Su estado pasará a activo.
          </p>
        }
        confirmText="Restaurar"
        variant="success"
        isSubmitting={isRestoring}
        serverError={restoreServerError || undefined}
      />
    </div>
  );
}

