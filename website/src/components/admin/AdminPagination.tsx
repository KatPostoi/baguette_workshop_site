import { Button } from '../ui-kit/Button';
import './AdminPagination.css';

type AdminPaginationProps = {
  total: number;
  page: number;
  pageSize: number;
};

type AdminPaginationControlsProps = AdminPaginationProps & {
  onChange: (page: number) => void;
};

type AdminPaginationInfoProps = AdminPaginationProps & {
  label?: string;
};

const getPaginationState = ({ total, page, pageSize }: AdminPaginationProps) => {
  const safePageSize = Math.max(1, pageSize || 1);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const currentPage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * safePageSize + 1;
  const end = Math.min(total, currentPage * safePageSize);

  return {
    totalPages,
    currentPage,
    start,
    end,
  };
};

export const AdminPaginationInfo = ({
  total,
  page,
  pageSize,
  label,
}: AdminPaginationInfoProps) => {
  const { totalPages, currentPage, start, end } = getPaginationState({
    total,
    page,
    pageSize,
  });

  return (
    <div className="admin-pagination__info">
      {label ? <span className="admin-pagination__label">{label}</span> : null}
      <span>Показано {start}-{end} из {total}</span>
      <span>Страница {currentPage} / {totalPages}</span>
    </div>
  );
};

export const AdminPaginationControls = ({
  total,
  page,
  pageSize,
  onChange,
}: AdminPaginationControlsProps) => {
  const { totalPages, currentPage } = getPaginationState({ total, page, pageSize });

  const handlePrev = () => {
    if (currentPage > 1) onChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onChange(currentPage + 1);
  };

  return (
    <div className="admin-pagination__buttons">
      <Button variant="secondary" onClick={handlePrev} disabled={currentPage <= 1}>
        Назад
      </Button>
      <Button variant="secondary" onClick={handleNext} disabled={currentPage >= totalPages}>
        Вперед
      </Button>
    </div>
  );
};
