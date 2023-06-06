import {z} from "zod";
import {StructuredOutputParser} from "langchain/output_parsers";

const InterviewScheme = z.object({
    interviewee: z.string().describe("name of interviewee"),
    answer: z.string().describe("answer")
});
export const InterviewParser = StructuredOutputParser.fromZodSchema(InterviewScheme);