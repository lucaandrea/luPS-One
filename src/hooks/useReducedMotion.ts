import { useMediaQuery } from './useMediaQuery';

/**
 * Hook to detect if the user prefers reduced motion
 * @returns Boolean indicating if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}