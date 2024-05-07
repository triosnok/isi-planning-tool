import { useTranslations } from '@/features/i18n';
import { IconType, cn } from '@/lib/utils';
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
  isActive?: boolean;
  icon: IconType;
  text?: string;
  onClick: () => void;
}

const TabButton: Component<TabButtonProps> = (props) => {
  return (
    <button
      role='tab'
      type='button'
      onClick={props.onClick}
      class={cn(
        'border-gray flex flex-col items-center border-t-2 py-1 text-center text-xs transition-colors',
        props.isActive &&
          'border-brand-blue-500 dark:border-brand-blue-600 bg-brand-blue-50/40 dark:bg-brand-blue-950/60 text-brand-blue-500 dark:text-brand-blue-600'
      )}
    >
      <props.icon class='size-6' />
      <span>{props.text}</span>
    </button>
  );
};

export default ProjectTabBar;
