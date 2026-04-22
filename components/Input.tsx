import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  fullWidth = false,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-gray-700"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`border rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        } ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
