import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-text-secondary">{message}</p>

      <div className="mt-6 flex gap-3">
        <Button
          type="button"
          variant={confirmVariant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;