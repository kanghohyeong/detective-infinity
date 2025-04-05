import { create } from 'zustand';

interface ScenarioState {
    scenario: any | null;
    updateScenario: (scenarioJson: any) => void;
}

const useScenarioStore = create<ScenarioState>((set) => ({
    scenario: null,
    updateScenario: (scenarioJson) => set({ scenario: scenarioJson }),
}));

export default useScenarioStore; 