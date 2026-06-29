import { router } from "expo-router";
import { AddressPickerScreen } from "@/features/address";
import { useSaveArtisanProfileAddress } from "@/features/artisan";

export default function ArtisanAddressScreen() {
  const saveAddress = useSaveArtisanProfileAddress();

  return (
    <AddressPickerScreen
      isSaving={saveAddress.isPending}
      onReset={saveAddress.reset}
      onConfirm={async (resolved) => {
        await saveAddress.mutateAsync({
          line1: resolved.line1,
          cityLga: resolved.cityLga,
          state: resolved.state,
          coords: resolved.coords,
        });
        router.back();
      }}
    />
  );
}
