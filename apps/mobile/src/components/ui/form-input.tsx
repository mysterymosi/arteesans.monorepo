import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Input, type InputProps } from "./input";

type FormInputProps<T extends FieldValues> = Omit<InputProps, "value" | "onChangeText" | "error"> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormInput<T extends FieldValues>({ control, name, ...rest }: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          {...rest}
          value={value ?? ""}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
}
