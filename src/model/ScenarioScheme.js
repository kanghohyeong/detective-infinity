import {z} from "zod";
import {StructuredOutputParser} from "langchain/output_parsers";

const VictimScheme = z.object({
    name: z.string().describe("name of victim"),
    gender: z.string().describe("gender(male or female)"),
    age: z.number().describe("age"),
    description: z.string().describe("A description of a victim's appearance and outfit for identification."),
    causeOfDeath: z.string().describe("cause of death")
});

const SuspectScheme = z.object({
    name: z.string().describe("name of suspect"),
    gender: z.string().describe("gender(male or female)"),
    age: z.number().describe("age"),
    description: z.string().describe("A description of a suspect's appearance and outfit for identification."),
    alibi: z.string().describe("alibi at the time of the incident"),
    story: z.string().describe("this suspect's story related to the case including a motive and opportunity to murder. Even if suspect is not a murderer, suspect must have a motive and opportunity for the murder."),
    isMurderer: z.boolean().describe("Whether this suspect is the murderer or not")
});

const ClearConditionScheme = z.object({
    name: z.string().describe("name of murderer"),
    how: z.string().describe("how to murder(method of murder)"),
    why: z.string().describe("why murder(motive of murder)")
});

const ScenarioScheme = z.object({
    title: z.string().describe("title of scenario"),
    victim: VictimScheme.describe("information of the victim"),
    crimeScene: z.string().describe("Describe the crime scene"),
    suspects: z.array(SuspectScheme).describe("information of the suspects"),
    clearCondition: ClearConditionScheme.describe("The truth of the murder that the player (== detective role) must reveal"),
    // murderStory: z.string().describe("the whole story of a murder. Include who is the murderer, why and how did murderer kill victim."),
    prologue: z.string().describe("prologue of the game."),
});

export const ScenarioParser = StructuredOutputParser.fromZodSchema(ScenarioScheme);