export const mapDateToLocalString = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()
  return `${day}.${month}.${year}`
}

export const mapDateToBackendString = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()
  return `${year}-${month}-${day}`
}

/**
 @param date Строка формата YYYY-MM-DD
 */
export const mapStringToDate = (date: string): Date => {
  const [year, month, day] = date.split('-').map(Number)
  if (!year || !month || !day) throw new Error('Формат строки должен быть в виде YYYY-MM-DD')
  return new Date(year, month - 1, day)
}
