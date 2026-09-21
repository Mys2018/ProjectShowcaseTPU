import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FloatingPanel } from '@/shared/ui/floating-panel'
import { useMobileChrome } from '@/shared/lib'

/**
 * Панель для заглушки «Эта страница доступна только в веб-версии».
 * Целевое действие здесь — поделиться ссылкой, но по общему правилу «поделиться»
 * живёт в правом слоте. Поэтому центр берёт второй способ того же действия —
 * копирование в буфер, а системный share остаётся справа. Паттерн из трёх слотов
 * сохраняется, и страница не остаётся без «назад».
 */
export function WebOnlyPanel() {
  const { pathname } = useLocation()
  const { panelTransform, panelAnimate, panelHidden } = useMobileChrome(true, pathname)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    void navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <FloatingPanel transform={panelTransform} animate={panelAnimate} hidden={panelHidden}>
      <FloatingPanel.Back />
      <FloatingPanel.Action tone={copied ? 'muted' : 'violet'} onClick={copyLink}>
        {copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
      </FloatingPanel.Action>
      {/* TODO: системный share sheet — navigator.share, когда появится сама страница */}
      <FloatingPanel.Share />
    </FloatingPanel>
  )
}
