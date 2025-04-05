import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

const GuessingScheme = z.object({
    grade: z.string().describe("grade"),
    hint: z.string().describe("hint")
});

export const GuessingParser = StructuredOutputParser.fromZodSchema(GuessingScheme); 