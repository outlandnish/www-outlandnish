export const titleToSlug = (title: string) =>
  title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\W_]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
  