export function extractBrandSlug(brandCarsSlug: string): string | null {
  return brandCarsSlug.endsWith("-cars") ? brandCarsSlug.slice(0, -5) : null;
}

export function getBrandCarsPath(brandSlug: string): string {
  return `/${brandSlug}-cars`;
}

export function getModelPath(brandSlug: string, modelSlug: string): string {
  return `${getBrandCarsPath(brandSlug)}/${modelSlug}`;
}

export function getVariantPath(brandSlug: string, modelSlug: string, variantSlug: string): string {
  return `${getModelPath(brandSlug, modelSlug)}/${variantSlug}`;
}

export function getModelPhotosPath(brandSlug: string, modelSlug: string): string {
  return `${getModelPath(brandSlug, modelSlug)}/photos`;
}

export function getModel360Path(brandSlug: string, modelSlug: string): string {
  return `${getModelPath(brandSlug, modelSlug)}/360-view`;
}
