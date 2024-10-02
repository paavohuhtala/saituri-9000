import { IconX } from "@tabler/icons-react";
import React from "react";
import styled from "styled-components";
import { gray } from "../theme";
import { breakpoint } from "./breakpoint";
import { useLocation, useSearchParams } from "react-router-dom";

const ModalContainer = styled.dialog`
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: ${gray.x900};
  color: ${gray.x50};

  &:not([open]) {
    pointer-events: none;
    opacity: 0;
  }

  width: 100%;
  height: 100%;
  margin: 0;
  min-width: 100%;
  min-height: 100vh;
  border: none;
  overflow: hidden;

  --modal-margin: 16px;

  @media ${breakpoint.tablet} {
    margin: auto;
    border-radius: 8px;
    width: 100%;
    min-height: 100px;
    height: max-content;
    min-width: 300px;
    max-width: min(90vw, 900px);
    max-height: 90vh;

    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  }
`;

export interface ModalProps {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

export function Modal({ className, children, isOpen, onClose }: ModalProps) {
  const canClose = onClose !== undefined;
  const modalRef = React.useRef<HTMLDialogElement>(null);

  // Used to implement the modal close behavior when clicking outside the modal
  // https://stackoverflow.com/a/26984690
  const onClickModal = React.useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (!canClose) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();

      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    },
    [canClose, onClose],
  );

  React.useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  });

  const onCancel = React.useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      onClose?.();
    },
    [onClose],
  );

  return (
    <ModalContainer ref={modalRef} className={className} onClick={onClickModal} onCancel={onCancel}>
      {isOpen && children}
    </ModalContainer>
  );
}

const ModalHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  background-color: ${gray.x800};
  border-bottom: 1px solid ${gray.x700};

  & > h2 {
    font-weight: 500;
    font-size: 24px;
    line-height: 24px;
  }

  padding: 12px 16px;

  @media ${breakpoint.tablet} {
    padding: 16px 24px;
  }
`;

export const ModalContent = styled.div`
  padding: 16px;

  @media ${breakpoint.tablet} {
    padding: 24px;
  }
`;

const CloseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  background: none;
  border: none;
  width: 32px;
  height: 32px;
  color: ${gray.x50};
  border-radius: 8px;

  &:hover {
    cursor: pointer;
    background: ${gray.x700};
  }
`;

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <ModalHeaderContainer>
      <h2>{title}</h2>
      {onClose && (
        <CloseButton onClick={onClose}>
          <IconX size={24} />
        </CloseButton>
      )}
    </ModalHeaderContainer>
  );
}

interface UrlStateModalProps extends Omit<ModalProps, "isOpen" | "onClose"> {
  query: string;
}

export function UrlStateModal({ query, ...modalProps }: UrlStateModalProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen = searchParams.has(query);
  // Remove the query parameter from the URL when the modal is closed
  // Only the parameter for this, nothing else
  const onClose = React.useCallback(() => {
    setSearchParams((params) => {
      params.delete(query);
      return params;
    });
  }, [query, setSearchParams]);

  return <Modal {...modalProps} isOpen={isOpen} onClose={onClose} />;
}
