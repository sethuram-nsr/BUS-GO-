import { forwardRef, type InputHTMLAttributes } from "react";
import "../components/Ui/Ui.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", type = "text", ...props }, ref) => (
        <input
            ref={ref}
            type={type}
            className={`ui-input ${className}`}
            {...props}
        />
    )
);

Input.displayName = "Input";