import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Component } from 'solid-js';

const signVariants = cva('border-2 p-1', {
  variants: {
    type: {
      E: 'bg-success-500 border-gray-50 rounded-sm',
      R: 'bg-success-500 border-gray-50 rounded-sm',
      F: 'bg-gray-50 border-gray-950 rounded-sm',
    },
  },
});

export interface RoadSignProps extends VariantProps<typeof signVariants> {
  name: string;
}

const RoadSign: Component<RoadSignProps> = (props) => {
  return (
    <div class={cn(signVariants({ type: props.type }))}>
      <span>{props.name}</span>
    </div>
  );
};

export default RoadSign;
