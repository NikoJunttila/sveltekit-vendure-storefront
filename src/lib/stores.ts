import { type Writable, writable } from 'svelte/store'
import type { FragmentType } from '$lib/gql'
import { ActiveOrder, Customer } from '$lib/vendure'

export const cookiesDisabledStore: Writable<boolean> = writable(false)

export const cartStore: Writable<FragmentType<typeof ActiveOrder>|null> = writable()

export const userStore: Writable<FragmentType<typeof Customer>|null> = writable()