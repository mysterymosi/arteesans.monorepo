import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { pickVerificationDocument } from "@/features/artisan-onboarding/services/verification-doc.service";

type FileUploadFieldProps = {
  title: string;
  required?: boolean;
  hint: string;
  fileName?: string | null;
  onPick: (uri: string, fileName: string) => void;
  onRemove: () => void;
  onError?: (message: string) => void;
  error?: string;
};

export function FileUploadField({
  title,
  required,
  hint,
  fileName,
  onPick,
  onRemove,
  onError,
  error,
}: FileUploadFieldProps) {
  async function handlePick() {
    const result = await pickVerificationDocument();
    if (result.error) {
      onError?.(result.error);
      return;
    }
    if (result.uri && result.fileName) {
      onPick(result.uri, result.fileName);
    }
  }

  return (
    <View className="gap-3">
      <View>
        <Text className="font-medium text-sm text-ink">
          {title}
          {required ? <Text className="text-danger"> *</Text> : null}
        </Text>
        <Text className="mt-1 text-base text-ink-muted">{hint}</Text>
      </View>

      {fileName ? (
        <View className="flex-row items-center justify-between rounded-lg bg-surface-muted px-2.5 py-1">
          <View>
            <Text className="font-medium text-xs text-ink">{fileName.replace(/\.[^.]+$/, "")}</Text>
            <Text className="text-[10px] text-ink-muted">500kb</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Remove file" onPress={onRemove}>
            <Image source={icons.xMark} style={{ width: 16, height: 16 }} contentFit="contain" />
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => void handlePick()}
          className="flex-row items-center justify-center gap-2 rounded-lg border border-dashed border-line px-6 py-2.5"
        >
          <Image source={icons.upload} style={{ width: 24, height: 24 }} contentFit="contain" />
          <Text className="font-medium text-sm text-ink">Choose File</Text>
          <Text className="text-xs text-ink-muted">(JPG, PNG) not more than 500kb</Text>
        </Pressable>
      )}

      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
    </View>
  );
}
