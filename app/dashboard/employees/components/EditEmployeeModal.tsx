import { Employee } from "@/types/employees.types";
import { EmployeeFormData, employeeSchema } from "../employee.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRole } from "@/hooks/useRole";
import { useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import RoleSelect from "./RoleSelect";
import { Spinner } from "@/components/ui/spinner";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: string | number,
    data: EmployeeFormData,
  ) => Promise<boolean | void>;
  selectedEmployee: Employee | null;
  serverError?: string;
}

export default function EditEmployeeModal({
  isOpen,
  onClose,
  onUpdate,
  selectedEmployee,
  serverError,
}: EditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const { roles } = useRole();

  useEffect(() => {
    if (selectedEmployee && isOpen) {
      reset({
        nombre: selectedEmployee.nombre_empleado,
        ci: selectedEmployee.ci,
        rol_id: selectedEmployee.rol_id ? String(selectedEmployee.rol_id) : "",
      });
    }
  }, [selectedEmployee, isOpen, reset, roles]);

  const onSubmit = async (data: EmployeeFormData) => {
    if (!selectedEmployee) return;

    if(!isDirty){
        onClose()
        return;
    }

    const success = await onUpdate(Number(selectedEmployee.id), data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Empleado">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <Input
          {...register("nombre")}
          label="Nombre Completo:"
          icon={<i className="bi bi-person text-xl" />}
          error={errors.nombre?.message}
        />
        <Input
          {...register("ci")}
          type="number"
          label="Número de Cédula:"
          placeholder="Ej: 00000000"
          icon={<i className="bi bi-person-vcard text-xl" />}
          error={errors.ci?.message}
        />
        <div className="col-span-2 space-y-1">
          <RoleSelect
            {...register("rol_id")}
            roles={roles}
            error={errors.rol_id?.message}
          />
        </div>

        {serverError && (
          <div className="col-span-2 bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-3">
            <i className="bi bi-exclamation-circle-fill text-red-500 text-lg shrink-0" />
            <p className="text-sm text-red-700 font-medium">{serverError}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 col-span-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 cursor-pointer shadow-sm rounded-md hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="px-4 py-2 text-sm bg-green-primary hover:bg-green-hover shadow-sm transition-all text-white rounded-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <Spinner className="size-6" /> : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
