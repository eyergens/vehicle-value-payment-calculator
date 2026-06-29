export function isInvalid(value: number | null, min: number, max: number) {
  return value == null || value < min || value > max;
}