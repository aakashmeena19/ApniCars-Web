// src/modules/newCars/powertrainIce/powertrainIce.types.ts

import type { FuelType } from './powertrainIce.validation';

export interface AttributeOptionSummary {
  id: number;
  name: string;
  slug: string;
}

// Transmission now lives only on CarVariant (single source of truth —
// CarPowertrainIce's own transmissionType/transmissionSubType were
// removed as duplicates of it), so it's surfaced here via the variant.
export interface PowertrainIceVariantSummary {
  id: number;
  variantName: string;
  transmission: AttributeOptionSummary;
  model: { id: number; name: string; brand: { id: number; name: string } };
}

export interface PowertrainIceRecord {
  id: number;
  variantId: number;
  fuelType: FuelType;
  engineType: string | null;
  fuelTankCapacity: string | null;
  cngTankCapacity: string | null;
  kerbWeight: number | null;
  displacementCc: number | null;
  cylinders: number | null;
  numGears: number | null;
  isFourByFour: boolean;
  drivetrainId: number | null;
  drivetrain: AttributeOptionSummary | null;
  powerPs: number | null;
  powerMinRpm: number | null;
  powerMaxRpm: number | null;
  torqueNm: number | null;
  torqueMinRpm: number | null;
  torqueMaxRpm: number | null;
  claimedFe: string | null;
  realWorldMileage: string | null;
  topSpeedKmph: number | null;
  acceleration0To100Sec: string | null;
  emissionNormCompliance: string | null;
  turboCharger: boolean;
  isDefault: boolean;
  isDeleted: boolean;
  deletedBy: number | null;
  deletedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  variant: PowertrainIceVariantSummary;
}

// What the listing table actually renders — everything else (mileage,
// speed, sub-specs, etc.) is fetched on demand via getById when a row is
// expanded, instead of being shipped on every list call.
export interface PowertrainIceListItem {
  id: number;
  variantId: number;
  fuelType: FuelType;
  engineType: string | null;
  displacementCc: number | null;
  powerPs: number | null;
  torqueNm: number | null;
  isDefault: boolean;
  isDeleted: boolean;
  createdAt: Date;
  variant: PowertrainIceVariantSummary;
}
