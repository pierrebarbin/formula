import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handle, Position } from "@xyflow/react";
import { memo } from "react"

const NodeFunction = memo(({id, data, isConnectable}) => {
    return (
        <div className="bg-card p-2">
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
          />
          <Label>Fonction</Label>
          <Select onValueChange={(value) => data.onChange(id, 'type', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Fonction" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="add">Addition</SelectItem>
                    <SelectItem value="divide">Division</SelectItem>
                    <SelectItem value="subtract">Soustraction</SelectItem>
                </SelectContent>
          </Select>
        </div>
      );
})

export { NodeFunction }