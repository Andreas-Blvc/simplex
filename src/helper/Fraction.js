export default function getFractionComponents(fraction) {
  if (fraction === 0) {
    return { numerator: 0, denominator: 1 };
  }

  const sign = Math.sign(fraction);
  const absFraction = Math.abs(fraction);
  const precision = 1e-10;

  let lowerNumerator = 0;
  let lowerDenominator = 1;
  let upperNumerator = 1;
  let upperDenominator = 0;

  let numerator = 1;
  let denominator = 1;

  while (true) {
    numerator = lowerNumerator + upperNumerator;
    denominator = lowerDenominator + upperDenominator;

    if (denominator * (absFraction + precision) < numerator) {
      upperNumerator = numerator;
      upperDenominator = denominator;
    } else if (denominator * (absFraction - precision) > numerator) {
      lowerNumerator = numerator;
      lowerDenominator = denominator;
    } else {
      break;
    }
  }

  return { numerator: numerator * sign, denominator };
}
