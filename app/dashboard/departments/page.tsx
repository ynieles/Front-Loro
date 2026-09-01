"use client";

import Table from "@/components/ui/Table";
import { useModals } from "@/hooks/useModals";
import { useCreateDepartment } from "./hooks/useCreateDepartment";
import { useListDepartment } from "./hooks/useListDepartment";
import { useEditDepartment } from "./hooks/useEditDepartment";
import { useDeleteDepartment } from "./hooks/useDeleteDepartment";
import { useRestoreDepartment } from "./hooks/useRestoreDepartment";

import { DepartmentFormData } from "./department.shcema";
import { Department } from "@/types/department.types";
import { toast } from "@/components/ui/toast";

import CreateDepartmentModal from "./components/CreateDepartmentModal";
import EditDepartmentModal from "./components/EditDepartmentModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SearchBar from "@/components/ui/SearchBar";
import { Item } from "@/types/models.types";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const columns = [
  { key: "nombre", header: "Nombre", mobile: true },
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
              isActivo ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            }`}
          />
          {isActivo ? "Activo" : "Inactivo"}
        </span>
      );
    },
  },
  { key: "actions", header: "Acciones", mobile: true },
];

export default function Departments() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DepartmentsContent />
    </ProtectedRoute>
  );

  function DepartmentsContent() {
    const {
      departments,
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
    } = useListDepartment();

    const {
      createDepartment,
      serverError: createServerError,
      clearServerError: clearCreateError,
    } = useCreateDepartment();

    const {
      updateDepartment,
      serverError: editServerError,
      clearServerError: clearEditError,
      selectedDepartment,
      setSelectedDepartment,
    } = useEditDepartment();

    const {
      deleteDepartment,
      isSubmitting: isDeleting,
      serverError: deleteServerError,
      clearServerError: clearDeleteError,
      selectedDepartment: selectDeleteDepartment,
      setSelectedDepartment: setDeleteDepartment,
    } = useDeleteDepartment();

    const {
      restoreDepartment,
      isSubmitting: isRestoring,
      serverError: restoreServerError,
      clearServerError: clearRestoreError,
      selectedDepartment: selectRestoreDepartment,
      setSelectedDepartment: setRestoreDepartment,
    } = useRestoreDepartment();

    const { toggleModal, modals } = useModals();

    // Handlers Registro
    const handleOpenRegister = () => {
      clearCreateError();
      toggleModal("register", true);
    };

    const handleCloseRegister = () => {
      clearCreateError();
      toggleModal("register", false);
    };

    const handleRegister = async (data: DepartmentFormData) => {
      const success = await createDepartment(data);
      if (success) {
        refetch();
        handleCloseRegister();
        toast.add({
          title: "Departamento registrado",
          description: "El departamento ha sido guardado exitosamente.",
          type: "success",
        });
      }
    };

    // Handlers Edición
    const handleOpenEdit = (dept: Department) => {
      setSelectedDepartment(dept);
      clearEditError();
      toggleModal("edit", true);
    };

    const handleCloseEdit = () => {
      setSelectedDepartment(null);
      clearEditError();
      toggleModal("edit", false);
    };

    const handleUpdate = async (
      id: string | number,
      data: DepartmentFormData,
    ) => {
      const success = await updateDepartment(id, data);
      if (success) {
        refetch();
        handleCloseEdit();
        toast.add({
          title: "Departamento actualizado",
          description: "Los cambios han sido guardados correctamente.",
          type: "success",
        });
      }
    };

    // Handlers Eliminación
    const handleOpenDelete = (dept: Department) => {
      setDeleteDepartment(dept);
      clearDeleteError();
      toggleModal("delete", true);
    };

    const handleCloseDelete = () => {
      setDeleteDepartment(null);
      clearDeleteError();
      toggleModal("delete", false);
    };

    const handleDeleteConfirm = async (id: string | number) => {
      const success = await deleteDepartment(id);
      if (success) {
        refetch();
        handleCloseDelete();
        toast.add({
          title: "Departamento eliminado",
          description: "El departamento ha sido desactivado.",
          type: "success",
        });
      }
    };

    // Handlers Restauración
    const handleOpenRestore = (dept: Department) => {
      setRestoreDepartment(dept);
      clearRestoreError();
      toggleModal("restore", true);
    };

    const handleCloseRestore = () => {
      setRestoreDepartment(null);
      clearRestoreError();
      toggleModal("restore", false);
    };

    const handleRestoreConfirm = async (id: string | number) => {
      const success = await restoreDepartment(id);
      if (success) {
        refetch();
        handleCloseRestore();
        toast.add({
          title: "Departamento restaurado",
          description: "El departamento ha sido activado.",
          type: "success",
        });
      }
    };

    return (
      <div className="space-y-4">
        {/* 1. Cabecera */}
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-800 font-semibold tracking-wide">
              Gestión de Departamentos
            </h1>
          </div>
          <div>
            <button
              className="bg-green-primary hover:bg-green-hover shadow-sm px-3 py-2 rounded-md text-white font-semibold flex gap-2 items-center cursor-pointer transition-colors"
              onClick={handleOpenRegister}
            >
              <i className="bi bi-building-add text-xl" />
              Nuevo
            </button>
          </div>
        </div>

        {/* 2. Barra de Filtros y Búsqueda */}
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
              placeholder="Buscar por departamento..."
            />
          </div>
        </div>

        {/* 3. Tabla */}
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
          {isLoading ? (
            <SkeletonTable />
          ) : (
            <Table
              columns={columns}
              data={departments}
              onEdit={(item) => handleOpenEdit(item as Department)}
              onDelete={(item) => handleOpenDelete(item as Department)}
              onRestore={(item) => handleOpenRestore(item as Department)}
            />
          )}

          <div className="flex items-center justify-between bg-gray-50/50 px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Página{" "}
              <span className="font-medium text-gray-700">{currentPage}</span>{" "}
              de <span className="font-medium text-gray-700">{totalPages}</span>
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

        {/* 4. Modales */}
        <CreateDepartmentModal
          isOpen={modals.register}
          onClose={handleCloseRegister}
          onRegister={handleRegister}
          serverError={createServerError || undefined}
        />

        <EditDepartmentModal
          isOpen={modals.edit}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
          selectedDepartment={selectedDepartment}
          serverError={editServerError || undefined}
        />

        <ConfirmModal
          isOpen={modals.delete}
          onClose={handleCloseDelete}
          onConfirm={() =>
            selectDeleteDepartment?.id != null &&
            handleDeleteConfirm(String(selectDeleteDepartment.id))
          }
          title="Eliminar Departamento"
          message={
            <p>
              ¿Estás seguro de que deseas eliminar el departamento{" "}
              <span className="font-semibold text-gray-800">
                {selectDeleteDepartment?.nombre}
              </span>
              ? Su estado pasará a inactivo.
            </p>
          }
          confirmText="Eliminar"
          variant="danger"
          isSubmitting={isDeleting}
          serverError={deleteServerError || undefined}
        />

        <ConfirmModal
          isOpen={modals.restore}
          onClose={handleCloseRestore}
          onConfirm={() =>
            selectRestoreDepartment?.id != null &&
            handleRestoreConfirm(String(selectRestoreDepartment.id))
          }
          title="Restaurar Departamento"
          message={
            <p>
              ¿Estás seguro de que deseas restaurar el departamento{" "}
              <span className="font-semibold text-gray-800">
                {selectRestoreDepartment?.nombre}
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
}
