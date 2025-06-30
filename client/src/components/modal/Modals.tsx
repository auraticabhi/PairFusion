import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

const InputModal = (
  message: string,
  options?: {
    title?: string;
    placeholder?: string;
    defaultValue?: string;
    type?: "text" | "email" | "password" | "number";
    required?: boolean;
    maxLength?: number;
    minLength?: number;
  }
): Promise<string | null> => {
  return new Promise((resolve) => {
    const Modal = () => {
      const [isOpen, setIsOpen] = useState(true);
      const [inputValue, setInputValue] = useState(options?.defaultValue || "");
      const [error, setError] = useState("");
      const [isAnimating, setIsAnimating] = useState(false);
      const inputRef = useRef<HTMLInputElement>(null);
      const modalRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }

        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            handleCancel();
          }
        };

        const handleClickOutside = (e: MouseEvent) => {
          if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            handleCancel();
          }
        };

        document.addEventListener("keydown", handleEscape);
        document.addEventListener("mousedown", handleClickOutside);

        setTimeout(() => setIsAnimating(true), 10);

        return () => {
          document.removeEventListener("keydown", handleEscape);
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

      const validateInput = (value: string): boolean => {
        if (options?.required && !value.trim()) {
          setError("This field is required");
          return false;
        }
        if (options?.minLength && value.length < options.minLength) {
          setError(`Minimum ${options.minLength} characters required`);
          return false;
        }
        if (options?.maxLength && value.length > options.maxLength) {
          setError(`Maximum ${options.maxLength} characters allowed`);
          return false;
        }
        if (options?.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setError("Please enter a valid email address");
          return false;
        }
        setError("");
        return true;
      };

      const handleSubmit = () => {
        if (validateInput(inputValue)) {
          setIsAnimating(false);
          setTimeout(() => {
            setIsOpen(false);
            resolve(inputValue || null);
          }, 150);
        }
      };

      const handleCancel = () => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsOpen(false);
          resolve(null);
        }, 150);
      };

      const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit();
        }
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (error) {
          validateInput(value);
        }
      };

      if (!isOpen) return null;

      return (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            ref={modalRef}
            className={`bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md mx-4 transform transition-all duration-300 ${
              isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
            }`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">
                {options?.title || "Input Required"}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{message}</p>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <input
                    ref={inputRef}
                    type={options?.type || "text"}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={options?.placeholder || "Enter text..."}
                    maxLength={options?.maxLength}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200 ${
                      error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
                    }`}
                  />
                  {error && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  )}
                  {options?.maxLength && (
                    <p className="text-gray-500 text-xs mt-1 text-right">
                      {inputValue.length}/{options.maxLength}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-800 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={options?.required && !inputValue.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  options?.required && !inputValue.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#8B5CF6] hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      );
    };

    // Create container and render
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    
    root.render(<Modal />);

    // Cleanup function
    const cleanup = () => {
      setTimeout(() => {
        root.unmount();
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }, 300);
    };

    // Auto-cleanup when promise resolves
    const originalResolve = resolve;
    resolve = (value) => {
      originalResolve(value);
      cleanup();
    };
  });
};

const ConfirmModal = (
  message: string,
  options?: {
    title?: string;
    confirmText?: string;
    cancelText?: string;
    type?: "info" | "warning" | "danger" | "success";
    description?: string;
  }
): Promise<boolean | null> => {
  return new Promise((resolve) => {
    const Modal = () => {
      const [isOpen, setIsOpen] = useState(true);
      const [isAnimating, setIsAnimating] = useState(false);
      const modalRef = useRef<HTMLDivElement>(null);
      const confirmButtonRef = useRef<HTMLButtonElement>(null);

      const modalType = options?.type || "info";
      const typeConfig = {
        info: {
          icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          iconColor: "text-blue-500",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          borderColor: "border-blue-500/20"
        },
        warning: {
          icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
          iconColor: "text-yellow-500",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
          borderColor: "border-yellow-500/20"
        },
        danger: {
          icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
          iconColor: "text-red-500",
          buttonColor: "bg-red-600 hover:bg-red-700",
          borderColor: "border-red-500/20"
        },
        success: {
          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          iconColor: "text-green-500",
          buttonColor: "bg-green-600 hover:bg-green-700",
          borderColor: "border-green-500/20"
        }
      };

      const config = typeConfig[modalType];

      useEffect(() => {
        if (confirmButtonRef.current) {
          confirmButtonRef.current.focus();
        }

        // Handle escape key
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            handleCancel();
          }
        };

        // Handle click outside
        const handleClickOutside = (e: MouseEvent) => {
          if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            handleCancel();
          }
        };

        // Handle enter key
        const handleEnter = (e: KeyboardEvent) => {
          if (e.key === "Enter") {
            handleConfirm();
          }
        };

        document.addEventListener("keydown", handleEscape);
        document.addEventListener("keydown", handleEnter);
        document.addEventListener("mousedown", handleClickOutside);

        setTimeout(() => setIsAnimating(true), 10);

        return () => {
          document.removeEventListener("keydown", handleEscape);
          document.removeEventListener("keydown", handleEnter);
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

      const handleConfirm = () => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsOpen(false);
          resolve(true);
        }, 150);
      };

      const handleCancel = () => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsOpen(false);
          resolve(null);
        }, 150);
      };

      if (!isOpen) return null;

      return (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            ref={modalRef}
            className={`bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md mx-4 transform transition-all duration-300 ${
              isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
            }`}
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b border-gray-700 ${config.borderColor}`}>
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${config.iconColor}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {options?.title || "Confirm Action"}
                  </h3>
                  {options?.description && (
                    <p className="text-gray-400 text-sm mt-1">{options.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <p className="text-gray-300 leading-relaxed">{message}</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-800 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium"
              >
                {options?.cancelText || "Cancel"}
              </button>
              <button
                ref={confirmButtonRef}
                onClick={handleConfirm}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-white shadow-lg ${config.buttonColor}`}
              >
                {options?.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      );
    };

    // Create container and render
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    
    root.render(<Modal />);

    // Cleanup function
    const cleanup = () => {
      setTimeout(() => {
        root.unmount();
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }, 300);
    };

    // Auto-cleanup when promise resolves
    const originalResolve = resolve;
    resolve = (value) => {
      originalResolve(value);
      cleanup();
    };
  });
};

export { InputModal, ConfirmModal };
