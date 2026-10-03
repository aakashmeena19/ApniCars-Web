import type { ReactNode } from "react";

const LABELS: Record<string, string> = {
  fuelType: "Fuel type", engineType: "Engine", fuelTankCapacity: "Fuel tank", cngTankCapacity: "CNG tank",
  kerbWeight: "Kerb weight", displacementCc: "Displacement", cylinders: "Cylinders", numGears: "Gears",
  isFourByFour: "4x4", drivetrain: "Drivetrain", powerPs: "Power", torqueNm: "Torque", claimedFe: "Claimed mileage",
  realWorldMileage: "Real-world mileage", topSpeedKmph: "Top speed", acceleration0To100Sec: "0-100 km/h",
  emissionNormCompliance: "Emission norm", turboCharger: "Turbocharger", numMotors: "Motors", motorType: "Motor",
  batteryCapacity: "Battery", batteryChemistry: "Battery chemistry", thermalManagementSystem: "Thermal management",
  claimedRange: "Claimed range", realWorldRange: "Real-world range", acChargingOutput: "AC charging",
  acChargingTime: "AC charge time", dcChargingOutput: "DC charging", dcFastChargingTime: "DC fast charge",
  batteryWarrantyKm: "Battery warranty distance", batteryWarrantyYears: "Battery warranty period", batteryWarrantyRaw: "Battery warranty",
  motorWarrantyKm: "Motor warranty distance", motorWarrantyYears: "Motor warranty period", motorPowerKw: "Motor output",
  chargingPort: "Charging port", chargingOptionsRaw: "Charging options", regenerativeBraking: "Regeneration",
  regenerativeBrakingLevels: "Regen levels", length: "Length", width: "Width", height: "Height", wheelBase: "Wheelbase",
  groundClearance: "Ground clearance", bootSpace: "Boot space", frontSuspension: "Front suspension",
  rearSuspension: "Rear suspension", steeringType: "Steering", frontBrakeType: "Front brakes",
  rearBrakeType: "Rear brakes", vehicleWarrantyRaw: "Vehicle warranty",
};

const UNITS: Record<string, string> = {
  fuelTankCapacity: " L", cngTankCapacity: " kg", kerbWeight: " kg", displacementCc: " cc", powerPs: " PS",
  torqueNm: " Nm", claimedFe: " km/l", realWorldMileage: " km/l", topSpeedKmph: " km/h",
  acceleration0To100Sec: " sec", batteryCapacity: " kWh", claimedRange: " km", realWorldRange: " km",
  batteryWarrantyKm: " km", batteryWarrantyYears: " years", motorWarrantyKm: " km", motorWarrantyYears: " years",
  motorPowerKw: " kW", length: " mm", width: " mm", height: " mm", wheelBase: " mm", groundClearance: " mm", bootSpace: " L",
};

export function getSpecEntries(data: Record<string, string | number | boolean | null> | null) {
  if (!data) return [];
  return Object.entries(data).filter(([, value]) => value !== null && value !== "");
}

export function getSpecValue(key: string, value: string | number | boolean): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return `${value}${UNITS[key] ?? ""}`;
}

export default function CarSpecPanel({ icon, title, data, dark = false }: { icon: ReactNode; title: string; data: Record<string, string | number | boolean | null> | null; dark?: boolean }) {
  const items = getSpecEntries(data);
  if (items.length === 0) return null;
  return <section className={`overflow-hidden rounded-[8px] border ${dark ? "border-white/10 bg-[#11332a]" : "border-black/[0.08] bg-white dark:border-white/10 dark:bg-[#102720]"}`}>
    <div className={`flex items-center gap-2 border-b px-5 py-4 ${dark ? "border-white/10 text-[#c9ff49]" : "border-black/[0.07] bg-[#edf2ef] text-[#315548] dark:border-white/10 dark:bg-[#14352b] dark:text-[#c9ff49]"}`}>{icon}<h3 className={`text-[14px] font-semibold ${dark ? "text-white" : "text-[#18372d] dark:text-white"}`}>{title}</h3></div>
    <dl className="grid sm:grid-cols-2">{items.map(([key, value]) => <div key={key} className={`border-b px-5 py-3.5 odd:sm:border-r ${dark ? "border-white/10" : "border-black/[0.06] dark:border-white/10"}`}><dt className={`text-[9px] ${dark ? "text-white/42" : "text-[#7b8882] dark:text-white/38"}`}>{LABELS[key] ?? key}</dt><dd className="mt-1 text-[11px] font-semibold">{getSpecValue(key, value as string | number | boolean)}</dd></div>)}</dl>
  </section>;
}
