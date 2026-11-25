import { Kind } from "./components/item.js";

/**
 * Returns size in human readable unit.
 * @param {number} size size in B
 */
export function toHumanReadableSize(size) {
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
 * Format tooltip from item info.
 */
export function formatTooltip(item) {
  // API reports datetime in seconds since epoch -> transform to milliseconds
  let result = `${item.kind[0].toUpperCase() + item.kind.slice(1)}
Changed at: ${new Date(item.mtime * 1000).toLocaleString()}`;

  if (item.size) {
    result += `
Size: ${toHumanReadableSize(item.size)}`;
  }

  return result;
}
