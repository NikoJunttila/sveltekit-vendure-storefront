/* eslint-disable */
/** 
 * This file contains language specific message functions for tree-shaking. 
 * 
 *! WARNING: Only import messages from this file if you want to manually
 *! optimize your bundle. Else, import from the `messages.js` file. 
 * 
 * Your bundler will (in the future) automatically replace the index function 
 * with a language specific message function in the build step. 
 */


/**
 * @param {{ name: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const hello_world = (params) => `Hello, ${params.name} from fi!`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const hero_title = () => `Parasta tavaraa.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const hero_description = () => `Myymme parasta tavaraa kaikkialla.  Kaikki rakastavat sitä.  Parhaat kamerat.  Parhaat kasvit.  Parhaat sohvat.  Emme oikeastaan lähetä mitään.  Tämä on esimerkkisivusto.  Tyytyväisyys taattu.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const shop_now = () => `Osta nyt`
