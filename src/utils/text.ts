export const formatOcrText = (text: string | undefined): string => {
  if (!text) return ""

  return text
    .replace(/''/g, "'")
    .replace(/[®=º°©¬µ$]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
