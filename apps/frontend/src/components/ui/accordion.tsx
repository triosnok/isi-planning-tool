import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  AccordionContentProps,
  AccordionItemProps,
  Accordion as AccordionPrimitive,
  AccordionTriggerProps,
} from '@kobalte/core/accordion';

import { cn } from '@/lib/utils';
import { PolymorphicProps } from '@kobalte/core/polymorphic';
import { IconChevronDown } from '@tabler/icons-solidjs';

const Accordion = AccordionPrimitive;

const AccordionItem: Component<PolymorphicProps<'div', AccordionItemProps>> = (
  props
) => {
  const [, rest] = splitProps(props, ['class']);
  return <AccordionPrimitive.Item class={cn('', props.class)} {...rest} />;
};

const AccordionTrigger: Component<
  PolymorphicProps<'div', AccordionTriggerProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <AccordionPrimitive.Header class='flex'>
      <AccordionPrimitive.Trigger
        class={cn(
          '-mb-px flex flex-1 items-center justify-between border-y px-2 py-1 text-xl font-semibold transition-all [&[data-expanded]>svg]:rotate-180',
          'border-gray-300 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200',
          'dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:bg-gray-800',
          props.class
        )}
        {...rest}
      >
        {props.children}
        <IconChevronDown class='size-4 shrink-0 transition-transform duration-200' />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

const AccordionContent: Component<
  PolymorphicProps<'div', AccordionContentProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <AccordionPrimitive.Content
      class={cn(
        'animate-accordion-up data-[expanded]:animate-accordion-down overflow-hidden text-sm transition-all',
        props.class
      )}
      {...rest}
    >
      {props.children}
    </AccordionPrimitive.Content>
  );
};

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
