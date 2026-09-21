import { useRef } from 'react'

/**
 * Полоса прокрутки у таблиц часов скрыта, поэтому мышью листаем перетаскиванием.
 * Тачпад и палец скроллят нативно — их не трогаем. Обработчики вешаются на скроллер.
 */
export const useDragScroll = () => {
  const drag = useRef<{ x: number; scrollLeft: number } | null>(null)

  const end = (e: React.PointerEvent<HTMLElement>) => {
    drag.current = null
    delete e.currentTarget.dataset.dragging
  }

  return {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      drag.current = { x: e.clientX, scrollLeft: e.currentTarget.scrollLeft }
      e.currentTarget.setPointerCapture(e.pointerId)
      e.currentTarget.dataset.dragging = ''
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (!drag.current) return
      e.currentTarget.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.x)
    },
    onPointerUp: end,
    onPointerCancel: end
  }
}
