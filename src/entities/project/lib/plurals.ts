export const getProjectPlural = (count: number): string => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod100 >= 11 && mod100 <= 19) {
    return `${count} проектов`
  }
  if (mod10 === 1) {
    return `${count} проект`
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${count} проекта`
  }
  return `${count} проектов`
}

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