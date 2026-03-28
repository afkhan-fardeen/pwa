const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

export type SalahState = Record<(typeof PRAYERS)[number], string>;

const MALE_DEFAULT = {
  fajr: "BA_JAMAAT",
  dhuhr: "BA_JAMAAT",
  asr: "BA_JAMAAT",
  maghrib: "BA_JAMAAT",
  isha: "BA_JAMAAT",
} as const;

const FEMALE_DEFAULT = {
  fajr: "ON_TIME",
  dhuhr: "ON_TIME",
  asr: "ON_TIME",
  maghrib: "ON_TIME",
  isha: "ON_TIME",
} as const;

export function defaultSalahForGender(
  genderUnit: "MALE" | "FEMALE",
): SalahState {
  return genderUnit === "MALE"
    ? { ...MALE_DEFAULT }
    : { ...FEMALE_DEFAULT };
}
