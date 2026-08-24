export const getCompetencyPlural = (count: number): string => {
  const mod10 = count % 10

  if (mod10 === 1) {
    return `${count} компетенция`
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${count} компетенции`
  }
  return `${count} компетенций`
}