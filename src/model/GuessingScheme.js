import {z} from "zod";
import {StructuredOutputParser} from "langchain/output_parsers";

const GuessingScheme = z.object({
    grade: z.string().describe("Grade. If my reasoning is incomplete, just give me 'F'."),
    hint: z.string().describe("If my reasoning is not correct, give some hint. You must not tell the murderer directly. The hint is not to give the answer(truth). Else, fill this 'congratulation'")
});
export const GuessingParser = StructuredOutputParser.fromZodSchema(GuessingScheme);