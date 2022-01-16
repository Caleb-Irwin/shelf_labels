export default function divideArray<T>(arr: T[], size: number): T[][] {
	if (arr.length === 0) {
		// @ts-expect-error not fixing someone elses types
		return arr;
	}
	return [arr.slice(0, size), ...divideArray(arr.slice(size), size)];
}
