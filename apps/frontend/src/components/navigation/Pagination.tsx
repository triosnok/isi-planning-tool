import { useTranslations } from '@/features/i18n';
import { Pagination as KobaltePagination } from '@kobalte/core';
import { Component, createSignal } from 'solid-js';

export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: Component<PaginationProps> = (props) => {
  const [currentPage, setCurrentPage] = createSignal(1);
  const totalPages = () => Math.ceil(props.totalItems / props.itemsPerPage);
  const { t } = useTranslations();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    props.onPageChange(page);
  };

  return (
    <KobaltePagination.Root
      class='[&>ul]:flex [&>ul]:items-center [&>ul]:justify-center [&>ul]:gap-1'
      count={totalPages()}
      page={currentPage()}
      onPageChange={handlePageChange}
      itemComponent={(props) => (
        <KobaltePagination.Item
          page={props.page}
          class={`inline-flex items-center rounded border px-3 py-1 ${
            props.page === currentPage()
              ? 'bg-brand-blue-800 text-gray-50'
              : 'bg-white text-gray-950 transition hover:bg-gray-100 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900'
          }`}
          onClick={() => handlePageChange(props.page)}
        >
          {props.page}
        </KobaltePagination.Item>
      )}
      ellipsisComponent={() => (
        <span class='px-3 py-1 text-gray-950 dark:text-gray-50'>...</span>
      )}
    >
      <KobaltePagination.Previous class='rounded border px-4 py-1 transition hover:bg-gray-100 dark:hover:bg-gray-900'>
        {t('PAGINATION.PREVIOUS')}
      </KobaltePagination.Previous>
      <KobaltePagination.Items />
      <KobaltePagination.Next class='rounded border px-4 py-1 transition hover:bg-gray-100 dark:hover:bg-gray-900'>
        {t('PAGINATION.NEXT')}
      </KobaltePagination.Next>
    </KobaltePagination.Root>
  );
};

export default Pagination;
