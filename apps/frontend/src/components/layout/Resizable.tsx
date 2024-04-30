import { cn } from '@/lib/utils';
import { IconGripVertical } from '@tabler/icons-solidjs';
import { Resizable as ResizablePrimitive } from 'corvu/resizable';
import { Component } from 'solid-js';

const ResizableHandle: Component = () => {
  const ctx = ResizablePrimitive.useContext();

  return (
    <ResizablePrimitive.Handle class='data-[active]:bg-brand-blue-400 dark:data-[active]:bg-brand-blue-400 group relative z-10 flex w-px items-center justify-center bg-gray-300 transition-colors data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full max-md:hidden dark:bg-gray-800'>
      <div class='flex w-fit items-center justify-center rounded-sm border border-gray-400 bg-gray-300 py-1 dark:border-gray-800 dark:bg-gray-900'>
        <IconGripVertical class='size-4 group-data-[orientation=vertical]:rotate-90' />
      </div>
    </ResizablePrimitive.Handle>
  );
};

const Resizable = {
  Root: ResizablePrimitive,
  Handle: ResizableHandle,
  Panel: ResizablePrimitive.Panel,
};

export default Resizable;
