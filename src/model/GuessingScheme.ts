import { z } from "zod";

export const GuessingScheme = z.object({
    grade: z.string().describe("grade"),
    hint: z.string().describe("hint")
});
