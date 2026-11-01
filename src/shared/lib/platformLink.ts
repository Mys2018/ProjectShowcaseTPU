/**
 * Подпись платформы не должна расходиться с адресом ссылки: иначе пользователь
 * видит «GitHub», а переходит на посторонний сайт.
 *
 * Для GitLab, Jira и YouTrack адрес не ограничен облачным доменом: их
 * разворачивают на своих серверах (gitlab.company.ru, jira.company.ru).
 */
const PLATFORM_HOSTS: Record<string, { domains: string[]; selfHosted?: boolean }> = {
  github: { domains: ['github.com'] },
  gitlab: { domains: ['gitlab.com', 'tpu.ru'], selfHosted: true },
  jira: { domains: ['atlassian.net', 'tpu.ru'], selfHosted: true },
  youtrack: { domains: ['youtrack.cloud', 'myjetbrains.com', 'tpu.ru'], selfHosted: true },
  figma: { domains: ['figma.com'] },
  miro: { domains: ['miro.com'] },
};

const parseUrl = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

export const isHttpsUrl = (url: string): boolean => parseUrl(url)?.protocol === 'https:';

/** Платформы не из списка не проверяем: их домен неизвестен. */
export const isLinkMatchingPlatform = (platformName: string, url: string): boolean => {
  const platformKey = platformName.trim().toLowerCase();
  const platform = PLATFORM_HOSTS[platformKey];
  if (!platform) return true;

  const hostname = parseUrl(url)?.hostname.toLowerCase();
  if (!hostname) return false;

  const isKnownDomain = platform.domains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
  return isKnownDomain || (!!platform.selfHosted && hostname.split('.').includes(platformKey));
};

/** Если адрес не относится к платформе, вместо её названия показываем реальный домен. */
export const getPlatformLinkLabel = (platformName: string, url: string): string => {
  if (isLinkMatchingPlatform(platformName, url)) return platformName;
  return parseUrl(url)?.hostname ?? platformName;
};
