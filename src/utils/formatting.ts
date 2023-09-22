export function trimNumber(
	targetNumber: number | string,
	decimalPlaces: number
): number {
	let numberToTrim = Number.parseFloat(targetNumber.toString());
	const numberString = numberToTrim.toString();
	const splittedNumber = numberString.split('.');
	if (splittedNumber.length === 1) {
		return numberToTrim;
	}

	if (splittedNumber[1].length <= decimalPlaces) {
		return numberToTrim;
	}

	const slicedDecimal = splittedNumber[1].slice(0, decimalPlaces);
	const trimmedNumber = `${splittedNumber[0]}.${slicedDecimal}`;
	return Number.parseFloat(trimmedNumber);
}
