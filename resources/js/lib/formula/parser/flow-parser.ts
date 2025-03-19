import { ReactFlowJsonObject } from "@xyflow/react";
import { Formula, FormulaFunctionType } from "../types";

type Edges = ReactFlowJsonObject['edges']
type Node = ReactFlowJsonObject['nodes'][0]
type Nodes = ReactFlowJsonObject['nodes']

const Types = {
    Property: "propertyNode",
    Function: "functionNode"
} as const

const parseNode = (node: Node, allNodes: Nodes, allEdges: Edges): Formula => {
    if (node.type === Types.Property) {
        return {
            type: "property",
            id: node.data.property  as string,
            name: node.data.property as string,
            result_type: "number" // find this value in the node
        }
    }

    if (node.type === Types.Function) {
        return {
            type: "function",
            name: node.data.type as FormulaFunctionType,
            args: parseNodeLevel(node, allNodes, allEdges),
            result_type: "text"
        }
    }

    throw Error('Unknown node type')
}

const parseNodes = (nodes: Nodes, allNodes: Nodes, allEdges: Edges): Formula[] => {

    let parsedNodes = []

    const nodesSize = nodes.length
    for(let i = 0; i < nodesSize; i++) {
        const node = nodes[i]

        parsedNodes.push(parseNode(node, allNodes, allEdges))
    } 
    
    return parsedNodes
}

const findLinkedNodes = (edges: Edges, nodes: Nodes) => {

    let foundNodes = []

    const edgesSize = edges.length
    for(let i = 0; i < edgesSize; i++) {
        const edge = edges[i]

        const nodesSize = nodes.length
        for(let i = 0; i < nodesSize; i++) {
            const node = nodes[i]
            
            if (edge.source === node.id) {
                foundNodes.push(node)
            }
         }  
    }

    return foundNodes
}

const findLinkedEdges = (node: Node, edges: Edges) => {

    let foundEdges = []

    const edgesSize = edges.length
    for(let i = 0; i < edgesSize; i++) {
        const edge = edges[i]
        if (edge.target === node.id) {
            foundEdges.push(edge)
        }
    }

    return foundEdges
}

const parseNodeLevel = (node: Node, nodes: Nodes, edges: Edges): Formula[] => {
    const linkedEdges = findLinkedEdges(node, edges)
    const linkedNodes = findLinkedNodes(linkedEdges, nodes)
    
    return parseNodes(linkedNodes, nodes, edges)
    
}

const AssertNodeInEdgesSource = (node: Node, edges: Edges) => {

    const edgesSize = edges.length
    for(let i = 0; i < edgesSize; i++) {
        const edge = edges[i]
        if (edge.source === node.id) {
            return true
        }
    }

    return false
}

const findRootNode = (nodes: Nodes, edges: Edges) => {

    const nodesSize = nodes.length
    for(let i = 0; i < nodesSize; i++) {
        const node = nodes[i]
        if (!AssertNodeInEdgesSource(node, edges)) {
            return node
        }
    }

    throw Error('No root node found')
}

export const parse = ({ nodes,edges  }: ReactFlowJsonObject): Formula => {
    let rootNode = findRootNode(nodes, edges)
    
    console.log(parseNode(rootNode, nodes, edges))

    return parseNode(rootNode, nodes, edges)
}