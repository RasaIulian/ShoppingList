import React from "react";
import { useLanguage } from "../hooks/useLanguage";
import { UI_STRINGS } from "../utils/translations";
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
  const { language } = useLanguage();
  if (!isOpen || !listToDelete) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalMessage>
          {UI_STRINGS[language].deleteListConfirm.replace(
            "{{listName}}",
            listToDelete.name,
          )}
        </ModalMessage>
        <ModalActions>
          <ModalButton onClick={onClose}>
            {UI_STRINGS[language].cancel}
          </ModalButton>
          <ModalButton color="danger" onClick={onConfirm}>
            {UI_STRINGS[language].delete}
          </ModalButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};
