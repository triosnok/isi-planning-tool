import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { UserRole } from '@isi-insight/client';
import { RadioGroup } from '@kobalte/core';
import { Component, createSignal, onMount } from 'solid-js';

export interface UserRoleRadioProps {
  value?: UserRole;
  class?: string;
  onChange?: (value: UserRole) => void;
}

const UserRoleRadio: Component<UserRoleRadioProps> = (props) => {
  const [value, setValue] = createSignal<UserRole>(props.value ?? 'PLANNER');

  const { t } = useTranslations();

  onMount(() => {
    props.onChange?.(value())
  })

  const handleChange = (v: UserRole) => {
    setValue(v);
    props.onChange?.(v);
  };

  return (
    <RadioGroup.Root value={value()} onChange={handleChange}>
      <RadioGroup.Item value='PLANNER'>
        <RadioGroup.ItemInput />
        <RadioGroup.ItemControl
          class={cn(
            'flex select-none items-center gap-1 rounded-t-lg border px-3 py-2 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900',
            'ui-checked:border-brand-blue-500 ui-checked:dark:border-brand-blue-600 ui-checked:bg-brand-blue-50/40 ui-checked:dark:bg-brand-blue-950/60'
          )}
        >
          <RadioGroup.ItemIndicator
            forceMount
            role='figure'
            class={cn(
              'mr-2 h-2 w-2 rounded-full border-2 border-gray-400',
              'ui-checked:bg-brand-blue ui-checked:border-brand-blue'
            )}
          />
          <div>
            <RadioGroup.ItemLabel class='font-semibold'>
              {t('USERS.ROLES.PLANNER')}
            </RadioGroup.ItemLabel>
            <RadioGroup.ItemDescription class='text-xs text-gray-500'>
              {t('USERS.ROLES.PLANNER_DESCRIPTION')}
            </RadioGroup.ItemDescription>
          </div>
        </RadioGroup.ItemControl>
      </RadioGroup.Item>

      <RadioGroup.Item value='DRIVER'>
        <RadioGroup.ItemInput />
        <RadioGroup.ItemControl
          class={cn(
            'flex select-none  items-center gap-1 rounded-b-lg border px-3 py-2 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900',
            'ui-checked:border-brand-blue-500 ui-checked:dark:border-brand-blue-600 ui-checked:bg-brand-blue-50/40 ui-checked:dark:bg-brand-blue-950/60'
          )}
        >
          <RadioGroup.ItemIndicator
            forceMount
            role='figure'
            class={cn(
              'mr-2 h-2 w-2 rounded-full border-2 border-gray-400',
              'ui-checked:bg-brand-blue ui-checked:border-brand-blue'
            )}
          />
          <div>
            <RadioGroup.ItemLabel class='font-semibold'>
              {t('USERS.ROLES.DRIVER')}
            </RadioGroup.ItemLabel>
            <RadioGroup.ItemDescription class='text-xs text-gray-500'>
              {t('USERS.ROLES.DRIVER_DESCRIPTION')}
            </RadioGroup.ItemDescription>
          </div>
        </RadioGroup.ItemControl>
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
};

export default UserRoleRadio;
