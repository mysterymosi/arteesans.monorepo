import type { Coordinates } from "@/lib/geo";

export type SelectedAddress = {
  displayAddress: string;
  line1: string;
  cityLga: string | null;
  state: string | null;
  coords: Coordinates | null;
};
