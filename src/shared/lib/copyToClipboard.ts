/**
 * Универсальная функция копирования в буфер обмена с поддержкой мобильных устройств
 * и небезопасных контекстов (HTTP при локальной разработке по IP).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Попытка через современный Clipboard API (работает в HTTPS / localhost)
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Игнорируем ошибку и пробуем fallback через execCommand
    }
  }

  // 2. Fallback через временный textarea и execCommand (для мобильных браузеров по HTTP / старых WebKit)
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // Стилизуем textarea так, чтобы он не вызывал скролла и не был виден
    textArea.style.position = 'fixed'
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    textArea.style.opacity = '0'
    textArea.style.pointerEvents = 'none'
    textArea.setAttribute('readonly', '')

    document.body.appendChild(textArea)

    // Выделяем текст (с поддержкой iOS Safari)
    textArea.focus()
    textArea.select()
    textArea.setSelectionRange(0, 99999)

    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}
