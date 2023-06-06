import {z} from "zod";
import {StructuredOutputParser} from "langchain/output_parsers";

const GuessingScheme = z.object({
    isTrue: z.boolean().describe("the result of reasoning. If I matched the murderer with the motive and the murder method, mark it true."),
    hint: z.string().describe("If my reasoning is not correct, give some hint.(you shouldn't tell the murderer directly)")
});
export const GuessingParser = StructuredOutputParser.fromZodSchema(GuessingScheme);