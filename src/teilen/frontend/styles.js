export const CSS = new CSSStyleSheet();

CSS.replaceSync(`
    :host, :root {
        --gray-0: oklch(100% 0 0);
        --gray-5: oklch(95% 0 0);
        --gray-10: oklch(90% 0 0);
        --gray-20: oklch(80% 0 0);
        --gray-30: oklch(70% 0 0);
        --gray-40: oklch(60% 0 0);
        --gray-50: oklch(50% 0 0);
        --gray-60: oklch(40% 0 0);
        --gray-70: oklch(35% 0 0);
        --gray-80: oklch(30% 0 0);
        --gray-90: oklch(25% 0 0);
        --gray-95: oklch(15% 0 0);
        --gray-100: oklch(0% 0 0);

        ${[
          0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56,
          64, 80, 96, 128, 160,
        ]
          .map(
            (size) =>
              `--size-${size.toString().replaceAll(".", "")}: ${0.25 * size}rem`,
          )
          .join(";\n")}
    }

    @keyframes fadein { from { opacity: 0; translate: 0 8px; } }
    @keyframes spin { 0% { transform: rotate(-360deg); } }
`);
