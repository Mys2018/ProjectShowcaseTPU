export const mapDateToLocalString = (date: Date, params?: { digitsOnly?: boolean; year?: boolean; time?: boolean }) =>
  params?.digitsOnly
    ? date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : date
        .toLocaleString('ru-RU', {
          day: 'numeric',
          month: 'long',
          ...(params?.time && { hour: '2-digit', minute: '2-digit' }),
          ...(params?.year && { year: 'numeric' })
        })
        .replace(' в ', ' в ')

export const mapDateToBackendString = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()
  return `${year}-${month}-${day}`
}

/**
 @param date Строка формата YYYY-MM-DD, ISO или DD.MM.YYYY
 */
export const mapStringToDate = (date: string): Date => {
  if (!date) return new Date()
  const d = new Date(date)
  if (!isNaN(d.getTime())) {
    return d
  }
  const parts = date.split(/[-.]/).map(Number)
  if (parts.length === 3 && !parts.some(isNaN)) {
    if (parts[0] > 1000) {
      return new Date(parts[0], parts[1] - 1, parts[2])
    } else {
      return new Date(parts[2], parts[1] - 1, parts[0])
    }
  }
  return new Date()
}
