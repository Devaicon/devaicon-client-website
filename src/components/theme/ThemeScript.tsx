import { DEFAULT_THEME, THEME_STORAGE_KEY } from "./theme";

/**
 * Blocking inline script. Runs before paint so the correct theme class is on
 * <html> immediately and there is no flash of the wrong theme. Reads the
 * persisted preference (defaulting to dark) and resolves "system" against the
 * OS color-scheme. Kept in sync with ThemeProvider.
 */
export default function ThemeScript() {
  const js = `(function(){try{var k=${JSON.stringify(
    THEME_STORAGE_KEY,
  )};var d=${JSON.stringify(
    DEFAULT_THEME,
  )};var t=localStorage.getItem(k)||d;var sys=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=t==='dark'||(t==='system'&&sys);document.documentElement.classList.toggle('dark',dark);}catch(e){document.documentElement.classList.add('dark');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
