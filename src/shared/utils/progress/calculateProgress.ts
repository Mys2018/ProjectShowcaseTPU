export const calculateProgress = (fieldsToCheck: unknown[]) => {
  if (!fieldsToCheck || fieldsToCheck.length === 0) return 0;

  const filledCount = fieldsToCheck.filter((val) => {
    if (Array.isArray(val)) {
      return val.some((item) => {
        if (typeof item === 'string') return item.trim().length > 0;
        return !!item;
      });
    }

    if (typeof val === 'object' && val !== null) {
      return Object.keys(val).length > 0;
    }

    if (typeof val === 'string') {
      return val.trim().length > 0;
    }

    return !!val;
  }).length;

  return Math.round((filledCount / fieldsToCheck.length) * 100)
}
