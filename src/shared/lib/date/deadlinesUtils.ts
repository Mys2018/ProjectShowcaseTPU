export const parseDeadline = (deadline: string): Date | null => {
  const parts = deadline.split(/[-.]/);
  if (parts.length !== 3) return null;
  
  if (parts[0].length === 4) {
    // Format YYYY-MM-DD
    const [year, month, day] = parts;
    return new Date(Number(year), Number(month) - 1, Number(day));
  } else {
    // Format DD-MM-YYYY
    const [day, month, year] = parts;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
}

export const formatDeadline = (deadline: string): string => {
  const date = parseDeadline(deadline)
  if (!date) return deadline
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const getDaysUntil = (deadline: string): number | null => {
  const date = parseDeadline(deadline)
  if (!date) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = date.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const getPluralDays = (count: number): string => {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return 'дней';
  if (n1 > 1 && n1 < 5) return 'дня';
  if (n1 === 1) return 'день';
  return 'дней';
}