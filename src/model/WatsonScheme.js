import {z} from "zod";
import {StructuredOutputParser} from "langchain/output_parsers";

const WatsonScheme = z.object({
    answer: z.string().describe("answer")
});
export const WatsonParser = StructuredOutputParser.fromZodSchema(WatsonScheme);