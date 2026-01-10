import { z } from "zod"

const baseSchema = z.object({
  question: z.string().min(1, "Question is required"),
  text: z.string().min(1, "Text is required"),
  categories: z.array(z.string()),
  section: z.string().optional(),
  section_type: z.string().optional(),
  source_file: z.string().optional(),
})

export const flashcardSchema = z.discriminatedUnion("flashcard_type", [
  baseSchema.extend({
    flashcard_type: z.literal("qa"),
    flashcard_content: z.object({
      answer: z.string().min(1, "Answer is required"),
      justification: z.string().optional(),
    }),
  }),
  baseSchema.extend({
    flashcard_type: z.literal("mcq"),
    flashcard_content: z.object({
      options: z.array(z.string()).min(2, "At least 2 options required"),
      correct_index: z.number().int(),
      justification: z.string().optional(),
    }),
  }),
  baseSchema.extend({
    flashcard_type: z.literal("yes_no"),
    flashcard_content: z.object({
      correct: z.boolean(),
      justification: z.string().optional(),
    }),
  }),
])

export type FlashcardFormValues = z.infer<typeof flashcardSchema>
