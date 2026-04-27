type AdminCreateButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export const AdminCreateButton = ({
  onClick,
  disabled = false,
  label = '+ Создать',
}: AdminCreateButtonProps) => (
  <button
    type="button"
    className="admin-list-block__create-button"
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);
