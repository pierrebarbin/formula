import { Formula, FormulaFunctionType } from "../types";

const operators = [
    '+',
    '-',
    '=='
]

const propertyParser = (value: string): Formula|null => {
    const regexp = /##(([a-z]|[0-9]|_)+)##/g;

    const match = [...value.matchAll(regexp)][0]

    if (!match) {
        return null
    }

    return {
        type: "property",
        id: match[1],
        name: match[1],
        result_type: "number"
    }
}

const constantParser = (value: string): Formula|undefined|null => {

    if (operators.includes(value)) {
        return null
    }

    if (!value || value === '') {
        return undefined
    }

    if (!isNaN(parseFloat(value))) {
        return {
            type: "constant",
            value,
            value_type: "string",
            result_type:  "number"
        }
    }

    const property = propertyParser(value)

    if (property) {
        return property
    }

    return {
        type: "constant",
        value: value.substring(1, value.length - 1),
        value_type: "string",
        result_type: 'text'
    }
}

const functionParser = (value: string): Formula => {

    const regexp = /([a-z]+)\((.*)\)$/g;

    const match = [...value.matchAll(regexp)][0]

    const args = match[2].split(',').map((item) => {
        const parsed = levelParser(item)
        return parsed[0]
    })

    return {
        type: "function",
        name: match[1] as FormulaFunctionType,
        args: args as unknown as Formula[],
        result_type: "text"
    }
} 

const levelParser = (value: string) => {

    const regexp = /([a-z]+\(.*\))([+|-|==])|([a-z]+\(.*\))$/g;

    let items = []

    let security = 0

    while (value.length !== 0 && security !== 10) {
        const matches = [...value.matchAll(regexp)]

        const match = matches[0]

        if (!match) {
            items.push(value.split(/((?=[+-])|(?=\=\=))|((?<=[+-])|(?<=\=\=))/g)
                .reduce((acc, item) => {
                    const parsed = constantParser(item)

                    if (parsed === undefined) {
                        return acc
                    }

                    return [...acc, parsed ?? item]
                }, []))
            break
        }

        const functionMatch = match[1] ?? match[3]

        if (value.indexOf(functionMatch) !== 0) {
            const beforeItem = value.split(functionMatch)[0]

            items.push(
                ...beforeItem
                    .split(/((?=[+-])|(?=\=\=))|((?<=[+-])|(?<=\=\=))/g)
                    .reduce((acc, item) => {
                        const parsed = constantParser(item)

                        if (parsed === undefined) {
                            return acc
                        }

                        return [...acc, parsed ?? item]
                    }, [])
                )

            value = value.replace(beforeItem, '')
        }

        items.push(functionParser(functionMatch))

        if (match[2]) {
            items.push(match[2])
        }

        value = value.replace(match[0], '')
        security = security + 1
    }

    return items[0]
}

export const parse = (value: string) => {
    return levelParser(value.replace(/(?<!\")\s+|\s+(?!\")/g, ''))
}

