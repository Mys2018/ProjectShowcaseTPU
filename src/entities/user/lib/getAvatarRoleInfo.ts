export const getAvatarRoleInfo = (roles?: { type: string }[]): { fallback: 'admin' | 'moder' | 'mentor', label: string } | undefined => {
  if (roles?.some(r => r.type === 'Admin')) return { fallback: 'admin', label: 'admin' };
  if (roles?.some(r => r.type === 'Moderator')) return { fallback: 'moder', label: 'moder' };
  if (roles?.some(r => r.type === 'Mentor')) return { fallback: 'mentor', label: 'mentor' };
  return undefined;
};
