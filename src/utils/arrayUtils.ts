export function mapFilter<T, U>(
	values: (T | null)[],
	map: (item: T | null) => U | null
): U[] {
	const result: U[] = [];
	for (const value of values) {
		if (value != null) {
			const mapped = map(value);
			if (mapped !== null) {
				result.push(mapped);
			}
		}
	}
	return result;
}
