import { type Writable, writable } from 'svelte/store';
import type { FragmentType } from '$lib/gql';
import { ActiveOrder, Customer, ActiveChannel } from '$lib/vendure';

//Tought about doing something with this.
//export const channelStore: Writable<FragmentType<typeof ActiveChannel> | null> = writable();

export const cartDialogStore: Writable<boolean> = writable(false);

export const cartStore: Writable<FragmentType<typeof ActiveOrder> | null> = writable();

export const userStore: Writable<FragmentType<typeof Customer> | null> = writable();

/* export interface ThemeStore {
	// List of all available theme names 
	themes: string[];
	//Forced theme name for the current page 
	forcedTheme?: string;
	// Update the theme 
	/** Active theme name 
	theme?: 'dark' | 'light' | 'system';
	//If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` 
	resolvedTheme?: string;
	// If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is 
}

export const themeStore = writable<ThemeStore>({
	themes: [],
	forcedTheme: undefined,
	theme: undefined,
	resolvedTheme: undefined,
	systemTheme: undefined
});

export const setTheme = (theme: 'dark' | 'light' | 'system'): void => {
	themeStore.update((store) => ({ ...store, theme }));
};
 */
