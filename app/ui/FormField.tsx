import React from "react";
import { Label, Textarea, TextInput } from "flowbite-react";

export function FormField<T extends string | number>({
  label,
  textarea,
  ...p
}:
  | {
      textarea?: false;
      label: string;
      id: string;
      type?: string;
      placeholder?: string;
      value?: T;
      onChange?: (e: { target: { value: string } }) => void;
    }
  | {
      textarea: true;
      label: string;
      id: string;
      placeholder?: string;
      value?: T;
      rows: number;
      onChange?: (e: { target: { value: string } }) => void;
    }) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="a" value={label} />
      </div>
      {textarea ? <Textarea {...p} /> : <TextInput {...p} />}
    </div>
  );
}
