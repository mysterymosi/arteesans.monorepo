import { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/cn";

type SelectTriggerProps = {
  displayText: string;
  hasValue: boolean;
  error?: string;
  multiline?: boolean;
  onPress: () => void;
};

/** Figma 36:2327 — bordered select control with chevron */
function SelectTrigger({ displayText, hasValue, error, multiline, onPress }: SelectTriggerProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-between rounded-xl border bg-surface px-3",
        multiline ? "min-h-10 py-3.5" : "h-10",
        error ? "border-danger" : "border-line-input",
      )}
    >
      <Text
        className={cn("flex-1 text-base leading-5", hasValue ? "text-ink" : "text-[#949ba9]")}
        numberOfLines={multiline ? 2 : 1}
        style={{ includeFontPadding: false }}
      >
        {displayText}
      </Text>
      <Image source={icons.chevronDown} style={{ width: 16, height: 16 }} contentFit="contain" />
    </Pressable>
  );
}

type SelectFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: string;
};

export function SelectField({
  label,
  placeholder = "Select",
  value,
  options,
  onChange,
  error,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label;
  const displayText = selectedLabel ?? placeholder;

  return (
    <View className="gap-1.5">
      <Text className="text-sm text-ink">{label}</Text>
      <SelectTrigger
        displayText={displayText}
        hasValue={Boolean(selectedLabel)}
        error={error}
        onPress={() => setOpen(true)}
      />
      {error ? <Text className="text-xs font-medium text-danger">{error}</Text> : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setOpen(false)}>
          <Pressable className="max-h-[60%] rounded-t-3xl bg-surface px-4 pb-8 pt-4" onPress={() => { }}>
            <Text className="mb-3 font-medium text-base text-ink">{label}</Text>
            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="border-b border-line py-3"
                >
                  <Text className={cn("text-base", value === option.value ? "font-medium text-primary" : "text-ink")}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

type MultiSelectFieldProps = {
  label: string;
  placeholder?: string;
  values: string[];
  options: { value: string; label: string }[];
  onChange: (values: string[]) => void;
  error?: string;
};

export function MultiSelectField({
  label,
  placeholder = "you can select more than one",
  values,
  options,
  onChange,
  error,
}: MultiSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selectedLabels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  function toggleValue(nextValue: string) {
    if (values.includes(nextValue)) {
      onChange(values.filter((value) => value !== nextValue));
      return;
    }
    onChange([...values, nextValue]);
  }

  return (
    <View className="gap-1.5">
      <Text className="text-sm text-ink">{label}</Text>
      <SelectTrigger
        displayText={selectedLabels || placeholder}
        hasValue={Boolean(selectedLabels)}
        error={error}
        multiline
        onPress={() => setOpen(true)}
      />
      {error ? <Text className="text-xs font-medium text-danger">{error}</Text> : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setOpen(false)}>
          <Pressable className="max-h-[60%] rounded-t-3xl bg-surface px-4 pb-8 pt-4" onPress={() => { }}>
            <Text className="mb-3 font-medium text-base text-ink">{label}</Text>
            <ScrollView>
              {options.map((option) => {
                const selected = values.includes(option.value);
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    onPress={() => toggleValue(option.value)}
                    className="flex-row items-center justify-between border-b border-line py-3"
                  >
                    <Text className={cn("text-base", selected ? "font-medium text-primary" : "text-ink")}>
                      {option.label}
                    </Text>
                    {selected ? <Text className="text-primary">✓</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpen(false)}
              className="mt-4 items-center rounded-xl bg-primary py-3"
            >
              <Text className="font-medium text-white">Done</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
