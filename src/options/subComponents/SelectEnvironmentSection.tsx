import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Environments } from "../../types/Environment";
import { Button } from "@/components/ui/button";


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
    <div className="w-[80%] mx-auto flex items-center mb-10">
      <Select
        value={selectedEnv || ''}
        onValueChange={(value) => { handleChangeEnvironment(value) }}
      >
        <SelectTrigger >
          <SelectValue placeholder="Select environment" />
        </SelectTrigger>
        <SelectContent className="overflow-y-auto max-h-[75vh]">
          {Object.keys(environments).sort().map((env, idx) => (
            <SelectItem key={idx} value={env}>
              {env}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="px-4 py-2 ml-2" type="button" variant="destructive" onClick={handleDeleteEnvironment}>Delete</Button>
    </div>
  );
};