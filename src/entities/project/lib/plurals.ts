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

export const getScorePlural = (count: number): string => {
  const mod10 = Math.abs(Math.round(count)) % 10
  const mod100 = Math.abs(Math.round(count)) % 100

  if (mod100 >= 11 && mod100 <= 19) {
    return `${count} баллов`
  }
  if (mod10 === 1) {
    return `${count} балл`
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${count} балла`
  }
  return `${count} баллов`
}

export const getScoreWord = (count: number): string => {
  const mod10 = Math.abs(Math.round(count)) % 10
  const mod100 = Math.abs(Math.round(count)) % 100

  if (mod100 >= 11 && mod100 <= 19) {
    return 'баллов'
  }
  if (mod10 === 1) {
    return 'балл'
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'балла'
  }
  return 'баллов'
}