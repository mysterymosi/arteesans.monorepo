import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type OTPInputProps = {
  length?: number;
  value: string;
  onChange: (code: string) => void;
};

/** Six-box OTP entry backed by one hidden input (reliable paste + keyboard handling). */
export function OTPInput({ length = 6, value, onChange }: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const digits = value.padEnd(length).split("").slice(0, length);

  return (
    <Pressable onPress={() => inputRef.current?.focus()}>
      <View className="flex-row justify-between gap-2">
        {digits.map((digit, i) => {
          const isActive = focused && i === Math.min(value.length, length - 1);
          return (
            <View
              key={i}
              className={`h-14 flex-1 items-center justify-center rounded-xl border bg-surface ${isActive ? "border-primary" : "border-line-strong"}`}
            >
              <Text className="font-semibold text-xl text-ink">{digit.trim()}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, "").slice(0, length))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        className="absolute h-0 w-0 opacity-0"
      />
    </Pressable>
  );
}
