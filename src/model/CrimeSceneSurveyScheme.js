import {z} from "zod";
import {StructuredOutputParser} from "langchain/output_parsers";

const CrimeSceneSurveyScheme = z.object({
    target: z.string().describe("survey target"),
    describe: z.string().describe("describe target")
});
export const CrimeSceneSurveyParser = StructuredOutputParser.fromZodSchema(CrimeSceneSurveyScheme);