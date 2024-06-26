import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Component } from 'solid-js';

const signVariants = cva('border py-0.5 px-1 font-medium text-xs w-fit', {
  variants: {
    type: {
      EUROPE: 'bg-success-700 border-gray-50 rounded-sm text-gray-50',
      NATIONAL: 'bg-success-700 border-gray-50 rounded-sm text-gray-50',
      COUNTY: 'bg-gray-50 border-gray-950 rounded-sm text-gray-950',
      MUNICIPALITY: '',
      PRIVATE: '',
      FOREST: '',
      UNKNOWN: '',
    },
  },
});

export interface RoadSignProps extends VariantProps<typeof signVariants> {
  name: string;
  class?: string;
}

const RoadSign: Component<RoadSignProps> = (props) => {
  return (
    <div class={cn(signVariants({ type: props.type }), props.class)}>
      <span>{props.name}</span>
    </div>
  );
};

export default RoadSign;
