import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Spinner } from "./spinner";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  message: React.ReactNode;
  confirmText: string;
  variant?: "danger" | "success" | "primary";
  isSubmitting: boolean;
  serverError?: string;
  showReasonInput?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant,
  isSubmitting,
  serverError,
  showReasonInput = false,
  reasonLabel = "Motivo de desactivación",
  reasonPlaceholder = "Escriba el motivo aquí...",
}: ConfirmModalProps) {
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setValidationError(null);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (showReasonInput) {
      if (!reason.trim()) {
        setValidationError("Por favor, ingrese el motivo.");
        return;
      }
    }
    setValidationError(null);
    onConfirm(reason.trim());
  };

  const btnColor =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : variant === "success"
        ? "bg-emerald-600 hover:bg-emerald-700"
        : "bg-green-primary hover:bg-green-hover";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="text-sm text-gray-600">{message}</div>

        {showReasonInput && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {reasonLabel} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder={reasonPlaceholder}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-800"
            />
            {validationError && (
              <p className="text-xs text-red-600 font-medium">{validationError}</p>
            )}
          </div>
        )}

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-3">
            <i className="bi bi-exclamation-circle-fill text-red-500 text-lg shrink-0" />
            <p className="text-sm text-red-700 font-medium">{serverError}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2 text-sm text-white font-medium rounded-md flex items-center justify-center cursor-pointer transition-all ${btnColor}`}
          >
            {isSubmitting ? <Spinner className="size-5" /> : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

