export const getAvatarRoleInfo = (roles?: ({ type: string } | string)[]): { fallback: 'admin' | 'moder' | 'mentor', label: string } | undefined => {
  const hasRole = (roleName: string) =>
    roles?.some(r => (typeof r === 'string' ? r === roleName : r.type === roleName));

  if (hasRole('Admin')) return { fallback: 'admin', label: 'admin' };
  if (hasRole('Moderator')) return { fallback: 'moder', label: 'moder' };
  if (hasRole('Mentor')) return { fallback: 'mentor', label: 'mentor' };
  return undefined;
};
