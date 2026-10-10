import { forwardRef, type ButtonHTMLAttributes } from "react";
import "../components/Ui/Ui.css";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "default",
      type = "button",
      disabled,
      isLoading = false,
      ...props
    },
    ref
  ) => (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`ui-button ui-button--${variant} ${className}`}
    >
      {isLoading && <span className="ui-spinner" aria-hidden="true" />}
      {isLoading ? "Please wait…" : children}
    </button>
  )
);

Button.displayName = "Button";