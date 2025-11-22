import MzButton from "@/app/common/components/atom/mzButton";
import { useState } from "react";
import { MzModal } from "@/app/common/components/molecule/mzModal";
import MzTooltip from "@/app/common/components/molecule/mzTooltip";

export default function FormTitle({
  title,
  question,
  modalTitle,
  modalContent,
  modalSize,
  hasHeader,
  isOpen,
  onOpenChange,
}: {
  title: string;
  question?: boolean;
  modalTitle?: string;
  modalContent?: React.ReactNode;
  modalSize?: string;
  hasHeader?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isControlled = typeof isOpen === "boolean";
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? (isOpen as boolean) : internalOpen;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (!isControlled) setInternalOpen(next);
  };

  return (
    <div className="form__title">
      {title}
      {question && (
        <MzTooltip text={modalTitle}>
          <MzButton icon onClick={() => setOpen(true)}>
            <i className="icon__30_question" />
          </MzButton>
        </MzTooltip>
      )}
      <MzModal
        isOpen={open}
        hasHeader={hasHeader}
        onClose={() => setOpen(false)}
        title={modalTitle}
        size={modalSize}
      >
        <>{modalContent}</>
      </MzModal>
    </div>
  );
}
