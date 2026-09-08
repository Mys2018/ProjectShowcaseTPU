import { useCallback } from 'react';
import { usePlatforms } from '../api/queries';
import { findPlatformName } from './findPlatformName';

export const usePlatformFinder = () => {
  const query = usePlatforms();

  const getPlatformName = useCallback(
    (platformId?: string): string => {
      return findPlatformName(query.data, platformId);
    },
    [query.data]
  );

  return {
    platformsData: query.data,
    findPlatformName: getPlatformName,
    query,
  };
};
