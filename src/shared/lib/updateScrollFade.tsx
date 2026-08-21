export const updateScrollFade = (wrapper: HTMLElement, list: HTMLElement, isRow: boolean = false) => {
  const scrollPos = isRow ? list.scrollLeft : list.scrollTop
  const scrollSize = isRow ? list.scrollWidth : list.scrollHeight
  const clientSize = isRow ? list.clientWidth : list.clientHeight

  const maxScroll = scrollSize - clientSize

  wrapper.classList.toggle('no-scroll-start', scrollPos <= 0)
  wrapper.classList.toggle('no-scroll-end', scrollPos >= maxScroll - 1)
}
