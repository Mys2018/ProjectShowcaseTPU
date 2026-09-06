export const calculateProgress = (fieldsToCheck: unknown[]): number => {
  if (!fieldsToCheck || fieldsToCheck.length === 0) return 0;

  const filledCount = fieldsToCheck.filter((val) => {
    if (val === undefined || val === null) return false;

    if (typeof val === 'number') {
      return val > 0;
    }

    if (typeof val === 'string') {
      return val.trim().length > 0;
    }

    if (Array.isArray(val)) {
      if (val.length === 0) return false;
      return val.some((item) => {
        if (typeof item === 'string') return item.trim().length > 0;
        if (typeof item === 'object' && item !== null) {
          return Object.values(item).some((v) => {
            if (typeof v === 'string') return v.trim().length > 0;
            return Boolean(v);
          });
        }
        return Boolean(item);
      });
    }

    if (typeof val === 'object') {
      return Object.values(val).some((v) => {
        if (typeof v === 'string') return v.trim().length > 0;
        return Boolean(v);
      });
    }

    return Boolean(val);
  }).length;

  return Math.round((filledCount / fieldsToCheck.length) * 100);
};
