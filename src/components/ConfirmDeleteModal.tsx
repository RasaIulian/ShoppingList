import React from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalMessage,
  ModalActions,
  ModalButton,
} from "../Pages/ShoppingList.style";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  listToDelete: { id: string; name: string } | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  listToDelete,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !listToDelete) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalMessage>
          Are you sure you want to permanently delete the list "<strong>{listToDelete.name}</strong>"? This action cannot be undone.
        </ModalMessage>
        <ModalActions>
          <ModalButton onClick={onClose}>Cancel</ModalButton>
          <ModalButton color="danger" onClick={onConfirm}>
            Delete
          </ModalButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};