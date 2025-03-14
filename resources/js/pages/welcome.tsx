import CodeMirror from '@uiw/react-codemirror';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { evalFormula } from "@/lib/formula/eval";
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { parse } from '@/lib/formula/parser/codemirror-parser';
import { useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const myTheme = createTheme({
    theme: 'light',
    settings: {
      background: 'transparent',
      backgroundImage: '',
      foreground: '#75baff',
      caret: '#5d00ff',
      selection: '#036dd626',
      selectionMatch: '#036dd626',
      lineHighlight: 'transparent',
    },
    styles: [
      { tag: t.comment, color: '#787b8099' },
      { tag: t.variableName, color: '#0080ff' },
      { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
      { tag: t.number, color: '#5c6166' },
      { tag: t.bool, color: '#5c6166' },
      { tag: t.null, color: '#5c6166' },
      { tag: t.keyword, color: '#5c6166' },
      { tag: t.operator, color: '#5c6166' },
      { tag: t.className, color: '#5c6166' },
      { tag: t.definition(t.typeName), color: '#5c6166' },
      { tag: t.typeName, color: '#5c6166' },
      { tag: t.angleBracket, color: '#5c6166' },
      { tag: t.tagName, color: '#5c6166' },
      { tag: t.attributeName, color: '#5c6166' },
    ],
  });

export default function Welcome() {

    const [value, setValue] = useState<string|undefined>(undefined)
    const [schema, setSchema] = useState<string|undefined>(undefined)
    const [balise1, setBalise1] = useState('')
    const [balise2, setBalise2] = useState('')
    const [result, setResult] = useState(null)

    const debounced = useDebounceCallback(setSchema, 500)

    const formula = () => {
        setResult(evalFormula(
        schema,
        {
            properties: { 
                balise1, 
                balise2
            }
        }))
    }

    const handleChange = (value: string) => {
        setValue(value)
        debounced(parse(value))
    }

    return (
       <div className="h-screen w-screen flex justify-center items-center gap-6">
            <div className="flex flex-col gap-4">
                <div>
                    <Label>Balise 1 (##balise1##)</Label>
                    <Input onChange={(e) => setBalise1(e.target.value)} />
                </div>
                <div>
                    <Label>Balise 2 (##balise2##)</Label>
                    <Input onChange={(e) => setBalise2(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                    <Label>Result:</Label> <span className="text-sm">{result}</span>
                </div>
            </div>
            <Card className="p-0 min-w-96">
                <CardHeader className="px-4 py-2 border-b">
                    <div className="flex justify-between">
                        <CardTitle className="text-sm">Formule</CardTitle>
                        <Button onClick={formula} size="sm" className="h-6">
                            Essayer
                        </Button>
                    </div>
                    <CodeMirror 
                        value={value} 
                        theme={myTheme} 
                        className="w-full" 
                        basicSetup={{
                            foldGutter: false,
                            lineNumbers: false,
                            autocompletion: false,
                        }}
                        onChange={handleChange}
                    />
                </CardHeader>
                <CardContent>
                </CardContent>
            </Card>

            
       </div>
    );
}
