/** Nigerian states and sample LGAs for onboarding selects. */
export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export const CITIES_BY_STATE: Record<string, string[]> = {
  Lagos: ["Ikeja", "Lekki", "Surulere", "Yaba", "Ikorodu", "Epe", "Badagry"],
  FCT: ["Abuja Municipal", "Gwagwalada", "Kuje", "Bwari"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme"],
  Oyo: ["Ibadan North", "Ibadan South", "Ogbomoso"],
  Kano: ["Kano Municipal", "Nassarawa", "Fagge"],
};

export function citiesForState(state: string): string[] {
  return CITIES_BY_STATE[state] ?? ["Other"];
}
