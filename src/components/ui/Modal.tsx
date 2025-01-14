import { ReactNode, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import useClickOutside from "@/hooks/useClickOutside";
import Portal from "@/components/ui/Portal";
import { cn } from "@/config/utils";

interface ModalProps {
  isOpen?: boolean;
  isShowFooter?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  title?: string;
  okText?: string;
  cancelText?: string;
  className?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

const Modal = ({
  isOpen,
  isShowFooter = true,
  cancelText,
  okText,
  onCancel,
  onOk,
  children,
  title,
  className,
  footer,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, () => {
    onCancel?.();
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-dark-400 bg-opacity-40 backdrop-blur-sm"></div>

        <div
          ref={modalRef}
          className={cn(
            "bg-white rounded-lg shadow-lg p-5 z-50 w-[520px] max-h-full overflow-auto mx-3",
            className
          )}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title || "Modal"}</h2>
            <button
              onClick={onCancel}
              className="text-dark-400 hover:text-dark-600 hover:bg-dark-100 px-2 rounded-sm"
            >
              ✕
            </button>
          </div>

          <div>{children}</div>

          <div className="mt-4">
            {isShowFooter && (
              <>
                {footer ? (
                  footer
                ) : (
                  <div className="flex justify-end ">
                    <Button
                      onClick={onCancel}
                      className="text-dark-700 px-4 py-1 rounded mr-2 bg-white hover:bg-dark-100"
                    >
                      {cancelText || "Cancel"}
                    </Button>
                    <Button
                      onClick={onOk}
                      className="bg-primary-900 text-white px-6 py-1 rounded hover:bg-opacity-80"
                    >
                      {okText || "Ok"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
