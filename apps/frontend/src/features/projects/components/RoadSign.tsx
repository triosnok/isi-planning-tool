import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Component } from 'solid-js';

const signVariants = cva('border p-0.5 font-medium text-xs w-fit', {
  variants: {
    type: {
      EUROPE: 'bg-success-700 border-gray-50 rounded-sm',
      NATIONAL: 'bg-success-700 border-gray-50 rounded-sm',
      COUNTY: 'bg-gray-50 border-gray-950 rounded-sm',
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
