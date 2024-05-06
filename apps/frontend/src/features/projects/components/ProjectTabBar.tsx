import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { IconClipboardList, IconMap } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface ProjectTabBarProps {
  tabs: {
    project: {
      isActive: boolean;
      onPress: () => void;
    };
    map: {
      isActive: boolean;
      onPress: () => void;
    };
  };
}

const ProjectTabBar: Component<ProjectTabBarProps> = (props) => {
  const { t } = useTranslations();
  return (
    <div role='tablist' class='mx-auto grid grid-cols-2'>
      <TabButton
        isActive={props.tabs.project.isActive}
        icon={IconClipboardList}
        text={t('PROJECTS.PROJECT')}
        onClick={props.tabs.project.onPress}
      />
      <TabButton
        isActive={props.tabs.map.isActive}
        icon={IconMap}
        text={t('MAP.TITLE')}
        onClick={props.tabs.map.onPress}
      />
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean | undefined;
  icon: any;
  text: string | undefined;
  onClick: () => void;
}

const TabButton: Component<TabButtonProps> = (props) => {
  return (
    <button
      role='tab'
      type='button'
      onClick={props.onClick}
      class={cn(
        'border-gray flex flex-col items-center border-t-4 pb-1 pt-2 text-center transition-colors hover:bg-gray-200',
        props.isActive && 'border-brand-blue border-t-4'
      )}
    >
      <props.icon class={cn('size-10', props.isActive && 'text-brand-blue')} />
      <span class={cn(props.isActive && 'text-brand-blue')}>{props.text}</span>
    </button>
  );
};

export default ProjectTabBar;
