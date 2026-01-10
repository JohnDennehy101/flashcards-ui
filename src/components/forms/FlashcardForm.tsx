import {useFieldArray, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlashcardFormValues, flashcardSchema } from "../../schemas/flashcard.ts";
import { MCQFields } from "../../components/forms/MCQFields.tsx";
import PlusIcon from "../../assets/images/icon-circle-plus.svg?react"
import DeleteIcon from "../../assets/images/icon-delete.svg?react"
import ErrorIcon from "../../assets/images/icon-error.svg?react"
import {Button} from "../../components/buttons/Button.tsx";


export function FlashcardForm() {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors }
    } = useForm<FlashcardFormValues>({
        resolver: zodResolver(flashcardSchema),
        defaultValues: {
            flashcard_type: "qa",
            question: "",
            text: "",
            flashcard_content: { answer: "", justification: "" } as any,
            categories: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "categories" as any
    });

    const selectedType = watch("flashcard_type");

    const onSubmit = async (data: FlashcardFormValues) => {
        try {
            const response = await fetch("/v1/flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
            } else {
                console.log("Success!");
            }
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full border bg-neutral0 border-neutral-900 rounded-12">

            <div className="p-4 w-full h-auto">
                <div className="pb-4">
                    <select {...register("flashcard_type")} className="border border-neutral-900 placeholder-neutral-600 p-3 rounded-6">
                        <option value="qa">Q&A</option>
                        <option value="mcq">Multiple Choice</option>
                        <option value="yes_no">True/False</option>
                    </select>
                </div>

                <div className="pb-4">
                <label>Question</label>
                <input {...register("question")} placeholder="e.g., What is the name of the order related to intellectual property claims?" className="border border-neutral-900 placeholder-neutral-600 p-4 mt-2 w-full rounded-6" />
                {errors.question && <div className="flex flex-row items-center gap-1.5">
                    <Button text={""} variant={"icon"} onClick={() => {}} icon={<ErrorIcon />} iconPosition={"start"} className="pt-2" /><p className="text-pink700 text-preset5 pt-2">{errors.question.message}</p></div>}
            </div>


                {selectedType === "qa" && (
                    <fieldset className="pb-4">
                        <legend>Answer</legend>
                        <input
                            {...register("flashcard_content.answer" as const)}
                            placeholder="e.g., Order 5D"
                            className="border border-neutral-900 placeholder-neutral-600 p-4 mt-2 w-full rounded-6"
                        />
                        {errors.flashcard_content && 'answer' in errors.flashcard_content && (
                            <div className="flex flex-row items-center gap-1.5">
                                <Button text={""} variant={"icon"} onClick={() => {}} icon={<ErrorIcon />} iconPosition={"start"} className="pt-2" />
                            <p className="text-pink700 text-preset5 pt-2">{(errors.flashcard_content as any).answer?.message}</p>
                            </div>
                                )}
                    </fieldset>
                )}

                {selectedType === "yes_no" && (
                    <fieldset className="pb-4">
                        <label className="flex items-center gap-2">
                            <span>Is this statement true?</span>
                            <input type="checkbox" {...register("flashcard_content.correct" as const)} />
                        </label>
                    </fieldset>
                )}

                {selectedType === "mcq" && (
                    <div className="pb-4">
                    <MCQFields register={register} control={control} errors={errors} />
                    </div>
                )}

            <div className="pb-4">
                <label className="block font-medium">Source Text</label>
                <textarea {...register("text")} placeholder="e.g. Order 5D: Intellectual Property Claims[1] - Definitions 1. In this Order, unless the context or subject matter..." className="border border-neutral-900 placeholder-neutral-600 p-4 mt-2 w-full rounded-6" />
                {errors.text &&
                    <div className="flex flex-row items-center gap-1.5">
                        <Button text={""} variant={"icon"} onClick={() => {}} icon={<ErrorIcon />} iconPosition={"start"} className="pt-2" />
                        <p className="text-pink700 text-preset5 pt-2">{errors.text.message}</p> </div>}
            </div>

                <div className="pb-4">
                    <label className="block font-medium">Justification</label>
                    <textarea
                        {...register("flashcard_content.justification" as any)}
                        placeholder="E.g., Order 5D: Intellectual Property Claims"
                        className="border border-neutral-900 p-4 placeholder-neutral-600 placeholder-opacity-100 mt-2 w-full h-20 rounded-6"
                    />
                    <p className="text-xs text-gray-500">Provide context or a mnemonic to help with learning.</p>
                </div>

                <div className="pb-4">
                    <label className="block mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-1 px-2 py-1 rounded">
                                <div className="flex items-center gap-2 pb-2">
                                <input
                                    {...register(`categories.${index}` as const)}
                                    className="bg-neutral100 text-sm border p-3 placeholder-neutral-600 border-neutral-900 rounded-8"
                                    placeholder="Category name"
                                />
                                <Button text={""} variant={"icon"} onClick={() => remove(index)} icon={<DeleteIcon />} iconPosition={"start"} className="px-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button text={"Category"} onClick={() => append("")} className="bg-neutral100" icon={<PlusIcon />} iconPosition={"start"} />
                    {errors.categories && <div className="flex flex-row items-center gap-1.5">
                        <Button text={""} variant={"icon"} onClick={() => {}} icon={<ErrorIcon />} iconPosition={"start"} className="pt-2" /><p className="text-pink700 text-preset5 pt-2">{errors.categories.message}</p></div>}
                </div>




                <div className="pb-4">
                    <Button type={"submit"} text={"Create Card"} onClick={() => {}} icon={<PlusIcon />} iconPosition={"start"} className="bg-yellow500"  />
                </div>
            </div>
        </form>
    );
}