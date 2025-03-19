import { create } from 'zustand'

interface PropertyState {
  properties: {key: string, value: any}[]
}

export const usePropertyStore = create<PropertyState>()((set) => ({
  properties: [],
}))