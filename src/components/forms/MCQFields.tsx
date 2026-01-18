import { useFieldArray, Control, UseFormRegister, FieldErrors, useWatch, Controller } from "react-hook-form";
import { FlashcardFormValues } from "../../schemas/flashcard";
import { Button } from "../../components/buttons/Button.tsx";
import PlusIcon from "../../assets/images/icon-circle-plus.svg?react"
import DeleteIcon from "../../assets/images/icon-delete.svg?react"

type MCQFormValues = Extract<FlashcardFormValues, { flashcard_type: "mcq" }>;

interface MCQFieldsProps {
    control: Control<FlashcardFormValues>;
    register: UseFormRegister<FlashcardFormValues>;
    errors: FieldErrors<FlashcardFormValues>;
    setValue: (name: string, value: any) => void;
}

export const MCQFields = ({ control, register, errors, setValue }: MCQFieldsProps) => {
    const { fields, append, remove } = useFieldArray({
        control: control as any,
        name: "flashcard_content.options",
    });

    const contentErrors = errors.flashcard_content as FieldErrors<MCQFormValues["flashcard_content"]>;

    const correctIndex = useWatch({
        control,
        name: "flashcard_content.correct_index" as any
    });

    const handleRemove = (indexToRemove: number) => {
        if (fields.length <= 2) return;

        const currentSelection = Number(correctIndex);

        if (currentSelection === indexToRemove) {
            setValue("flashcard_content.correct_index", 0);
        } else if (currentSelection > indexToRemove) {
            setValue("flashcard_content.correct_index", currentSelection - 1);
        }

        remove(indexToRemove);
    };

    return (
        <div className="space-y-2">
            <label className="block font-medium mb-2 text-neutral900">
                Options <span className="text-neutral500 font-normal text-sm">(Select the correct answer)</span>
            </label>

            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 pb-2">
                    <Controller
                        control={control}
                        name="flashcard_content.correct_index"
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="radio"
                                id={`option-${index}`}
                                checked={Number(value) === index}
                                onChange={() => onChange(index)}
                                className="w-5 h-5 cursor-pointer accent-yellow500 shrink-0"
                            />
                        )}
                    />

                    <div className="flex-1 relative">
                        <input
                            {...register(`flashcard_content.options.${index}` as any, {
                                required: "Option text is required"
                            })}
                            placeholder={`Option ${index + 1}`}
                            className={`w-full p-4 border rounded-8 transition-all duration-200 outline-none ${
                                Number(correctIndex) === index
                                    ? 'border-yellow500 bg-yellow50/20 ring-1 ring-yellow500'
                                    : 'border-neutral-900 focus:border-yellow500'
                            }`}
                        />
                    </div>

                    {fields.length > 2 && (
                        <Button
                            type="button"
                            variant="icon"
                            onClick={() => handleRemove(index)}
                            icon={<DeleteIcon />}
                            className="p-2 hover:bg-neutral100 rounded-full transition-colors"
                        />
                    )}
                </div>
            ))}

            <div className="pt-2 space-y-1">
                {contentErrors?.options && (
                    <p className="text-red-600 text-sm italic">{contentErrors.options.message}</p>
                )}

                {contentErrors?.correct_index && (
                    <p className="text-red-600 text-sm font-medium">
                        ⚠️ Please select which option is correct
                    </p>
                )}
            </div>

            <Button
                type="button"
                text="Add Option"
                onClick={() => append("")}
                className="bg-neutral100 mt-2 hover:bg-neutral200"
                icon={<PlusIcon />}
                iconPosition="start"
            />
        </div>
    );
};