export function productImageUrl(path: string | null | undefined) {
  if (!path) return null;
  return `/api/public/produto-imagem/${path}`;
}
