import { useFieldArray, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { FlashcardFormValues } from "../../schemas/flashcard";
import {Button} from "../../components/buttons/Button.tsx";
import PlusIcon from "../../assets/images/icon-circle-plus.svg?react"
import DeleteIcon from "../../assets/images/icon-delete.svg?react"

type MCQFormValues = Extract<FlashcardFormValues, { flashcard_type: "mcq" }>;

interface MCQFieldsProps {
    control: Control<FlashcardFormValues>;
    register: UseFormRegister<FlashcardFormValues>;
    errors: FieldErrors<FlashcardFormValues>;
}

export const MCQFields = ({ control, register, errors }: MCQFieldsProps) => {
    const { fields, append, remove } = useFieldArray({
        control: control as any,
        name: "flashcard_content.options",
    });

    const contentErrors = errors.flashcard_content as FieldErrors<MCQFormValues["flashcard_content"]>;

    return (
        <div>
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 pb-4">
                    <input
                        type="radio"
                        value={index}
                        {...register("flashcard_content.correct_index" as any, { valueAsNumber: true })}
                        className="w-4 h-4"
                    />

                    <input
                        {...register(`flashcard_content.options.${index}` as any)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 p-4 border border-neutral-900 rounded-8"
                    />
                    <Button text={""} variant={"icon"} onClick={() => remove(index)} icon={<DeleteIcon />} iconPosition={"start"} className="px-1" />
                </div>
            ))}

            {contentErrors?.options && (
                <p className="text-red-600 text-sm">{contentErrors.options.message}</p>
            )}

            <Button text={"Add Option"} onClick={() => append("")} className="bg-neutral100" icon={<PlusIcon />} iconPosition={"start"} />
        </div>
    );
};