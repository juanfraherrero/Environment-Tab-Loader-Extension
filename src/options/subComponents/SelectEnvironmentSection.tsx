import { Environments } from "../../types/Environment";

interface SelectEnvironmentSectionProps {
  environments: Environments;
  selectedEnv: string | null;
  handleChangeEnvironment: (selectedEnv: string) => void;
  handleDeleteEnvironment: () => void;
}

export default function SelectEnvironmentSection({
  environments,
  selectedEnv,
  handleChangeEnvironment,
  handleDeleteEnvironment,
}: SelectEnvironmentSectionProps) {
  return (
    <div className="sections">
      <label>Select environment:</label>
      <select
        id="envSelect"
        value={selectedEnv || ''}
        onChange={(e) => { handleChangeEnvironment(e.target.value) }}
      >
        <option value="" disabled>Select an environment</option>
        {Object.keys(environments).sort().map((env, idx) => (
          <option key={idx} value={env}>
            {env}
          </option>
        ))}
      </select>
      <button onClick={handleDeleteEnvironment}>Delete</button>
    </div>
  );
};