import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FlashcardFormValues,
  flashcardSchema,
} from "../../schemas/flashcard.ts"
import { MCQFields } from "../../components/forms/MCQFields.tsx"
import PlusIcon from "../../assets/images/icon-circle-plus.svg?react"
import EditIcon from "../../assets/images/icon-edit.svg?react"
import DeleteIcon from "../../assets/images/icon-delete.svg?react"
import ErrorIcon from "../../assets/images/icon-error.svg?react"
import { Button } from "../../components/buttons/Button.tsx"
import { apiService } from "../../services/api.ts"
import { JSX, useEffect } from "react"
import { useSnackbar } from "../../context/SnackbarContext.tsx"

interface FlashcardFormProps {
  refresh: (force?: boolean | undefined) => Promise<void>
  initialData?: any
  onSuccess?: () => void
}

export function FlashcardForm({
  refresh,
  initialData,
  onSuccess,
}: FlashcardFormProps): JSX.Element {
  const isEditing = !!initialData

  const { showSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    resetField,
    setValue,
  } = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      flashcard_type: "qa",
      question: "",
      text: "",
      flashcard_content: { answer: "", justification: "" } as any,
      categories: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories" as any,
  })

  const selectedType = watch("flashcard_type")

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        categories: initialData.categories || [],
      })
    }
  }, [initialData, reset])

  useEffect(() => {
    if (!isEditing) {
      const defaults: Record<string, any> = {
        qa: { answer: "", justification: "" },
        mcq: { options: ["", ""], correct_index: 0, justification: "" },
        yes_no: { correct: true, justification: "" },
      }

      resetField("flashcard_content", {
        defaultValue: defaults[selectedType],
      })
    }
  }, [selectedType, resetField, isEditing])

  const onSubmit = async (data: FlashcardFormValues) => {
    try {
      const response = isEditing
        ? await apiService.updateFlashcard(initialData.id, data)
        : await apiService.createFlashcard(data)

      if (response.ok) {
        await refresh(true)
        showSnackbar(
          isEditing
            ? "Card updated successfully."
            : "Card created successfully.",
        )
        if (!isEditing) reset()
        onSuccess?.()
      }
    } catch (err) {
      console.error("Network error:", err)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${!isEditing ? "space-y-4" : ""} w-full bg-neutral0 rounded-12 ${!isEditing ? "border border-neutral-900" : ""}`}
    >
      <div
        className={`flex flex-col gap-4 w-full h-auto ${!isEditing ? "p-4" : ""}`}
      >
        <div className="pb-2">
          <select
            {...register("flashcard_type")}
            className="border border-neutral-900 p-3 rounded-6"
          >
            <option value="qa">Q&A</option>
            <option value="mcq">Multiple Choice</option>
            <option value="yes_no">True/False</option>
          </select>
        </div>

        <div>
          <label className="font-bold">Question</label>
          <input
            {...register("question")}
            className="border border-neutral-900 p-4 mt-2 w-full rounded-6"
          />
          {errors.question && (
            <div className="flex items-center gap-1.5 mt-2">
              <ErrorIcon className="text-pink700" />
              <p className="text-pink700 text-sm">{errors.question.message}</p>
            </div>
          )}
        </div>

        {selectedType === "qa" && (
          <fieldset>
            <legend className="font-bold">Answer</legend>
            <input
              {...register("flashcard_content.answer" as const)}
              className="border border-neutral-900 p-4 mt-2 w-full rounded-6"
            />
          </fieldset>
        )}

        {selectedType === "yes_no" && (
          <fieldset className="flex items-center gap-4 border border-neutral-100 p-4 rounded-6">
            <span className="font-bold">Correct Statement?</span>
            <input
              type="checkbox"
              {...register("flashcard_content.correct" as const)}
              className="w-6 h-6 accent-yellow500"
            />
          </fieldset>
        )}

        {selectedType === "mcq" && (
          <MCQFields
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold">Source Text</label>
            <textarea
              {...register("text")}
              className="border border-neutral-900 p-4 mt-2 w-full rounded-6 h-32"
            />
          </div>
          <div>
            <label className="font-bold">Justification</label>
            <textarea
              {...register("flashcard_content.justification" as any)}
              className="border border-neutral-900 p-4 mt-2 w-full rounded-6 h-32"
            />
          </div>
        </div>

        <div className="bg-neutral-50 p-4 rounded-8 border border-neutral-100">
          <label className="block mb-2 font-bold">Categories</label>
          <div className="flex flex-col gap-3 mb-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  {...register(`categories.${index}` as const)}
                  className="flex-1 border border-neutral-900 p-3 rounded-8"
                />
                <Button
                  type="button"
                  variant="icon"
                  onClick={() => remove(index)}
                  icon={<DeleteIcon />}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            text="Add Category"
            onClick={() => append("")}
            icon={<PlusIcon />}
            className="bg-neutral100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-8 border border-neutral-100">
          <div>
            <label className="text-xs font-bold uppercase text-neutral500">
              Section
            </label>
            <input
              {...register("section")}
              className="border border-neutral900 p-2 w-full rounded-6 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-neutral500">
              Section Type
            </label>
            <input
              {...register("section_type")}
              className="border border-neutral-900 p-2 w-full rounded-6 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-neutral500">
              Source File
            </label>
            <input
              {...register("source_file")}
              className="border border-neutral-900 p-2 w-full rounded-6 mt-1"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            text={isEditing ? "Update Card" : "Create Card"}
            icon={isEditing ? <EditIcon /> : <PlusIcon />}
            iconPosition="start"
            className="bg-yellow500 w-full md:w-auto py-4 px-8 text-lg"
          />
        </div>
      </div>
    </form>
  )
}
