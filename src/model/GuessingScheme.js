import {z} from "zod";
import {StructuredOutputParser} from "langchain/output_parsers";

const GuessingScheme = z.object({
    isTrue: z.boolean().describe("the result of guessing. If my guessing matched the murderer(name), the motive(why) and the murder method(how) of truth, mark it true. If I get even one wrong, mark it false."),
    hint: z.string().describe("If my guessing is not correct, give some hint.(you shouldn't tell the murderer directly). Else, fill this 'congratulation'")
});
export const GuessingParser = StructuredOutputParser.fromZodSchema(GuessingScheme);