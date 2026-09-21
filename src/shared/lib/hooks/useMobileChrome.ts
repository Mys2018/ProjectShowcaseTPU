import { useEffect, useState } from 'react'

/** Ниже этой ширины включается мобильная шапка. */
export const MOBILE_BREAKPOINT = 1200

/** Высота хедера. */
const HEADER_H = 66
/** top панели поиска, когда страница в самом верху. */
const SEARCH_TOP_STATIC = 78
/** Насколько прилипшая панель заезжает на хедер, чтобы скругления состыковались. */
const HEADER_OVERLAP = 4
/** Порог накопления скролла, px. */
const REVEAL = 8
/** Ход нижней панели до полного ухода за экран: высота 56 плюс отступ и тень. */
const PANEL_TRAVEL = 88

export type SearchDockState =
  /** Панель в потоке под хедером: светлая, 345px, едет вместе с контентом. */
  | 'static'
  /** Панель прилипла к нижней границе хедера: тёмная, во всю ширину. */
  | 'header'
  /** Хедер спрятан, панель прилипла к верху экрана: тёмная, во всю ширину. */
  | 'top'

export interface MobileChromeState {
  headerTransform: string
  headerAnimate: boolean
  searchTop: number
  searchState: SearchDockState
  searchAnimate: boolean
  /** Сдвиг нижней панели вниз: она уезжает синхронно с хедером. */
  panelTransform: string
  panelAnimate: boolean
  /** Панель полностью за экраном — снимаем с неё клики. */
  panelHidden: boolean
}

const AT_TOP: MobileChromeState = {
  headerTransform: 'translateY(0)',
  headerAnimate: false,
  searchTop: SEARCH_TOP_STATIC,
  searchState: 'static',
  searchAnimate: false,
  panelTransform: 'translateY(0)',
  panelAnimate: false,
  panelHidden: false
}

/**
 * Скролл-поведение мобильной шапки: reveal-хедер плюс прилипающая панель поиска.
 *
 * Механика хедера — из MOBILE-HEADER-SCROLL.md (две зоны, порог накопления,
 * anchor в точке разворота). Источник y другой: страница здесь не скроллится
 * (MainLayout — 100svh + overflow: hidden), поэтому слушаем scroll на document
 * в фазе capture и берём y из e.target.scrollTop.
 *
 * Панель поиска едет вместе с контентом от SEARCH_TOP_STATIC и прилипает к
 * нижней границе хедера, где бы та ни находилась. Отсюда бесшовные стыки:
 * хедер на месте — панель на 62, хедер спрятан — панель на 0.
 *
 * Хук чистый (не требует ref), поэтому хедер и панель вызывают его независимо
 * и получают одинаковый результат — синхронизировать состояние между ними не нужно.
 *
 * @param enabled слушать скролл. На десктопе шапка обычная, и хук должен молчать.
 * @param resetKey сменился маршрут — начинаем с чистого состояния. Иначе спрятанный
 *   на прошлой странице хедер останется спрятанным и на новой, где скроллить может быть нечего.
 */
export function useMobileChrome(enabled = true, resetKey?: string): MobileChromeState {
  const [state, setState] = useState<MobileChromeState>(AT_TOP)

  useEffect(() => {
    setState(AT_TOP)
    if (!enabled) return

    let lastY = 0
    let pinned = true // показан ли хедер сейчас
    let anchor = 0 // точка разворота скролла
    let dir = 0 // 1 = вниз, -1 = вверх, 0 = не определено
    let scroller: HTMLElement | null = null
    let last = AT_TOP

    // Все transition теперь задаются инлайн, поэтому медиазапросом в CSS их уже
    // не отключить — «уменьшить движение» приходится учитывать здесь.
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const moving = (v: boolean) => v && !calm

    const apply = (el: HTMLElement) => {
      const y = Math.max(0, el.scrollTop) // clamp: iOS overscroll < 0

      let headerY: number
      let headerAnimate: boolean

      if (y <= HEADER_H) {
        // ВЕРХНЯЯ ЗОНА: хедер едет с контентом 1:1, без анимации
        if (y > lastY) {
          pinned = false
          headerY = -y
        } else {
          headerY = pinned ? 0 : -y
          if (y <= 0) pinned = true
        }
        // Гасим анимацию, только когда хедер реально тянется за контентом.
        // Если он стоит на месте, снятый transition обрубил бы уже идущее
        // появление, и хедер прыгал бы в конечное положение вместо доводки.
        headerAnimate = !(headerY === -y && y > 0)
        dir = 0
        anchor = y
      } else {
        // ГЛУБОКАЯ ЗОНА: pinned reveal с порогом накопления
        const d = y > lastY ? 1 : y < lastY ? -1 : dir
        if (d !== 0 && d !== dir) {
          dir = d
          anchor = lastY // разворот → anchor в точку разворота
        }
        if (dir === 1 && y - anchor >= REVEAL) pinned = false
        else if (dir === -1 && anchor - y >= REVEAL) pinned = true
        headerY = pinned ? 0 : -HEADER_H
        headerAnimate = true
      }

      // панель липнет к низу хедера, где бы он сейчас ни был, но не выше верха экрана
      const stickTop = Math.max(HEADER_H + headerY - HEADER_OVERLAP, 0)
      const flowTop = SEARCH_TOP_STATIC - y
      // спрятался хедер — панель прилипает сразу, не доезжая свои последние 12px:
      // иначе на этом отрезке мелькает светлая узкая плашка у пустого верха экрана
      const stuck = flowTop <= stickTop || headerY === -HEADER_H

      // Панель — зеркало хедера: уезжает и возвращается вместе с ним, доля хода
      // общая, поэтому разъехаться они не могут.
      const byHeader = -headerY / HEADER_H

      // Своя зона у нижнего края, симметричная верхней зоне хедера: последние
      // PANEL_TRAVEL пикселей панель выезжает за скроллом 1:1 и у самого низа
      // остаётся стоять вместо футера. Побеждает то, что показывает её больше.
      const byBottom = Math.max(0, el.scrollHeight - el.clientHeight - y) / PANEL_TRAVEL
      const panelOut = Math.min(byHeader, byBottom, 1)

      const next: MobileChromeState = {
        headerTransform: headerY === -HEADER_H ? 'translateY(-100%)' : `translateY(${headerY}px)`,
        headerAnimate: moving(headerAnimate),
        searchTop: stuck ? stickTop : flowTop,
        searchState: stuck ? (headerY === 0 ? 'header' : 'top') : 'static',
        // пока панель едет с контентом, анимация только смазывала бы движение
        searchAnimate: moving(stuck),
        panelTransform: `translateY(calc((100% + 32px + env(safe-area-inset-bottom, 0px)) * ${panelOut}))`,
        // в нижней зоне панель тянется за скроллом, там transition только тормозил бы
        panelAnimate: moving(byBottom >= byHeader && headerAnimate),
        panelHidden: panelOut >= 1
      }

      lastY = y

      // скролл сыплет событиями пачками; ререндерим, только когда что-то реально изменилось
      const same =
        next.headerTransform === last.headerTransform &&
        next.headerAnimate === last.headerAnimate &&
        next.searchTop === last.searchTop &&
        next.searchState === last.searchState &&
        next.searchAnimate === last.searchAnimate &&
        next.panelTransform === last.panelTransform &&
        next.panelAnimate === last.panelAnimate &&
        next.panelHidden === last.panelHidden
      if (same) return

      last = next
      setState(next)
    }

    // Когда контент схлопывается (поиск отфильтровал список), браузер подрезает
    // scrollTop, но события scroll на это не даёт. Без пересчёта получается тупик:
    // хедер спрятан, а проскроллить вверх, чтобы его вернуть, уже нечего.
    const contentWatcher = new MutationObserver(() => {
      if (scroller?.isConnected) apply(scroller)
    })

    const onScroll = (e: Event) => {
      const el = e.target
      if (!(el instanceof HTMLElement)) return

      if (el !== scroller) {
        // новый контейнер берём в работу, только если он реально скроллится, —
        // так отсекаются мелкие внутренние списки и дропдауны
        if (el.scrollHeight - el.clientHeight < HEADER_H) return
        scroller = el
        lastY = Math.max(0, el.scrollTop)
        anchor = lastY
        dir = 0
        contentWatcher.disconnect()
        contentWatcher.observe(scroller, { childList: true, subtree: true })
      }
      apply(el)
    }

    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true })
      contentWatcher.disconnect()
    }
  }, [enabled, resetKey])

  return state
}
