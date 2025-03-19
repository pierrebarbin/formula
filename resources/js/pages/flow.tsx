
import { NodeFunction } from '@/components/flow/node/node-function/node-function';
import { NodeProperty } from '@/components/flow/node/node-property/node-property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { evalFormula } from '@/lib/formula/eval';
import { parse } from '@/lib/formula/parser/flow-parser';
import { usePropertyStore } from '@/stores/property';
import { addEdge, Background, OnConnect, ReactFlow, ReactFlowInstance, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';

const nodeTypes = {
    functionNode: NodeFunction,
    propertyNode: NodeProperty
};

export default function Flow() {

    const [rfInstance, setRfInstance] = useState<ReactFlowInstance|null>(null);
    
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

      const onConnect: OnConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges],
      );

    useEffect(() => {

        const onChange = (id: string, key: string, value: string) => {
            setNodes((nds) =>
              nds.map((node) => {
               
                if (node.id !== id) {
                    return node
                }

                return {
                  ...node,
                  data: {
                    ...node.data,
                    [key]: value,
                  },
                };
              }),
            );
        };

        setNodes([
            {
              id: '2',
              type: 'functionNode',
              data: { onChange, type: null },
              position: { x: 300, y: 50 },
            },
            {
                id: '3',
                type: 'propertyNode',
                data: { onChange, property: null },
                position: { x: 150, y: -100 },
            },
            {
                id: '4',
                type: 'functionNode',
                data: { onChange, type: null },
                position: { x: 500, y: -100 },
            },
            {
                id: '5',
                type: 'propertyNode',
                data: { onChange, property: null },
                position: { x: 400, y: -250 },
            },
            {
                id: '6',
                type: 'propertyNode',
                data: { onChange, property: null },
                position: { x: 600, y: -250 },
            }
        ]);

        usePropertyStore.setState({properties: [
            {
                key: 'balise1',
                value: null
            },
            {
                key: 'balise2',
                value: null
            }
        ]})

        return () => {
            setNodes([])
            usePropertyStore.setState({properties: []})
        }
    }, [])

    const generate = useCallback(() => {
        if (rfInstance) {
          const flow = rfInstance.toObject();
          
            const formula = parse(flow)
            const properties = usePropertyStore
                .getState()
                .properties
                .reduce((acc, property) => ({...acc, [property.key]: property.value}), {})
            console.log(properties, evalFormula(formula, {properties}))
        }
    }, [rfInstance]);

    return (
        <div className="w-screen h-screen flex">
            <div className="w-80">
                <Button onClick={generate}>
                    Essayer
                </Button>
                <div>
                    <Label>Balise 1 (balise1)</Label>
                    <Input onChange={(e) => {
                        usePropertyStore.setState((state) => {
                            const properties = [
                                ...state.properties.map((property) => {
                                    if (property.key === "balise1") {
                                        return {
                                            ...property,
                                            value: e.target.value
                                        }
                                    }
                                    return property
                                })
                            ]
                            console.log(properties)
                            return { properties }
                        })
                    }} />
                </div>
                <div>
                    <Label>Balise 2 (balise2)</Label>
                    <Input onChange={(e) => {
                        usePropertyStore.setState((state) => {
                            const properties = [
                                ...state.properties.map((property) => {
                                    if (property.key === "balise2") {
                                        return {
                                            ...property,
                                            value: e.target.value
                                        }
                                    }
                                    return property
                                })
                            ]
                            return { properties }
                        })
                    }} />
                </div>
                <div className="flex items-center gap-2">
                    {/* <Label>Result:</Label> <span className="text-sm">{result}</span> */}
                </div>
            </div>
            <ReactFlow 
                className="grow"
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onConnect={onConnect}
                colorMode="dark"
                fitView
                onInit={setRfInstance}
            >
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    )
}