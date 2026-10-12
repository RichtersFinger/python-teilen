export const CSS = new CSSStyleSheet();

CSS.replaceSync(`
    @keyframes fadein { from { opacity: 0; translate: 0 8px; } }
    @keyframes spin { 0% { transform: rotate(-360deg); } }
`);
