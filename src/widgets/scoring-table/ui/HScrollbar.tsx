import { useEffect, useRef, useState, type RefObject } from 'react'
import styles from './HScrollbar.module.css'

interface HScrollbarProps {
  /** Горизонтальный скроллер таблицы — у него своя полоса скрыта. */
  target: RefObject<HTMLElement | null>
}

interface Thumb {
  /** Доли ширины дорожки: сколько видно и где ползунок. */
  size: number
  offset: number
}

/**
 * Полоса прокрутки под таблицей часов по макету. Появляется, только когда таблица не влезает.
 * Ползунок тянется мышью, клик по дорожке листает на экран. Для скринридера она лишняя:
 * саму таблицу и так можно прокрутить.
 */
export function HScrollbar({ target }: HScrollbarProps) {
  const [thumb, setThumb] = useState<Thumb | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; scrollLeft: number } | null>(null)

  useEffect(() => {
    const scroller = target.current
    if (!scroller) return

    const update = () => {
      const { scrollWidth, clientWidth, scrollLeft } = scroller
      // +1 — дробные ширины на масштабе экрана не должны рисовать полосу у влезающей таблицы
      if (scrollWidth <= clientWidth + 1) return setThumb(null)
      setThumb({ size: clientWidth / scrollWidth, offset: scrollLeft / scrollWidth })
    }

    update()
    scroller.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(scroller)
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild)
    return () => {
      scroller.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [target])

  if (!thumb) return null

  // пиксель ползунка → сколько пикселей таблицы
  const ratio = () => {
    const scroller = target.current
    const track = trackRef.current
    return scroller && track ? scroller.scrollWidth / track.clientWidth : 1
  }

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const scroller = target.current
    if (e.button !== 0 || !scroller) return
    e.stopPropagation()
    drag.current = { x: e.clientX, scrollLeft: scroller.scrollLeft }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const scroller = target.current
    if (!drag.current || !scroller) return
    scroller.scrollLeft = drag.current.scrollLeft + (e.clientX - drag.current.x) * ratio()
  }

  const endDrag = () => {
    drag.current = null
  }

  // клик мимо ползунка — на экран в ту сторону
  const page = (e: React.PointerEvent<HTMLDivElement>) => {
    const scroller = target.current
    const track = trackRef.current
    if (e.button !== 0 || !scroller || !track) return
    const clickAt = (e.clientX - track.getBoundingClientRect().left) / track.clientWidth
    const direction = clickAt < thumb.offset ? -1 : 1
    scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: 'smooth' })
  }

  return (
    <div ref={trackRef} className={styles.track} aria-hidden="true" onPointerDown={page}>
      <div
        className={styles.thumb}
        style={{ width: `${thumb.size * 100}%`, left: `${thumb.offset * 100}%` }}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
    </div>
  )
}
