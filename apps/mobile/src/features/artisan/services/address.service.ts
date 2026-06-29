import type { Coordinates } from "@/lib/geo";
import { supabase } from "@/lib/supabase";

export type SaveArtisanProfileAddressInput = {
  line1: string;
  cityLga?: string | null;
  state?: string | null;
  coords?: Coordinates | null;
};

export async function saveArtisanProfileAddress(
  input: SaveArtisanProfileAddressInput,
): Promise<void> {
  const { error } = await supabase.rpc(
    "upsert_artisan_profile_address" as never,
    {
      p_address: input.line1,
      p_state: input.state ?? null,
      p_city_lga: input.cityLga ?? null,
      p_latitude: input.coords?.latitude ?? null,
      p_longitude: input.coords?.longitude ?? null,
    } as never,
  );

  if (error) throw error;
}
