import {z} from "zod";
import {StructuredOutputParser} from "langchain/output_parsers";

const VictimScheme = z.object({
    name: z.string().describe("name of victim"),
    gender: z.string().describe("gender(male or female)"),
    age: z.number().describe("age"),
    occupation: z.string().describe("occupation"),
    appearance: z.string().describe("A victim's appearance and outfit for identification."),
    description: z.string().describe("A description of a victim."),
    causeOfDeath: z.string().describe("cause of death")
});

const SuspectScheme = z.object({
    name: z.string().describe("name of suspect"),
    gender: z.string().describe("gender(male or female)"),
    age: z.number().describe("age"),
    occupation: z.string().describe("occupation"),
    appearance: z.string().describe("A suspect's appearance and outfit for identification."),
    alibi: z.string().describe("alibi"),
    motive: z.string().describe("motive for murder"),
    isMurderer: z.boolean().describe("Whether this suspect is the murderer or not"),
    story: z.string().describe("a story related to a case")
});

const TruthScheme = z.object({
    murderer: z.string().describe("name of murderer"),
    how: z.string().describe("how to murder(method of murder)"),
    why: z.string().describe("why murder(motive of murder)"),
    trick: z.string().describe("trick to escape"),
    loophole: z.string().describe("loophole in the trick")
});

const ScenarioScheme = z.object({
    title: z.string().describe("title of scenario"),
    victim: VictimScheme.describe("information of the victim"),
    crimeScene: z.string().describe("Describe the crime scene"),
    suspects: z.array(SuspectScheme).describe("information of the suspects. One of the suspects must be a murderer(set 'isMurderer: true')."),
    truth: TruthScheme.describe("The truth of the murder that the player (== detective role) must reveal"),
    prologue: z.string().describe("prologue of the game."),
});

export const ScenarioParser = StructuredOutputParser.fromZodSchema(ScenarioScheme);