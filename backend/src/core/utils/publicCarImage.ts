interface PublicCarImageSource {
  launchStatus: string;
  coverImageUrl: string | null;
  bodyType: { upcomingPlaceholderImageUrl: string | null } | null;
}

export function resolvePublicCarCoverImage(car: PublicCarImageSource): string | null {
  return car.launchStatus === 'upcoming'
    ? car.bodyType?.upcomingPlaceholderImageUrl ?? null
    : car.coverImageUrl;
}
