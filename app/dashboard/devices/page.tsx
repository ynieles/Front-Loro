"use client";

import Table from "@/components/ui/Table";
import { useModals } from "@/hooks/useModals";
import { useListDevice } from "./hooks/useListDevice";
import { useCreateDevice } from "./hooks/useCreateDevice";
import { useEditDevice } from "./hooks/useEditDevice";
import { useDeleteDevice } from "./hooks/useDeleteDevice";
import { useRestoreDevice } from "./hooks/useRestoreDevice";

import { DeviceFormData } from "./device.schema";
import { Device } from "@/types/devices.types";
import { toast } from "@/components/ui/toast";
import { Item } from "@/types/models.types";
import { useState } from "react";

import CreateDeviceModal from "./components/CreateDeviceModal";
import EditDeviceModal from "./components/EditDeviceModal";
import DeviceDetailsModal from "./components/DeviceDetailsModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SearchBar from "@/components/ui/SearchBar";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

const columns = [
  { key: "codigo_inventario", header: "Código", mobile: true },
  { key: "nombre", header: "Nombre", mobile: true },
  { key: "nombre_categoria", header: "Categoría", mobile: false },
  { key: "nombre_departamento", header: "Departamento", mobile: false },
  {
    key: "estado",
    header: "Disponibilidad",
    mobile: false,
    render: (item: Item) => {
      const estadoStr = (item.estado as string) || "Disponible";
      const isAsignado = estadoStr === "Asignado";

      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isAsignado
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              isAsignado ? "bg-amber-500" : "bg-blue-500"
            }`}
          />
          {estadoStr}
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
  { key: "actions", header: "Acciones", mobile: true },
];

export default function Devices() {
  const {
    devices,
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
  } = useListDevice();

  const {
    createDevice,
    serverError: createServerError,
    clearServerError: clearCreateError,
  } = useCreateDevice();

  const {
    updateDevice,
    serverError: editServerError,
    clearServerError: clearEditError,
    selectedDevice,
    setSelectedDevice,
  } = useEditDevice();

  const {
    deleteDevice,
    isSubmitting: isDeleting,
    serverError: deleteServerError,
    clearServerError: clearDeleteError,
    selectedDevice: selectDeleteDevice,
    setSelectedDevice: setDeleteDevice,
  } = useDeleteDevice();

  const {
    restoreDevice,
    isSubmitting: isRestoring,
    serverError: restoreServerError,
    clearServerError: clearRestoreError,
    selectedDevice: selectRestoreDevice,
    setSelectedDevice: setRestoreDevice,
  } = useRestoreDevice();

  const [detailsDevice, setDetailsDevice] = useState<Device | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const { toggleModal, modals } = useModals();

  // Handlers Detalles
  const handleOpenDetails = (deviceItem: Device) => {
    setDetailsDevice(deviceItem);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDevice(null);
    setIsDetailsOpen(false);
  };

  // Handlers Registro
  const handleOpenRegister = () => {
    clearCreateError();
    toggleModal("register", true);
  };

  const handleCloseRegister = () => {
    clearCreateError();
    toggleModal("register", false);
  };

  const handleRegister = async (data: DeviceFormData) => {
    const success = await createDevice(data);
    if (success) {
      refetch();
      handleCloseRegister();
      toast.add({
        title: "Equipo registrado",
        description: "El equipo ha sido guardado exitosamente.",
        type: "success",
      });
    }
  };

  // Handlers Edición
  const handleOpenEdit = (deviceItem: Device) => {
    setSelectedDevice(deviceItem);
    clearEditError();
    toggleModal("edit", true);
  };

  const handleCloseEdit = () => {
    setSelectedDevice(null);
    clearEditError();
    toggleModal("edit", false);
  };

  const handleUpdate = async (id: string | number, data: DeviceFormData) => {
    const success = await updateDevice(id, data);
    if (success) {
      refetch();
      handleCloseEdit();
      toast.add({
        title: "Equipo actualizado",
        description: "Los cambios han sido guardados correctamente.",
        type: "success",
      });
    }
  };

  // Handlers Eliminación
  const handleOpenDelete = (deviceItem: Device) => {
    setDeleteDevice(deviceItem);
    clearDeleteError();
    toggleModal("delete", true);
  };

  const handleCloseDelete = () => {
    setDeleteDevice(null);
    clearDeleteError();
    toggleModal("delete", false);
  };

  const handleDeleteConfirm = async (id: string | number, reason?: string) => {
    const success = await deleteDevice(id, reason || "");
    if (success) {
      refetch();
      handleCloseDelete();
      toast.add({
        title: "Equipo eliminado",
        description: "El equipo ha sido desactivado.",
        type: "success",
      });
    }
  };

  // Handlers Restauración
  const handleOpenRestore = (deviceItem: Device) => {
    setRestoreDevice(deviceItem);
    clearRestoreError();
    toggleModal("restore", true);
  };

  const handleCloseRestore = () => {
    setRestoreDevice(null);
    clearRestoreError();
    toggleModal("restore", false);
  };

  const handleRestoreConfirm = async (id: string | number) => {
    const success = await restoreDevice(id);
    if (success) {
      refetch();
      handleCloseRestore();
      toast.add({
        title: "Equipo restaurado",
        description: "El equipo ha sido activado.",
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
            Gestión de Equipos / Dispositivos
          </h1>
        </div>
        <div>
          <button
            className="bg-green-primary hover:bg-green-hover shadow-sm px-3 py-2 rounded-md text-white font-semibold flex gap-2 items-center cursor-pointer transition-colors"
            onClick={handleOpenRegister}
          >
            <i className="bi bi-laptop text-xl" />
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
            placeholder="Buscar por código, nombre o modelo..."
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
            data={devices}
            onView={(item) => handleOpenDetails(item as Device)}
            onEdit={(item) => handleOpenEdit(item as Device)}
            onDelete={(item) => handleOpenDelete(item as Device)}
            onRestore={(item) => handleOpenRestore(item as Device)}
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

      {/* 4. Modales */}
      <DeviceDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        device={detailsDevice}
      />

      <CreateDeviceModal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        onRegister={handleRegister}
        serverError={createServerError || undefined}
      />

      <EditDeviceModal
        isOpen={modals.edit}
        onClose={handleCloseEdit}
        onUpdate={handleUpdate}
        selectedDevice={selectedDevice}
        serverError={editServerError || undefined}
      />

      <ConfirmModal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        onConfirm={(reason) =>
          selectDeleteDevice?.id != null &&
          handleDeleteConfirm(String(selectDeleteDevice.id), reason)
        }
        title="Eliminar Equipo / Dispositivo"
        message={
          <p>
            ¿Estás seguro de que deseas eliminar el equipo con código{" "}
            <span className="font-semibold text-gray-800">
              {selectDeleteDevice?.codigo_inventario}
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
        reasonPlaceholder="Ingrese la razón por la cual desactiva este equipo..."
      />

      <ConfirmModal
        isOpen={modals.restore}
        onClose={handleCloseRestore}
        onConfirm={() =>
          selectRestoreDevice?.id != null &&
          handleRestoreConfirm(String(selectRestoreDevice.id))
        }
        title="Restaurar Equipo / Dispositivo"
        message={
          <p>
            ¿Estás seguro de que deseas restaurar el equipo con código{" "}
            <span className="font-semibold text-gray-800">
              {selectRestoreDevice?.codigo_inventario}
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
