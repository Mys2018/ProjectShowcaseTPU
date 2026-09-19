/** Накопительный итог студента: пустые недели пропускаем. */
export const totalHours = (hours: (number | null)[]): number =>
  hours.reduce<number>((acc, v) => acc + (v ?? 0), 0)

/** Склонение «час»: 1 час, 2–4 часа, 5–20 часов, 21 час, 111 часов. */
export const pluralizeHours = (count: number): string => {
  const abs = Math.abs(Math.round(count))
  const lastTwo = abs % 100
  const lastOne = abs % 10

  if (lastTwo >= 11 && lastTwo <= 19) return `${count} часов`
  if (lastOne === 1) return `${count} час`
  if (lastOne >= 2 && lastOne <= 4) return `${count} часа`
  return `${count} часов`
}
