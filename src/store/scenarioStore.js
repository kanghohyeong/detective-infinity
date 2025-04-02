import { create } from 'zustand';

const useScenarioStore = create((set) => ({
  scenario: null,
  updateScenario: (scenarioJson) => set({ scenario: scenarioJson }),
}));

export default useScenarioStore; 