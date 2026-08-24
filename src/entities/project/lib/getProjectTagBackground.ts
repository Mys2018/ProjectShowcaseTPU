export const getProjectTagBackground = (tag: string) => {
  switch (tag) {
    case 'Веб-разработка':
      return 'var(--grad-fiolet)'
    case 'Инженерия':
      return 'var(--grad-blue)'
    case 'E-commerce':
    case 'VR/AR':
      return 'var(--grad-orange)'
    case 'Мобайл-разработка':
      return 'var(--grad-green)'
    default:
      return 'var(--grad-blue)'
  }
}
