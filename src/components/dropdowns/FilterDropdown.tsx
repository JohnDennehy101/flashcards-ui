import { JSX } from "react"
import { Button } from "../buttons/Button"
import { Category, useFlashcards } from "../../context/FlashcardContext"

interface FilterPanelProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function FilterDropdown({
  isOpen,
  setIsOpen,
}: FilterPanelProps): JSX.Element | null {
  const {
    categories,
    selectedCategories,
    setSelectedCategories,
    selectedType,
    setSelectedType,
    selectedFile,
    selectedSection,
    setSelectedFile,
    availableFiles,
    setSelectedSection,
    availableSections,
  } = useFlashcards()

  if (!isOpen) return null

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev: Category[]) => {
      const isAlreadySelected = prev.some(
        (c: Category) => c.name === categoryName,
      )
      if (isAlreadySelected) {
        return prev.filter((c: Category) => c.name !== categoryName)
      } else {
        const categoryObject = categories.find(
          (c: Category) => c.name === categoryName,
        )
        return categoryObject ? [...prev, categoryObject] : prev
      }
    })
  }

  return (
    <div className="absolute top-full mt-2 left-0 z-50 w-[300px] md:w-[400px] bg-white border-2 border-neutral900 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase text-neutral400">
            Source File
          </label>
          <select
            value={selectedFile}
            onChange={e => {
              setSelectedFile(e.target.value)
              setSelectedSection("")
            }}
            className="w-full border-2 border-neutral900 rounded-lg p-2 text-sm outline-none focus:bg-yellow50"
          >
            <option value="">All Files</option>
            {availableFiles.map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase text-neutral400">
            Section
          </label>
          <select
            disabled={!selectedFile}
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="w-full border-2 border-neutral900 rounded-lg p-2 text-sm disabled:opacity-50 disabled:bg-neutral50"
          >
            <option value="">
              {selectedFile ? "All Sections" : "Select a file first"}
            </option>
            {availableSections.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black uppercase text-neutral400">
          Question Type
        </label>
        <div className="flex flex-wrap gap-2">
          {["qa", "mcq", "yes_no"].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? "" : type)}
              className={`px-3 py-1.5 rounded-md text-xs border-2 font-bold transition-all ${
                selectedType === type
                  ? "bg-yellow500 border-neutral900"
                  : "bg-white border-neutral200 text-neutral400 hover:border-neutral900"
              }`}
            >
              {type.toUpperCase().replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black uppercase text-neutral400">
          Categories
        </label>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border-2 border-neutral50 p-2 rounded-lg">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => toggleCategory(cat.name)}
              className={`px-2 py-1 rounded text-[11px] border-1.5 transition-all ${
                selectedCategories.some(c => c.name === cat.name)
                  ? "bg-neutral900 text-white border-neutral900"
                  : "bg-neutral50 border-neutral200 text-neutral600 hover:border-neutral900"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <Button
          text="Reset"
          className="flex-1 py-1"
          onClick={() => {
            setSelectedFile("")
            setSelectedSection("")
            setSelectedType("")
            setSelectedCategories([])
          }}
        />
        <Button
          text="Apply"
          className="flex-1 bg-yellow500 py-1 font-bold"
          onClick={() => setIsOpen(false)}
        />
      </div>
    </div>
  )
}
