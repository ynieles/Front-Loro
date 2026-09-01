// components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, name, error, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3.5 size-5 flex items-center justify-center">{icon}</div>}
          <input
            ref={ref}
            name={name}
            {...props}
            className={`w-full bg-gray-50 border ${
              error ? "border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-green-primary focus:ring-green-600/20"
            } focus:bg-white focus:ring-2 py-2 rounded-md transition-all outline-none ${
              icon ? "pl-11" : "px-3"
            }`}
          />
        </div>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

