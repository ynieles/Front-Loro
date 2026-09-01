"use client";

import Table from "@/components/ui/Table";
import { useModals } from "@/hooks/useModals";
import { useListRole } from "./hooks/useListRole";
import { useCreateRole } from "./hooks/useCreateRole";
import { useEditRole } from "./hooks/useEditRole";
import { useDeleteRole } from "./hooks/useDeleteRole";
import { useRestoreRole } from "./hooks/useRestoreRole";

import { RoleFormData } from "./role.schema";
import { Role } from "@/types/roles.types";
import { toast } from "@/components/ui/toast";
import { Item } from "@/types/models.types";

import CreateRoleModal from "./components/CreateRoleModal";
import EditRoleModal from "./components/EditRoleModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SearchBar from "@/components/ui/SearchBar";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const columns = [
  { key: "nombre_rol", header: "Cargo / Rol", mobile: true },
  { key: "nombre_departamento", header: "Departamento", mobile: false },
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

export default function Roles() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <RolesContent />
    </ProtectedRoute>
  );

  function RolesContent() {
    const {
      roles,
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
    } = useListRole();

    const {
      createRole,
      serverError: createServerError,
      clearServerError: clearCreateError,
    } = useCreateRole();

    const {
      updateRole,
      serverError: editServerError,
      clearServerError: clearEditError,
      selectedRole,
      setSelectedRole,
    } = useEditRole();

    const {
      deleteRole,
      isSubmitting: isDeleting,
      serverError: deleteServerError,
      clearServerError: clearDeleteError,
      selectedRole: selectDeleteRole,
      setSelectedRole: setDeleteRole,
    } = useDeleteRole();

    const {
      restoreRole,
      isSubmitting: isRestoring,
      serverError: restoreServerError,
      clearServerError: clearRestoreError,
      selectedRole: selectRestoreRole,
      setSelectedRole: setRestoreRole,
    } = useRestoreRole();

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

    const handleRegister = async (data: RoleFormData) => {
      const success = await createRole(data);
      if (success) {
        refetch();
        handleCloseRegister();
        toast.add({
          title: "Cargo registrado",
          description: "El cargo/rol ha sido guardado exitosamente.",
          type: "success",
        });
      }
    };

    // Handlers Edición
    const handleOpenEdit = (roleItem: Role) => {
      setSelectedRole(roleItem);
      clearEditError();
      toggleModal("edit", true);
    };

    const handleCloseEdit = () => {
      setSelectedRole(null);
      clearEditError();
      toggleModal("edit", false);
    };

    const handleUpdate = async (id: string | number, data: RoleFormData) => {
      const success = await updateRole(id, data);
      if (success) {
        refetch();
        handleCloseEdit();
        toast.add({
          title: "Cargo actualizado",
          description: "Los cambios han sido guardados correctamente.",
          type: "success",
        });
      }
    };

    // Handlers Eliminación
    const handleOpenDelete = (roleItem: Role) => {
      setDeleteRole(roleItem);
      clearDeleteError();
      toggleModal("delete", true);
    };

    const handleCloseDelete = () => {
      setDeleteRole(null);
      clearDeleteError();
      toggleModal("delete", false);
    };

    const handleDeleteConfirm = async (id: string | number) => {
      const success = await deleteRole(id);
      if (success) {
        refetch();
        handleCloseDelete();
        toast.add({
          title: "Cargo eliminado",
          description: "El cargo ha sido desactivado.",
          type: "success",
        });
      }
    };

    // Handlers Restauración
    const handleOpenRestore = (roleItem: Role) => {
      setRestoreRole(roleItem);
      clearRestoreError();
      toggleModal("restore", true);
    };

    const handleCloseRestore = () => {
      setRestoreRole(null);
      clearRestoreError();
      toggleModal("restore", false);
    };

    const handleRestoreConfirm = async (id: string | number) => {
      const success = await restoreRole(id);
      if (success) {
        refetch();
        handleCloseRestore();
        toast.add({
          title: "Cargo restaurado",
          description: "El cargo ha sido activado.",
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
              Gestión de Cargos / Roles
            </h1>
          </div>
          <div>
            <button
              className="bg-green-primary hover:bg-green-hover shadow-sm px-3 py-2 rounded-md text-white font-semibold flex gap-2 items-center cursor-pointer transition-colors"
              onClick={handleOpenRegister}
            >
              <i className="bi bi-plus text-xl" />
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
              placeholder="Buscar por cargo o departamento..."
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
              data={roles}
              onEdit={(item) => handleOpenEdit(item as Role)}
              onDelete={(item) => handleOpenDelete(item as Role)}
              onRestore={(item) => handleOpenRestore(item as Role)}
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
        <CreateRoleModal
          isOpen={modals.register}
          onClose={handleCloseRegister}
          onRegister={handleRegister}
          serverError={createServerError || undefined}
        />

        <EditRoleModal
          isOpen={modals.edit}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
          selectedRole={selectedRole}
          serverError={editServerError || undefined}
        />

        <ConfirmModal
          isOpen={modals.delete}
          onClose={handleCloseDelete}
          onConfirm={() =>
            selectDeleteRole?.id != null &&
            handleDeleteConfirm(String(selectDeleteRole.id))
          }
          title="Eliminar Cargo / Rol"
          message={
            <p>
              ¿Estás seguro de que deseas eliminar el cargo{" "}
              <span className="font-semibold text-gray-800">
                {selectDeleteRole?.nombre_rol}
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
            selectRestoreRole?.id != null &&
            handleRestoreConfirm(String(selectRestoreRole.id))
          }
          title="Restaurar Cargo / Rol"
          message={
            <p>
              ¿Estás seguro de que deseas restaurar el cargo{" "}
              <span className="font-semibold text-gray-800">
                {selectRestoreRole?.nombre_rol}
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
