"use client";

import Table from "@/components/ui/Table";
import { useModals } from "@/hooks/useModals";
import { useListUser } from "./hooks/useListUser";
import { useCreateUser } from "./hooks/useCreateUser";
import { useEditUser } from "./hooks/useEditUser";
import { useUpdatePassword } from "./hooks/useUpdatePassword";
import { useDeleteUser } from "./hooks/useDeleteUser";
import { useRestoreUser } from "./hooks/useRestoreUser";

import {
  CreateUserFormData,
  EditUserFormData,
  UpdatePasswordFormData,
} from "./user.schema";
import { User } from "@/types/users.types";
import { toast } from "@/components/ui/toast";
import { Item } from "@/types/models.types";

import CreateUserModal from "./components/CreateUserModal";
import EditUserModal from "./components/EditUserModal";
import UpdatePasswordModal from "./components/UpdatePasswordModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SearchBar from "@/components/ui/SearchBar";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Users() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <UsersContent />
    </ProtectedRoute>
  );
}

function UsersContent() {
  const {
    users,
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
  } = useListUser();

  const {
    createUser,
    serverError: createServerError,
    clearServerError: clearCreateError,
  } = useCreateUser();

  const {
    updateUser,
    serverError: editServerError,
    clearServerError: clearEditError,
    selectedUser: selectedEditUser,
    setSelectedUser: setSelectedEditUser,
  } = useEditUser();

  const {
    updatePassword,
    serverError: passwordServerError,
    clearServerError: clearPasswordError,
    selectedUser: selectedPasswordUser,
    setSelectedUser: setSelectedPasswordUser,
  } = useUpdatePassword();

  const {
    deleteUser,
    isSubmitting: isDeleting,
    serverError: deleteServerError,
    clearServerError: clearDeleteError,
    selectedUser: selectDeleteUser,
    setSelectedUser: setDeleteUser,
  } = useDeleteUser();

  const {
    restoreUser,
    isSubmitting: isRestoring,
    serverError: restoreServerError,
    clearServerError: clearRestoreError,
    selectedUser: selectRestoreUser,
    setSelectedUser: setRestoreUser,
  } = useRestoreUser();

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

  const handleRegister = async (data: CreateUserFormData) => {
    const success = await createUser(data);
    if (success) {
      refetch();
      handleCloseRegister();
      toast.add({
        title: "Usuario registrado",
        description:
          "Usuario creado exitosamente. Se ha enviado un correo para validar su cuenta.",
        type: "success",
      });
    }
  };

  // Handlers Edición
  const handleOpenEdit = (userItem: User) => {
    setSelectedEditUser(userItem);
    clearEditError();
    toggleModal("edit", true);
  };

  const handleCloseEdit = () => {
    setSelectedEditUser(null);
    clearEditError();
    toggleModal("edit", false);
  };

  const handleUpdate = async (id: string | number, data: EditUserFormData) => {
    const success = await updateUser(id, data);
    if (success) {
      refetch();
      handleCloseEdit();
      toast.add({
        title: "Usuario actualizado",
        description: "Los cambios han sido guardados correctamente.",
        type: "success",
      });
    }
  };

  // Handlers Cambio de Contraseña
  const handleOpenPassword = (userItem: User) => {
    setSelectedPasswordUser(userItem);
    clearPasswordError();
    toggleModal("password", true);
  };

  const handleClosePassword = () => {
    setSelectedPasswordUser(null);
    clearPasswordError();
    toggleModal("password", false);
  };

  const handleUpdatePassword = async (
    id: string | number,
    data: UpdatePasswordFormData,
  ) => {
    const success = await updatePassword(id, data);
    if (success) {
      handleClosePassword();
      toast.add({
        title: "Contraseña actualizada",
        description: "La contraseña del usuario ha sido actualizada.",
        type: "success",
      });
    }
  };

  // Handlers Eliminación
  const handleOpenDelete = (userItem: User) => {
    setDeleteUser(userItem);
    clearDeleteError();
    toggleModal("delete", true);
  };

  const handleCloseDelete = () => {
    setDeleteUser(null);
    clearDeleteError();
    toggleModal("delete", false);
  };

  const handleDeleteConfirm = async (id: string | number) => {
    const success = await deleteUser(id);
    if (success) {
      refetch();
      handleCloseDelete();
      toast.add({
        title: "Usuario desactivado",
        description: "El usuario ha sido desactivado.",
        type: "success",
      });
    }
  };

  // Handlers Restauración
  const handleOpenRestore = (userItem: User) => {
    setRestoreUser(userItem);
    clearRestoreError();
    toggleModal("restore", true);
  };

  const handleCloseRestore = () => {
    setRestoreUser(null);
    clearRestoreError();
    toggleModal("restore", false);
  };

  const handleRestoreConfirm = async (id: string | number) => {
    const success = await restoreUser(id);
    if (success) {
      refetch();
      handleCloseRestore();
      toast.add({
        title: "Usuario restaurado",
        description: "El usuario ha sido activado.",
        type: "success",
      });
    }
  };

  const columns = [
    { key: "nombre", header: "Usuario", mobile: true },
    { key: "email", header: "Correo Electrónico", mobile: false },
    {
      key: "rol",
      header: "Rol",
      mobile: true,
      render: (item: Item) => {
        const user = item as User;
        const isAdmin = user.rol === "admin";
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isAdmin
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            <i
              className={`bi ${
                isAdmin ? "bi-shield-check" : "bi-person"
              } text-xs`}
            />
            {user.rol}
          </span>
        );
      },
    },
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
    {
      key: "actions",
      header: "Acciones",
      mobile: true,
      render: (item: Item) => {
        const user = item as User;
        return (
          <div className="flex justify-center items-center gap-2">
            {/* Editar */}
            {user.activo && (
              <button
                onClick={() => handleOpenEdit(user)}
                className="bg-sky-50 text-sky-600 hover:bg-sky-100 p-2.5 rounded-md transition-all cursor-pointer"
                title="Editar usuario"
              >
                <i className="bi bi-pencil-square text-base" />
              </button>
            )}

            {/* Cambiar contraseña */}
            {user.activo && (
              <button
                onClick={() => handleOpenPassword(user)}
                className="bg-amber-50 text-amber-600 hover:bg-amber-100 p-2.5 rounded-md transition-all cursor-pointer"
                title="Cambiar contraseña"
              >
                <i className="bi bi-key-fill text-base" />
              </button>
            )}

            {/* Desactivar */}
            {user.activo && (
              <button
                onClick={() => handleOpenDelete(user)}
                className="bg-red-50 text-red-500 hover:bg-red-100 p-2.5 rounded-md transition-all cursor-pointer"
                title="Desactivar usuario"
              >
                <i className="bi bi-trash text-base" />
              </button>
            )}

            {/* Restaurar */}
            {!user.activo && (
              <button
                onClick={() => handleOpenRestore(user)}
                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-2.5 rounded-md transition-all cursor-pointer"
                title="Restaurar usuario"
              >
                <i className="bi bi-arrow-clockwise text-base" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Cabecera */}
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-800 font-semibold tracking-wide">
            Gestión de Usuarios
          </h1>
        </div>
        <div>
          <button
            className="bg-green-primary hover:bg-green-hover shadow-sm px-3 py-2 rounded-md text-white font-semibold flex gap-2 items-center cursor-pointer transition-colors"
            onClick={handleOpenRegister}
          >
            <i className="bi bi-person-plus text-xl" />
            Nuevo Usuario
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
            placeholder="Buscar por usuario o correo..."
          />
        </div>
      </div>

      {/* 3. Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <Table columns={columns} data={users} />
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

      {/* 4. Modales */}
      <CreateUserModal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        onRegister={handleRegister}
        serverError={createServerError || undefined}
      />

      <EditUserModal
        isOpen={modals.edit}
        onClose={handleCloseEdit}
        onUpdate={handleUpdate}
        selectedUser={selectedEditUser}
        serverError={editServerError || undefined}
      />

      <UpdatePasswordModal
        isOpen={modals.password}
        onClose={handleClosePassword}
        onUpdatePassword={handleUpdatePassword}
        selectedUser={selectedPasswordUser}
        serverError={passwordServerError || undefined}
      />

      <ConfirmModal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        onConfirm={() =>
          selectDeleteUser?.id != null &&
          handleDeleteConfirm(String(selectDeleteUser.id))
        }
        title="Desactivar Usuario"
        message={
          <p>
            ¿Estás seguro de que deseas desactivar al usuario{" "}
            <span className="font-semibold text-gray-800">
              {selectDeleteUser?.nombre}
            </span>
            ? Su estado pasará a inactivo.
          </p>
        }
        confirmText="Desactivar"
        variant="danger"
        isSubmitting={isDeleting}
        serverError={deleteServerError || undefined}
      />

      <ConfirmModal
        isOpen={modals.restore}
        onClose={handleCloseRestore}
        onConfirm={() =>
          selectRestoreUser?.id != null &&
          handleRestoreConfirm(String(selectRestoreUser.id))
        }
        title="Restaurar Usuario"
        message={
          <p>
            ¿Estás seguro de que deseas restaurar al usuario{" "}
            <span className="font-semibold text-gray-800">
              {selectRestoreUser?.nombre}
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
