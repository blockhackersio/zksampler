import classNames from "classnames";
import React, { ReactNode } from "react";

export function Toggle(p: {
  off: ReactNode;
  on: ReactNode;
  onChange: () => void;
  value: boolean;
}) {
  return (
    <span className="inline-flex items-center cursor-pointer">
      <span
        onClick={p.onChange}
        className={classNames(
          "mr-3 text-sm  text-gray-900 dark:text-gray-300 w-14",
          p.value ? "font-medium" : "font-bold"
        )}
      >
        {p.off}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          onChange={p.onChange}
          type="checkbox"
          checked={p.value}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
      <span
        onClick={p.onChange}
        className={classNames(
          "ml-3 text-sm text-gray-900 dark:text-gray-300 cursor-pointer",
          p.value ? "font-bold" : "font-medium"
        )}
      >
        {p.on}
      </span>
    </span>
  );
}
