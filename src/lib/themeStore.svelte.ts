/**
 * @typedef {Object} ThemeStore
 * @property {string[]} themes - List of all available theme names.
 * @property {string} [forcedTheme] - Forced theme name for the current page.
 * @property {'dark' | 'light' | 'system'} [theme] - Active theme name.
 * @property {string} [resolvedTheme] - If `enableSystem` is true and the active theme is "system",
 *                                       this returns whether the system preference resolved to "dark" or "light".
 * @property {'dark' | 'light'} [systemTheme] - If enableSystem is true, returns the System theme preference.
 */

/**
 * Creates a new theme store.
 */
function createThemeStore() {
	/** @type {ThemeStore} */
	let state : any = $state({
		themes: [],
		forcedTheme: undefined,
		theme: 'light',
		resolvedTheme: undefined,
		systemTheme: undefined
	});

	/**
	 * Update the active theme.
	 * @param {'dark' | 'light' | 'system'} newTheme - The new active theme.
	 */
	function setTheme(newTheme : any) {
		state.theme = newTheme;
		// Optionally: add logic to update resolvedTheme or systemTheme here.
	}
	function setWhole(whole : any) {
		state = whole;
	}

	// (Optional) Additional methods to update other parts of the theme state:
	// function setForcedTheme(newForcedTheme) {
	//     state.forcedTheme = newForcedTheme;
	// }
	// function setThemes(newThemes) {
	//     state.themes = newThemes;
	// }

	return {
		/** Returns the current theme state. */
		get theme() {
			return state;
		},
		setTheme,
		setWhole
		// Optionally, export setForcedTheme, setThemes, etc.
	};
}

export const themeStore = createThemeStore();
export const setTheme = themeStore.setTheme;
