import { View } from "react-native";
import { Text } from "./text";
import { Image } from "expo-image";

type AvatarProps = {
  uri?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      className="items-center justify-center bg-primary-muted"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text className="font-medium text-primary" style={{ fontSize: size * 0.4 }}>
        {initials}
      </Text>
    </View>
  );
}
