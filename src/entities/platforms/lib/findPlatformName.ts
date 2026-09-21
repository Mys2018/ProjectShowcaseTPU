import type { GetPlatformsResponse } from '../model/types';

export const findPlatformName = (
  platformsData?: GetPlatformsResponse[],
  platformId?: string
): string => {
  if (!platformsData || !platformId) return 'Unknown';
  for (const group of platformsData) {
    const found = group.platforms?.find(p => p.platformId === platformId || (p as any).id === platformId);
    if (found) return found.name;
  }
  return 'Unknown';
};
