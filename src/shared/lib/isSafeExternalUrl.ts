/**
 * Разрешаем только http(s) для внешних ссылок.
 *
 * `new URL('javascript:alert(1)')` парсится успешно, поэтому валидаторы
 * «просто URL» (zod `.url()`, `new URL(...)`) пропускают javascript:/data:/
 * vbscript: схемы, включая обход регистра (`jAvAsCrIpT:`). Такие строки
 * потом попадают в `<a href>` и `window.open` — и исполняются в origin'е
 * приложения с cookie-сессией жертвы.
 */
const HTTP_PROTOCOLS = ['http:', 'https:'];

export const isSafeExternalUrl = (url: string): boolean => {
  try {
    return HTTP_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return false;
  }
};

/**
 * Валидация пользовательского ввода: домен без схемы («github.com/user»)
 * — законный пользовательский ввод, добавляем https сами. Схемные записи
 * проверяем строго: `javascript:`/`data:` не проходят ни в каком виде,
 * включая обход регистра (`jAvAsCrIpT:`) и пробелы вокруг.
 */
export const normalizeExternalUrl = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Есть ли явная схема? Ищем до первого `/`, `?`, `#` — иначе «vk.ru/path»
  // с двоеточием в хосте был бы принят за схему.
  const schemeMatch = trimmed.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/);
  if (schemeMatch) {
    return isSafeExternalUrl(trimmed) ? trimmed : null;
  }

  const withScheme = `https://${trimmed}`;
  return isSafeExternalUrl(withScheme) ? withScheme : null;
};
