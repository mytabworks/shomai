export const chainedDataIndexToObject = <R = Record<string, any>>(dataIndex: string, dataIndexValue: any, rewrite: R = {} as R): R => {
  return dataIndex.split(".").reduce((result, value, index, array) => {
    const lastField = array.slice(0, index).reduce<any>((r, v) => r[v], result)
    if(array.length - 1 === index) {
      lastField[value as keyof R] = dataIndexValue
    } else {
      lastField[value as keyof R] = lastField[value as keyof R] || ({} as any)
    }
    return result
  }, rewrite)
}

export const chainedDataIndexExtractor = <R = Record<string, any>, S = R>(dataIndex: string, item: R): S => {
  return dataIndex.split(".").reduce<S>((result, value) => {
		const hasArray = value.match(/\[(\d+)\]$/)
		if(hasArray) {
			return result && (result[value.substring(0, hasArray.index) as keyof S] as any)[parseInt(hasArray[1])]
		}
		return result && result[value as keyof S];
	}, item as any);
}