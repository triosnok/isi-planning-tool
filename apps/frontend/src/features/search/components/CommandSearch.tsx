import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useTranslations } from '@/features/i18n';
import { IconType } from '@/lib/utils';
import { createScheduled, debounce } from '@solid-primitives/scheduled';
import { useNavigate } from '@solidjs/router';
import {
  IconCar,
  IconClipboardList,
  IconCommand,
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

const CommandSearchRoot: Component<CommandSearchRootProps> = (props) => {
  const [show, setShow] = createSignal(false);

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
      {props.children}
    </Dialog>
  );
};

export interface CommandSearchTriggerProps {}

const CommandSearchTrigger: Component<CommandSearchTriggerProps> = (props) => {
  return (
    <DialogTrigger class=''>
      <kbd>
        <IconCommand />
      </kbd>
    </DialogTrigger>
  );
};

export interface CommandSearchDialogProps {}

const CommandSearchDialog: Component<CommandSearchDialogProps> = (props) => {
  const [phrase, setPhrase] = createSignal('');
  const { t } = useTranslations();
  const navigate = useNavigate();
  const scheduled = createScheduled((fn) => debounce(fn, 500));

  const debouncedPhrase = (p: string = '') => {
    const searchPhrase = phrase();

    return scheduled() ? searchPhrase : p;
  };

  const results = useSearchQuery(debouncedPhrase);

  const handleNavigation = () => {
    return () => {
      navigate(url);
    };
  };

  return (
    <DialogContent class='p-0'>
      <Command shouldFilter={false} class='flex flex-col'>
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

        <Command.List class='pb-2 pt-1'>
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
                <p class='w-full text-center text-gray-400'>No results found</p>
              </Show>
            }
          >
            {(item) => (
              <Switch>
                <Match when={item.type === 'PROJECT'}>
                  <SearchResultItem
                    icon={IconClipboardList}
                    text={item.id}
                    onSelect={() => navigate(`/projects/${item.id}`)}
                  />
                </Match>
                <Match when={item.type === 'VEHICLE'}>
                  <SearchResultItem
                    icon={IconCar}
                    text={item.id}
                    onSelect={() => navigate(`/vehicles/${item.id}`)}
                  />
                </Match>
                <Match when={item.type === 'USER'}>
                  <SearchResultItem
                    icon={IconUser}
                    text={item.id}
                    onSelect={() => navigate(`/users/${item.id}`)}
                  />
                </Match>
              </Switch>
            )}
          </For>
        </Command.List>
      </Command>
    </DialogContent>
  );
};

interface SearchResultItemProps {
  icon: IconType;
  text: string;
  onSelect?: () => void;
}

const SearchResultItem: Component<SearchResultItemProps> = (props) => {
  return (
    <Command.Item
      class='aria-selected:bg-brand-blue mx-2 flex items-center gap-1 rounded-md p-1 aria-selected:text-white'
      onSelect={props.onSelect}
    >
      <props.icon class='size-5' />
      <span>{props.text}</span>
    </Command.Item>
  );
};

const CommandSearch = {
  Root: CommandSearchRoot,
  Trigger: CommandSearchTrigger,
  Dialog: CommandSearchDialog,
};

export default CommandSearch;
