export function trimNumber(targetNumber: number, decimalPlaces: number): number {
	const numberString = targetNumber.toString();
	const splittedNumber = numberString.split('.');
	if (splittedNumber.length === 1) {
		return targetNumber;
	}

	if (splittedNumber[1].length <= decimalPlaces) {
		return targetNumber;
	}

	const slicedDecimal = splittedNumber[1].slice(0, decimalPlaces);
	const trimmedNumber = `${splittedNumber[0]}.${slicedDecimal}`;
	return Number.parseFloat(trimmedNumber);
}
