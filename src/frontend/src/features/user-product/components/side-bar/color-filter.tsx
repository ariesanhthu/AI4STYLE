import { Check } from "lucide-react";

interface ColorFilterProps {
  selectedColors?: string[];
  onChange: (colors: string[]) => void;
}

export const COLORS = [
  { name: "Đen", value: "#000000", code: "#000000" },
  { name: "Trắng", value: "#FFFFFF", code: "#FFFFFF" },
  { name: "Xám", value: "#808080", code: "#808080" },
  { name: "Xanh Navy", value: "#000080", code: "#000080" },
  { name: "Đỏ", value: "#FF0000", code: "#FF0000" },
  { name: "Vàng", value: "#FFFF00", code: "#FFFF00" },
  { name: "Xanh lá", value: "#008000", code: "#008000" },
  { name: "Xanh dương", value: "#0000FF", code: "#0000FF" },
  { name: "Nâu", value: "#A52A2A", code: "#A52A2A" },
  { name: "Be", value: "#F5F5DC", code: "#F5F5DC" },
];

export function ColorFilter({
  selectedColors = [],
  onChange,
}: ColorFilterProps) {
  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onChange(selectedColors.filter((c) => c !== color));
    } else {
      onChange([...selectedColors, color]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">Màu sắc</h3>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => {
          const isSelected = selectedColors.includes(color.value);
          return (
            <button
              key={color.value}
              onClick={() => toggleColor(color.value)}
              className={`group relative flex h-8 w-8 items-center justify-center rounded-full border ${
                isSelected
                  ? "border-black ring-1 ring-black"
                  : "border-gray-200"
              } hover:border-gray-400`}
              title={color.name}
            >
              <span
                className="h-6 w-6 rounded-full border border-black/10"
                style={{ backgroundColor: color.code }}
              />
              {isSelected && (
                <span
                  className={`absolute inset-0 flex items-center justify-center ${
                    color.value === "#FFFFFF" || color.value === "#F5F5DC"
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
