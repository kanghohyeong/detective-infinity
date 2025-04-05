import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

const InterviewScheme = z.object({
    answer: z.string().describe("answer")
});

export const InterviewParser = StructuredOutputParser.fromZodSchema(InterviewScheme); 