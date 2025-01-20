import React, { useEffect } from "react";

interface IInputProps {
  placeholder: string;
  inputType: "email" | "password" | "text";
  max: number;
  error: string;
  autoFocus: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

function Input({
  placeholder,
  inputType,
  max,
  error,
  autoFocus,
  onChange,
  value,
}: IInputProps) {
    useEffect(() => {
        if (autoFocus) {
            const input = document.getElementById(`input-${placeholder}`)
            input?.focus()
        }
    }, [autoFocus, placeholder]);
  return (
    <div>
        <input
            id={`input-${placeholder}`}
            className="block w-full bg-[#f1f1f2] text-gray-800 border border-transparent
            border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"
            placeholder={placeholder}
            type={inputType}
            onChange={onChange}
            value={value}
            maxLength={max}
        />
        {error && (
            <span className="text-red-500 text-[14px] font-semibold">{error}</span>
        )}
    </div>
  )
}

export default Input;
