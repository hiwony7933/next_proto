// MzModalContainer.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import MzModal from './mzModal';

type ModalContent = ReactNode | null;

const MzModalContext = createContext<{
  open: (content: ModalContent) => void;
  close: () => void;
}>({
  open: () => {},
  close: () => {},
});

export function useModal() {
  return useContext(MzModalContext);
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ModalContent>(null);
  const open = (modalContent: ModalContent) => setContent(modalContent);
  const close = () => setContent(null);

  return (
    <MzModalContext.Provider value={{ open, close }}>
      {children}
      <MzModal isOpen={!!content} onClose={close}>
        {content}
      </MzModal>
    </MzModalContext.Provider>
  );
}
