import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { Pagination as PaginationPrimitive } from '@kobalte/core';
import { Component, createSignal } from 'solid-js';

export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: Component<PaginationProps> = (props) => {
  const [currentPage, setCurrentPage] = createSignal(1);
  
  const totalPages = () => {
    if (props.totalItems === 0) {
      return 1;
    }
    return Math.ceil(props.totalItems / props.itemsPerPage);
  };

  const { t } = useTranslations();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    props.onPageChange(page);
  };

  return (
    <PaginationPrimitive.Root
      class='[&>ul]:flex [&>ul]:items-center [&>ul]:justify-center [&>ul]:gap-1'
      count={totalPages()}
      page={currentPage()}
      onPageChange={handlePageChange}
      itemComponent={(props) => (
        <PaginationPrimitive.Item
          page={props.page}
          class={cn(
            'inline-flex items-center rounded border px-3 py-1 dark:border-gray-700',
            props.page === currentPage() && 'bg-brand-blue-800  text-gray-50',
            props.page !== currentPage() &&
              'bg-white text-gray-950 transition hover:bg-gray-100 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900'
          )}
          onClick={() => handlePageChange(props.page)}
        >
          {props.page}
        </PaginationPrimitive.Item>
      )}
      ellipsisComponent={() => (
        <span class='px-3 py-1 text-gray-950 dark:text-gray-50'>...</span>
      )}
    >
      <PaginationPrimitive.Previous class='rounded border px-4 py-1 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900'>
        {t('PAGINATION.PREVIOUS')}
      </PaginationPrimitive.Previous>
      <PaginationPrimitive.Items />
      <PaginationPrimitive.Next class='rounded border px-4 py-1 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900'>
        {t('PAGINATION.NEXT')}
      </PaginationPrimitive.Next>
    </PaginationPrimitive.Root>
  );
};

export default Pagination;
