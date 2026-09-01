"use client";

import Table from "@/components/ui/Table";
import { useModals } from "@/hooks/useModals";
import { useListAssignments } from "./hooks/useListAssignment";
import { useCreateAssignment } from "./hooks/useCreateAssignment";
import { useDeleteAssignment } from "./hooks/useDeleteAssignment";

import { AssignmentFormData } from "./assignment.schema";
import { Assignment } from "@/types/assignment.types";
import { toast } from "@/components/ui/toast";
import { Item } from "@/types/models.types";
import { useState } from "react";

import CreateAssignmentModal from "./components/CreateAssignmentModal";
import AssignmentDetailsModal from "./components/AssignmentDetailsModal";
import AssignmentReceiptModal from "./components/AssignmentReceiptModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SearchBar from "@/components/ui/SearchBar";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function Asignaciones() {
  const {
    assignments,
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
  } = useListAssignments();

  const {
    createAssignment,
    serverError: createServerError,
    clearServerError: clearCreateError,
  } = useCreateAssignment();

  const {
    deleteAssignment,
    isSubmitting: isDeleting,
    serverError: deleteServerError,
    clearServerError: clearDeleteError,
    selectedAssignment: selectDeleteAssignment,
    setSelectedAssignment: setDeleteAssignment,
  } = useDeleteAssignment();

  // Modal de Detalle
  const [detailsAssignment, setDetailsAssignment] = useState<Assignment | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  // Modal de Ficha de Entrega PDF
  const [receiptAssignment, setReceiptAssignment] = useState<Assignment | null>(
    null,
  );
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  const { toggleModal, modals } = useModals();

  // Handlers Detalles
  const handleOpenDetails = (item: Assignment) => {
    setDetailsAssignment(item);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsAssignment(null);
    setIsDetailsOpen(false);
  };

  // Handlers Ficha de Entrega (PDF)
  const handleOpenReceipt = (item: Assignment) => {
    setReceiptAssignment(item);
    setIsReceiptOpen(true);
  };

  const handleCloseReceipt = () => {
    setReceiptAssignment(null);
    setIsReceiptOpen(false);
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

  const handleRegister = async (data: AssignmentFormData) => {
    const success = await createAssignment(data);
    if (success) {
      refetch();
      handleCloseRegister();
      toast.add({
        title: "Asignación registrada",
        description: "El equipo ha sido asignado exitosamente.",
        type: "success",
      });
    }
  };

  // Handlers Eliminación / Devolución
  const handleOpenDelete = (item: Assignment) => {
    setDeleteAssignment(item);
    clearDeleteError();
    toggleModal("delete", true);
  };

  const handleCloseDelete = () => {
    setDeleteAssignment(null);
    clearDeleteError();
    toggleModal("delete", false);
  };

  const handleDeleteConfirm = async (reason?: string) => {
    if (!selectDeleteAssignment?.id) return;
    const success = await deleteAssignment(selectDeleteAssignment.id, reason || "");
    if (success) {
      refetch();
      handleCloseDelete();
      toast.add({
        title: "Equipo liberado",
        description:
          "La asignación ha sido finalizada y el equipo quedó disponible.",
        type: "success",
      });
    }
  };

  const columns = [
    {
      key: "codigo_equipo",
      header: "Código",
      mobile: true,
      render: (item: Item) => {
        const code = (item.codigo_equipo as string) || "N/A";
        return <span className="font-bold text-gray-800">{code}</span>;
      },
    },
    {
      key: "nombre_equipo",
      header: "Equipo",
      mobile: true,
      render: (item: Item) => {
        const name = (item.nombre_equipo as string) || "Equipo";
        return <span className="font-medium text-gray-700">{name}</span>;
      },
    },
    {
      key: "nombre_empleado",
      header: "Empleado Custodio",
      mobile: true,
      render: (item: Item) => {
        const empName = (item.nombre_empleado as string) || "Empleado";
        const ci = item.cedula_empleado as string;
        return (
          <div>
            <span className="font-semibold text-gray-800 block">{empName}</span>
            {ci && <span className="text-xs text-gray-400">CI: {ci}</span>}
          </div>
        );
      },
    },
    {
      key: "fecha_inicio",
      header: "Fecha Entrega",
      mobile: false,
      render: (item: Item) => {
        const dateStr = item.fecha_inicio as string;
        if (!dateStr) return <span className="text-xs text-gray-400">N/A</span>;
        try {
          const d = new Date(dateStr);
          return (
            <span className="text-xs text-gray-600 font-medium">
              {d.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          );
        } catch {
          return <span className="text-xs text-gray-600">{dateStr}</span>;
        }
      },
    },
    {
      key: "activo",
      header: "Estado",
      mobile: true,
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
        const asg = item as Assignment;
        return (
          <div className="flex justify-center items-center gap-2">
            {/* Ficha PDF */}
            <button
              onClick={() => handleOpenReceipt(asg)}
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-2 rounded-md transition-all cursor-pointer"
              title="Ficha PDF"
            >
              <i className="bi bi-file-earmark-pdf" />
            </button>

            {/* Ver Detalle */}
            <button
              onClick={() => handleOpenDetails(asg)}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-md transition-all cursor-pointer"
              title="Ver"
            >
              <i className="bi bi-eye" />
            </button>

            {/* Devolver / Liberar */}
            {Boolean(asg.activo) && (
              <button
                onClick={() => handleOpenDelete(asg)}
                className="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-md transition-all cursor-pointer"
                title="Eliminar"
              >
                <i className="bi bi-trash" />
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
            Gestión de Asignaciones
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
            placeholder="Buscar por equipo, empleado o CI..."
          />
        </div>
      </div>

      {/* 3. Tabla con Paginación idéntica a los otros módulos */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <Table columns={columns} data={assignments} />
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
      <CreateAssignmentModal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        onRegister={handleRegister}
        serverError={createServerError || undefined}
      />

      <AssignmentDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        assignment={detailsAssignment}
        onOpenReceipt={handleOpenReceipt}
      />

      <AssignmentReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
        assignment={receiptAssignment}
      />

      <ConfirmModal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        onConfirm={(reason) => handleDeleteConfirm(reason)}
        title="Finalizar Asignación"
        message={
          <p>
            ¿Estás seguro de que deseas finalizar la asignación del equipo{" "}
            <span className="font-semibold text-gray-800">
              {selectDeleteAssignment?.nombre_equipo}
            </span>
            ? El equipo volverá a estar disponible.
          </p>
        }
        confirmText="Eliminar"
        variant="danger"
        isSubmitting={isDeleting}
        serverError={deleteServerError || undefined}
        showReasonInput={true}
        reasonLabel="Motivo de finalización / devolución"
        reasonPlaceholder="Ingrese la razón por la cual se finaliza o desactiva esta asignación..."
      />
    </div>
  );
}
