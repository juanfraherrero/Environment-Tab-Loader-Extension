import { memo, useState } from "react";

interface AddEnvironmentSectionProps {
  handleAddEnvironment: (envName: string) => void;
}

const AddEnvironmentSection = memo(({
  handleAddEnvironment
}: AddEnvironmentSectionProps) => {
  const [envName, setEnvName] = useState<string>('');

  return (
    <div className="sections">
      <label htmlFor="newEnvName">New environment:</label>
      <input
        type="text"
        id="newEnvName"
        placeholder="Name of the new environment"
        value={envName}
        onChange={(e) => setEnvName(e.target.value)}
      />
      <button onClick={() => handleAddEnvironment(envName)}>Add environment</button>
    </div>
  );
});

export default AddEnvironmentSection;

