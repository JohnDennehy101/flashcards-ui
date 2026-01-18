import { JSX } from "react"

interface Category {
  name: string
  count: number
}

interface CategoryDropdownProps {
  categories: Category[]
  selectedCategories: Category[]
  onToggle: (categoryName: string) => void
  onClear: () => void
}

export function CategoryDropdown({
  categories,
  selectedCategories,
  onToggle,
  onClear,
}: CategoryDropdownProps): JSX.Element {
  return (
    <div className="absolute top-full left-0 mt-2 w-64 border border-neutral600 bg-white opacity-100 rounded-lg shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
      {selectedCategories.length > 0 && (
        <div className="p-2 border-b bg-neutral-50 flex justify-end items-center">
          <button
            onClick={onClear}
            className="text-xs text-yellow600 hover:text-yellow-700 font-semibold hover:underline px-2"
          >
            Clear Filters
          </button>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="p-4 text-sm text-neutral-500 bg-white italic">
          No categories found
        </div>
      ) : (
        categories.map(cat => {
          const isChecked = selectedCategories.some(
            selected => selected.name === cat.name,
          )

          return (
            <label
              key={cat.name}
              className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral600 last:border-0 bg-white group transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(cat.name)}
                  className="w-4 h-4 rounded border-neutral-300 text-yellow500 focus:ring-yellow500 cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-neutral-700 capitalize group-hover:text-neutral-900">
                    {cat.name}
                  </span>
                  <span className="text-xs text-neutral-400 font-normal">
                    ({cat.count})
                  </span>
                </div>
              </div>
            </label>
          )
        })
      )}
    </div>
  )
}
