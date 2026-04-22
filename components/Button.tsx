import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 disabled:bg-green-300",
    secondary:
      "bg-green-100 text-green-800 hover:bg-green-200 active:bg-green-300 focus:ring-green-400",
    outline:
      "border-2 border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 focus:ring-green-500",
    danger:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400 disabled:bg-red-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
