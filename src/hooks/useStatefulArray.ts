import { useCallback, useState } from "react"

type UseStatefulArrayOptions<T> = {  
  compare: (item1: T, item2: T) => boolean  
}

export default function useStatefulArray<T>(initialState: T[], options: UseStatefulArrayOptions<T>) {
  const [ arr, setArr ] = useState<T[]>(initialState);
    
  return {
    all: arr,
    set: useCallback((items: T[]) => setArr(items), []),
    append: useCallback((item: T) => setArr(ar => [...ar, item]), []),
    prepend: useCallback((item: T) => setArr(ar => [item, ...ar]), []),
    remove: useCallback((item: T) => setArr(ar => ar.filter(i => !options.compare(i, item))), []),
    update: useCallback((item: T) => setArr(arr => arr.map(i => options.compare(i, item) ? i = item : i)), []),    
    filter: useCallback((predicate: (item: T, index: number, arr?: T[]) => T[]) => setArr(ar => ar.filter(predicate)), []),
    find: useCallback((predicate: (item: T, index: number, obj: T[]) => boolean) => arr.find(predicate), [arr]),
    clear: useCallback(() => setArr([]), [])
  }
}