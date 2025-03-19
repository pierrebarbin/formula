import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePropertyStore } from "@/stores/property";
import { Handle, Position } from "@xyflow/react";
import { memo } from "react";

const NodeProperty = memo(({id, data, isConnectable}) => {

    const properties = usePropertyStore((state) => state.properties)

    return (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
          />
          <Label>Champ</Label>
          <Select onValueChange={(value) => {data.onChange(id, 'property', value)}}>
                <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Champ" />
                </SelectTrigger>
                <SelectContent>
                    {properties.map(({key, value}) => (
                        <SelectItem key={key} value={key}>{key} ({value})</SelectItem>
                    ))}
                </SelectContent>
          </Select>
        </>
      );
})

export { NodeProperty }