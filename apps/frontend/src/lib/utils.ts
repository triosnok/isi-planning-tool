import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { JSX } from 'solid-js';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LayoutProps {
  children?: JSX.Element;
}

export type IconType = typeof import('@tabler/icons-solidjs').Icon123;
