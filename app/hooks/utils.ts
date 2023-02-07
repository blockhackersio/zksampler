import { useCallback } from "react";

type InputEvent = { target: { value: string } };

function fromEvent(e: InputEvent) {
  return e.target.value;
}

export function useNumericFieldChangeCallback<
  T extends { type: string; value: number }
>(type: T["type"], dispatch: React.Dispatch<T>) {
  return useCallback((e: InputEvent) => {
    dispatch({
      type,
      value: Number(fromEvent(e)),
    } as T);
  }, []);
}

export function useStringFieldChangeCallback<
  T extends { type: string; value: string }
>(type: T["type"], dispatch: React.Dispatch<T>) {
  return useCallback(
    (e: InputEvent) =>
      dispatch({
        type,
        value: fromEvent(e),
      } as T),
    []
  );
}
