export default function isValidBarcode(barcode: string): boolean {
	// check length
	if (barcode.length != 12 && barcode.length !== 11) {
		return false;
	}

	const lastDigit = Number(barcode.substring(barcode.length - 1));
	let checkSum = 0;
	if (isNaN(lastDigit)) {
		return false;
	} // not a valid upc/ean

	const arr = barcode
		.substring(0, barcode.length - 1)
		.split('')
		.reverse();
	let oddTotal = 0,
		evenTotal = 0;

	for (let i = 0; i < arr.length; i++) {
		// @ts-expect-error Double check for some reason
		if (isNaN(arr[i])) {
			return false;
		} // can't be a valid upc/ean we're checking for

		if (i % 2 == 0) {
			oddTotal += Number(arr[i]) * 3;
		} else {
			evenTotal += Number(arr[i]);
		}
	}
	checkSum = (10 - ((evenTotal + oddTotal) % 10)) % 10;

	// true if they are equal
	return checkSum == lastDigit;
}
