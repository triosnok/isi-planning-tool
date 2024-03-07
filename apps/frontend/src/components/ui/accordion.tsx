import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import { Accordion as AccordionPrimitive } from '@kobalte/core';
import { TbChevronDown } from 'solid-icons/tb';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem: Component<AccordionPrimitive.AccordionItemProps> = (
  props
) => {
  const [, rest] = splitProps(props, ['class']);
  return <AccordionPrimitive.Item class={cn('', props.class)} {...rest} />;
};

const AccordionTrigger: Component<AccordionPrimitive.AccordionTriggerProps> = (
  props
) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <AccordionPrimitive.Header class='flex'>
      <AccordionPrimitive.Trigger
        class={cn(
          '-mb-px flex flex-1 items-center justify-between border-y bg-gray-100 px-2 py-1 text-xl font-semibold transition-all hover:underline [&[data-expanded]>svg]:rotate-180',
          props.class
        )}
        {...rest}
      >
        {props.children}
        <TbChevronDown class='size-4 shrink-0 transition-transform duration-200' />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

const AccordionContent: Component<AccordionPrimitive.AccordionContentProps> = (
  props
) => {
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

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
