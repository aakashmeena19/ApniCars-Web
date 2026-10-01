import { describe, expect, it } from 'vitest';
import { resolvePublicCarCoverImage } from './publicCarImage';

describe('resolvePublicCarCoverImage', () => {
  it('uses the body type placeholder for upcoming models', () => {
    expect(
      resolvePublicCarCoverImage({
        launchStatus: 'upcoming',
        coverImageUrl: '/uploads/cars/real-car.avif',
        bodyType: { upcomingPlaceholderImageUrl: '/uploads/bodytypes/hidden-car.avif' },
      }),
    ).toBe('/uploads/bodytypes/hidden-car.avif');
  });

  it('does not expose the real cover when an upcoming placeholder is missing', () => {
    expect(
      resolvePublicCarCoverImage({
        launchStatus: 'upcoming',
        coverImageUrl: '/uploads/cars/real-car.avif',
        bodyType: { upcomingPlaceholderImageUrl: null },
      }),
    ).toBeNull();
  });

  it('keeps the real cover for available models', () => {
    expect(
      resolvePublicCarCoverImage({
        launchStatus: 'available',
        coverImageUrl: '/uploads/cars/real-car.avif',
        bodyType: { upcomingPlaceholderImageUrl: '/uploads/bodytypes/hidden-car.avif' },
      }),
    ).toBe('/uploads/cars/real-car.avif');
  });
});
