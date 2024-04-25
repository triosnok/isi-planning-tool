import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { JSX } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { RailingStatus } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LayoutProps {
  children?: JSX.Element;
}

export type IconType = typeof import('@tabler/icons-solidjs').Icon123;

export const getRailingStatus = (captureGrade: number) => {
  if (captureGrade === 0) return RailingStatus.TODO;
  else if (captureGrade > 0 && captureGrade < 95) return RailingStatus.ERROR;
  return RailingStatus.OK;
};
