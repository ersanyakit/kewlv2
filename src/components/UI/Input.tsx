import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-gray-400 text-sm mb-1 font-medium">
            {label}
          </label>
        )}
        <div className="relative rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gray-900/40 border border-gray-800/50 rounded-xl pointer-events-none"></div>
          <div className="flex items-center relative">
            {prefix && (
              <div className="flex-shrink-0 pl-3">
                {prefix}
              </div>
            )}
            <input
              ref={ref}
              className={`w-full bg-transparent text-white px-4 py-3 focus:outline-none ${
                prefix ? 'pl-1' : ''
              } ${suffix ? 'pr-1' : ''} ${className}`}
              {...props}
            />
            {suffix && (
              <div className="flex-shrink-0 pr-3">
                {suffix}
              </div>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;