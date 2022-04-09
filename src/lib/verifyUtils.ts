export const calcPercentChange = (label: Label): number =>
	Math.ceil(((label.price - label.lastPrice) / label.lastPrice) * 1000) / 10;

export const autoFilter = (
	labels: Label[],
	autoFilterPositive: number,
	autoFilterNegative: number
): { passed: Label[]; failed: Label[] } => {
	return {
		passed: labels.filter((v) => {
			const change = calcPercentChange(v);
			if (change >= 0) {
				return change <= autoFilterPositive;
			}
			if (change < 0) {
				return change >= -1 * autoFilterNegative;
			}
		}),
		failed: labels.filter((v) => {
			const change = calcPercentChange(v);
			if (change >= 0) {
				return change >= autoFilterPositive;
			}
			if (change < 0) {
				return change <= -1 * autoFilterNegative;
			}
		})
	};
};
