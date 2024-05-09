import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useTranslations } from '@/features/i18n';
import { IconType } from '@/lib/utils';
import { SearchResultUnion } from '@isi-insight/client';
import { createScheduled, debounce } from '@solid-primitives/scheduled';
import { useNavigate } from '@solidjs/router';
import {
  IconBarrierBlock,
  IconCar,
  IconClipboardList,
  IconCommand,
  IconLine,
  IconLoader2,
  IconSearch,
  IconUser,
} from '@tabler/icons-solidjs';
import { Command } from 'cmdk-solid';
import {
  Component,
  For,
  JSX,
  Match,
  Show,
  Switch,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { useSearchQuery } from '../api';

export interface CommandSearchRootProps {
  children?: JSX.Element;
}

const CommandSearch: Component<CommandSearchRootProps> = (props) => {
  const [show, setShow] = createSignal(false);
  const [phrase, setPhrase] = createSignal('');
  const { t } = useTranslations();
  const navigate = useNavigate();
  const scheduled = createScheduled((fn) => debounce(fn, 500));

  const debouncedPhrase = (p: string = '') => {
    const searchPhrase = phrase();

    return scheduled() ? searchPhrase : p;
  };

  const results = useSearchQuery(debouncedPhrase);

  const getText = (item: SearchResultUnion) => {
    switch (item.type) {
      case 'PROJECT':
        return `${item.name} - ${item.referenceCode}`;
      case 'USER':
        return `${item.fullName} (${item.email})`;
      case 'VEHICLE':
        return `${item.model} (${item.registrationNumber ?? 'N/A'})`;
      case 'RAILING':
        return `${item.id} (${item.projectName} - ${item.projectReferenceCode})`;
      case 'ROAD_SEGMENT':
        return `${item.roadSystemReference} (${item.projectName} - ${item.projectReferenceCode})`;
    }
  };

  const getUrl = (item: SearchResultUnion) => {
    switch (item.type) {
      case 'PROJECT':
        return `/projects/${item.id}`;
      case 'USER':
        return `/users/${item.id}`;
      case 'VEHICLE':
        return `/vehicles/${item.id}`;
      case 'RAILING':
        return `/projects/${item.projectId}/railings/${item.id}`;
      case 'ROAD_SEGMENT':
        return `/projects/${item.projectId}/railings/${item.railingId}?segment=${item.id}`;
    }
  };

  const navigateTo = (to: string) => {
    setShow(false);
    navigate(to);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      setShow(true);
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    onCleanup(() => document.removeEventListener('keydown', handleKeydown));
  });

  return (
    <Dialog open={show()} onOpenChange={setShow}>
      <DialogTrigger class='flex items-center gap-2 rounded-md border border-gray-400 bg-gray-200 px-1 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none md:pl-2 md:pr-3 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800'>
        <IconSearch class='size-5' />
        <span class='max-md:hidden'>Search</span>
        <kbd class='rounded-md border border-gray-400 bg-gray-300 px-1.5 text-xs text-gray-600 max-md:hidden dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'>
          Ctrl+K
        </kbd>
      </DialogTrigger>

      <DialogContent class='max-h-[50%] overflow-hidden p-0 pb-2'>
        <Command shouldFilter={false} class='flex flex-col' loop>
          <div
            class='flex items-center gap-2 border-b py-3 pl-4 pr-10 dark:border-gray-800'
            cmdk-input-wrapper=''
          >
            <IconSearch class='size-5 text-gray-400' />
            <Command.Input
              value={phrase()}
              onValueChange={setPhrase}
              class='flex-1 bg-transparent focus:outline-none'
              placeholder={t('NAVIGATION.SEARCH')}
            />
          </div>

          <Command.List
            class='h-[var(--cmdk-list-height)] max-h-80 min-h-32 scroll-py-2 overflow-y-auto pt-1 transition-[height] duration-300 ease-in-out'
            style={{
              'scroll-padding-block-start': '8px',
              'scroll-padding-block-end': '8px',
            }}
          >
            <Show when={phrase().length === 0}>
              <Command.Empty class='flex items-center justify-center gap-1 py-2 text-gray-400'>
                <span>Start typing to search</span>
              </Command.Empty>
            </Show>

            <Show when={results.isLoading}>
              <Command.Loading>
                <div class='flex flex-row items-center justify-center gap-1 py-2 text-gray-400'>
                  <IconLoader2 class='size-5 animate-spin' />
                  <span class='block'>Loading...</span>
                </div>
              </Command.Loading>
            </Show>

            <For
              each={results.data}
              fallback={
                <Show when={!results.isLoading && phrase().length > 0}>
                  <p class='w-full text-center text-gray-400'>
                    No results found
                  </p>
                </Show>
              }
            >
              {(item, idx) => (
                <Switch>
                  <Match when={item.type === 'PROJECT'}>
                    <SearchResultItem
                      id={idx()}
                      icon={IconClipboardList}
                      text={getText(item)}
                      onSelect={() => navigateTo(getUrl(item))}
                    />
                  </Match>
                  <Match when={item.type === 'VEHICLE'}>
                    <SearchResultItem
                      id={idx()}
                      icon={IconCar}
                      text={getText(item)}
                      onSelect={() => navigateTo(getUrl(item))}
                    />
                  </Match>
                  <Match when={item.type === 'USER'}>
                    <SearchResultItem
                      id={idx()}
                      icon={IconUser}
                      text={getText(item)}
                      onSelect={() => navigateTo(getUrl(item))}
                    />
                  </Match>
                  <Match when={item.type === 'RAILING'}>
                    <SearchResultItem
                      id={idx()}
                      icon={IconBarrierBlock}
                      text={getText(item)}
                      onSelect={() => navigateTo(getUrl(item))}
                    />
                  </Match>
                  <Match when={item.type === 'ROAD_SEGMENT'}>
                    <SearchResultItem
                      id={idx()}
                      icon={IconLine}
                      text={getText(item)}
                      onSelect={() => navigateTo(getUrl(item))}
                    />
                  </Match>
                </Switch>
              )}
            </For>
          </Command.List>

          <Show when={(results.data?.length ?? 0) >= 100}>
            <span class='w-full pt-1 text-center text-xs text-gray-500'>
              {t('SEARCH.RESULT_LIMIT_REACHED')}
            </span>
          </Show>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

interface SearchResultItemProps {
  id: number;
  icon: IconType;
  text: string;
  onSelect?: () => void;
}

const SearchResultItem: Component<SearchResultItemProps> = (props) => {
  return (
    <Command.Item
      value={props.id.toString()}
      class='aria-selected:bg-brand-blue group mx-2 flex items-center gap-1 rounded-md p-1 aria-selected:text-white'
      onSelect={props.onSelect}
    >
      <props.icon class='size-5 text-gray-400 group-aria-selected:text-white' />
      <span>{props.text}</span>
    </Command.Item>
  );
};

export default CommandSearch;
