/**
 * Returns size in human readable unit.
 * @param size size in B
 */
export function toHumanReadableSize(size: number): string {
  const units = ["B", "kB", "MB", "GB", "TB"];
  let unit = -1;
  for (let i = 0; i < units.length; i++) {
    if (size < 1024 ** (i + 1)) {
      unit = i;
      break;
    }
  }
  if (unit === -1) return "> 1000 TB";
  return `${(size / 1024 ** unit).toFixed(unit <= 1 ? 0 : 1)} ${units[unit]}`;
}

/**
 * Returns a re-formatted string with ellipsis in the center if needed.
 * @param value original string
 * @param maxLength maximum accepted string length
 * @returns a shortened string
 */
export function centeredEllipsis(value: string, maxLength: number = 40) {
  if (value.length > maxLength) {
    return (
      value.substring(0, Math.floor(0.45 * maxLength)) +
      "..." +
      value.substring(value.length - Math.floor(0.45 * maxLength), value.length)
    );
  }
  return value;
}
