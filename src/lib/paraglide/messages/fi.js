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
export const about_us_title = () => `Meistä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const about_us_description = () => `Tutustu yritykseemme, missioomme ja siihen, mikä saa meidät tarjoamaan parhaat tuotteet ja palvelut.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const learn_more_about_company = () => `Lue lisää yrityksestämme`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const learn_more = () => `Lue lisää`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const email_required = () => `Sähköposti vaaditaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const invalid_email = () => `Virheellinen sähköpostiosoite`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const first_name_required = () => `Etunimi vaaditaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const last_name_required = () => `Sukunimi vaaditaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const phone_required = () => `Puhelinnumero vaaditaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const invalid_phone = () => `Virheellinen puhelinnumero`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const street_line_1_required = () => `Katuosoite vaaditaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const city_required = () => `Kaupunki vaaditaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const postal_code_required = () => `Postinumero vaaditaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const invalid_postal_code = () => `Virheellinen postinumero`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const default_shipping_address = () => `Oletus toimitus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const default_billing_address = () => `Oletus laskutus`


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
export const hero_description = () => `Myymme parasta tavaraa kaikkialla. Kaikki rakastavat sitä. Parhaat kamerat. Parhaat kasvit. Parhaat sohvat. Emme oikeastaan lähetä mitään. Tämä on esimerkkisivusto. Tyytyväisyys taattu.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const shop_now = () => `Osta nyt`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const no_products_found = () => `Tuotteita ei löytynyt`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const products_heading = () => `Tuotteet`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const checkout = () => `Kassa`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const safe_checkout = () => `TURVALLINEN JA SUOJATTU MAKSU`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const ssl_encryption = () => `128-bittinen SSL-salaus`


/**
 * @param {{ count: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const quantity = (params) => `Määrä: ${params.count}`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const delivery_methods = () => `Toimitustavat`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const discount_coupon = () => `Onko sinulla alennuskoodi?`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const enter_code = () => `Syötä koodi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const redeem = () => `Käytä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const subtotal = () => `Välisumma:`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const total = () => `Yhteensä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const place_order = () => `Tee tilaus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const cart_empty = () => `Ostoskorisi on tyhjä.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const add_to_cart = () => `Lisää koriin`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const select_variant = () => `Valitse vaihtoehto`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const price = () => `Hinta`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const customer_reviews = () => `Asiakasarvostelut`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const faq = () => `UKK`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const item_added = () => `Tuote lisätty koriin`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const error_adding_item = () => `Virhe lisättäessä tuotetta koriin`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const insufficient_stock = () => `Tuote loppu varastosta`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const out_of_stock = () => `Tuotetta ei varastossa`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const item_removed = () => `Tuote poistettu`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const search = () => `Haku`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const search_placeholder = () => `Kirjoita hakusana.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const no_results = () => `Ei hakutuloksia.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const enter_search = () => `Kirjoita hakusana.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const shopping_cart = () => `Ostoskori`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const continue_shopping = () => `Jatka ostoksia`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const shipping_taxes_checkout = () => `Toimitus ja verot lasketaan kassalla.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const card_number = () => `Kortin numero`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const expiration_date = () => `Voimassaoloaika`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const cvv = () => `CVV`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const required = () => `Pakollinen`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const first_name = () => `Etunimi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const last_name = () => `Sukunimi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const email = () => `Sähköposti`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const phone = () => `Puhelin`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const company = () => `Yritys`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const street_line_1 = () => `Katuosoite 1`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const street_line_2 = () => `Katuosoite 2`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const city = () => `Kaupunki`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const postal_code = () => `Postinumero`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const country = () => `Maa`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const discount = () => `Alennus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const remove = () => `Poista`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const view_cart = () => `Näytä ostoskori`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const order_summary = () => `Tilauksen yhteenveto`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const finland = () => `Suomi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const address_information = () => `Osoitetiedot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const customer_information = () => `Asiakas tiedot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const our_collections = () => `Kokoelmamme`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const collections_description = () => `Tutustu huolellisesti valittuihin korkealaatuisten tuotteiden kokoelmiimme.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const shop_collection = () => `Selaa kokoelmaa`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const show_product = () => `Näytä tuote`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_company = () => `Yritys`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_resources = () => `Resurssit`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_support = () => `Tuki`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_subscribe = () => `Tilaa uutiskirjeemme`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_email_placeholder = () => `Syötä sähköpostiosoitteesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_subscribe_button = () => `Tilaa`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_terms = () => `Käyttöehdot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_privacy = () => `Tietosuojakäytäntö`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_phone = () => `Puhelin`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_email = () => `Sähköposti`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const home = () => `Etusivu`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const create_account = () => `Luo käyttäjä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const password = () => `Salasana`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const already_account = () => `On jo käyttäjä?`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const sign_in = () => `Kirjaudu sisään`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const placeholder_first_name = () => `Syötä etunimesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const placeholder_last_name = () => `Syötä sukunimesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const placeholder_email = () => `Syötä sähköpostiosoitteesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const placeholder_password = () => `Valitse salasana`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const verification_email_sent = () => `Vahvistussähköposti lähetetty sähköpostiisi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const generic_error = () => `Virhe rekisteröitymisessä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const unexpected_error = () => `Tapahtui odottamaton virhe. Yritä uudelleen`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const sign_up = () => `Kirjaudu sisään`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const creating_account = () => `Luodaan käyttäjä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_title = () => `Tili`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_sign_in = () => `Kirjaudu sisään`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_sign_up = () => `Rekisteröidy`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const sign_in_instead = () => `Kirjaudu sisään sen sijaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_create = () => `Luo tili`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_forgot_password = () => `Unohditko salasanan?`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_reset_password = () => `Nollaa salasana`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_email_sent = () => `Jos tili on olemassa, nollauskoodi on lähetetty sähköpostiisi.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_apple_sign_in = () => `Kirjaudu Applella`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_have_account = () => `Onko sinulla jo tili?`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_need_account = () => `Tarvitsetko tilin?`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_or = () => `tai`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_email_label = () => `Sähköposti`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_password_label = () => `Salasana`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_first_name_label = () => `Etunimi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_last_name_label = () => `Sukunimi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_email_placeholder = () => `Syötä sähköpostiosoitteesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_password_placeholder = () => `Syötä salasanasi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_first_name_placeholder = () => `Syötä etunimesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_last_name_placeholder = () => `Syötä sukunimesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const create_account_big = () => `Tervetuloa! Luodaksesi tilin, syötä sähköpostiosoitteesi ja valitse salasana alla.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_reset_pass = () => `Kirjoita sähköpostiosoitteesi saadaksesi sähköpostiviestin, jossa on linkki salasanasi vaihtamiseen.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const request_reset = () => `Pyydä nollauskoodi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const login_text = () => `Jos sinulla on olemassa oleva tili, syötä sähköpostiosoitteesi ja salasanasi alla.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const select_country = () => `Valitse maa...`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_blog = () => `Blogi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_guides = () => `Oppaat`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_newsletter = () => `Uutiskirje`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_about = () => `Tietoa meistä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_careers = () => `Työpaikat`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_contact = () => `Ota yhteyttä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_faq = () => `UKK`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_shipping = () => `Toimitus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const footer_returns = () => `Palautukset`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_menu = () => `Avaa käyttäjävalikko`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const view_account = () => `Näytä tili`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const your_profile = () => `Profiilisi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const sign_out = () => `Kirjaudu ulos`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const customer_profile = () => `Asiakasprofiili`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const edit_profile = () => `Muokkaa profiilia`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const personal_information = () => `Henkilötiedot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const default_address = () => `Oletusosoite`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const full_name = () => `Koko nimi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const save_changes = () => `Tallenna muutokset`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const cancel = () => `Peruuta`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const name = () => `Nimi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const not_provided = () => `Ei annettu`


/**
 * @param {{ count: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const order_history = (params) => `Tilaushistoria (${params.count} tilausta)`


/**
 * @param {{ code: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const order_number = (params) => `Tilaus #${params.code}`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const amount = () => `määrä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const order_confirmation = () => `Tilausvahvistus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const thank_you_order = () => `Kiitos tilauksestasi!`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const your_order_number = () => `Tilauksesi numero on`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const order_not_found = () => `Tilausta ei löytynyt`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const loading = () => `Ladataan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const account_verified = () => `Tili vahvistettu`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const verification_failed = () => `Vahvistus epäonnistui`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const unexpected_type = () => `Odottamaton vastaustyyppi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const verifying_account = () => `Vahvistetaan tiliä...`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const redirect = () => `Tili vahvistettu. Uudelleenohjataan...`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const apply = () => `Lisää`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const clear_all = () => `Tyhjennä valinta`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const filters = () => `Suodattimet`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const proceed_to_payment = () => `Jatka maksamaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const cart_items = () => `Tilauksen tuotteet`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const checkout_description = () => `Verkkokaupan tilaus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const stripe_handles = () => `Stripe käsittelee maksut turvallisesti`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const complete_order = () => `Suorita tilauksesi loppuun`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const processing = () => `Käsitellään`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_products = () => `Tuotteet`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_toggle_collections = () => `Vaihda kokoelmat`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_all_products = () => `Kaikki tuotteet`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_about_us = () => `Meistä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_guide = () => `Opas`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_contact_us = () => `Ota yhteyttä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_about_us_label = () => `Meistä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_guide_label = () => `Opas`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_contact_us_label = () => `Ota yhteyttä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_view_all_products = () => `Näytä kaikki tuotteet`


/**
 * @param {{ collectionName: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_view_collection = (params) => `Näytä ${params.collectionName} -kokoelma`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_open = () => `Avaa valikko`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const menu_close = () => `Sulje valikko`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contact = () => `Yhteystiedot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const privacyTitle = () => `Tietosuojakäytäntö`


/**
 * @param {{ date: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const effectiveDate = (params) => `Voimaantulopäivä: ${params.date}`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const introduction = () => `Sitoudumme suojelemaan henkilökohtaisia tietojasi ja oikeuttasi yksityisyyteen. Tämä tietosuojakäytäntö selittää, miten keräämme, käytämme ja suojelemme tietojasi palveluidemme käytön yhteydessä.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const informationCollectionHeading = () => `1. Keräämämme tiedot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const informationCollectionContent = () => `Saatamme kerätä henkilökohtaisia tunnistetietoja, kuten nimeä, sähköpostiosoitetta ja käyttötietoja, kun käytät palvelujamme.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const dataUsageHeading = () => `2. Tietojen käyttötarkoitus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const dataUsageContent = () => `Käytämme kerättyjä tietoja palveluidemme tarjoamiseen ja parantamiseen, kommunikointiin kanssasi sekä alustamme turvallisuuden varmistamiseen.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const dataProtectionHeading = () => `3. Tietojen suojaus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const dataProtectionContent = () => `Toteutamme asianmukaiset tekniset ja organisatoriset toimenpiteet henkilötietojesi suojaamiseksi luvattomalta käytöltä ja tietovuodoilta.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const userRightsHeading = () => `4. Käyttäjän oikeudet`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const userRightsContent = () => `Sinulla on oikeus tarkastaa, korjata ja poistaa henkilötietojasi. Ota yhteyttä käyttääksesi näitä oikeuksia.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const changesHeading = () => `5. Käytännön muutokset`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const changesContent = () => `Päivitämme tätä käytäntöä ajoittain. Merkittävät muutokset ilmoitetaan verkkosivustollamme tai sähköpostitse.`


/**
 * @param {{ email: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contactUs = (params) => `Jos sinulla on kysyttävää tietosuojakäytännöstä, ota yhteyttä sähköpostitse osoitteeseen ${params.email}.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const orderTitle = () => `Tilaus- ja toimitusehdot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const orderIntroduction = () => `Nämä ehdot kuvaavat tilausprosessiamme, toimitusmenettelyitämme ja palautuskäytäntöjämme. Lue huolellisesti ennen ostosta.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const orderProcessHeading = () => `1. Tilausprosessi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const orderProcessContent = () => `Tilaukset voidaan tehdä verkkosivustoltamme ympäri vuorokauden. Saat tilausvahvistuksen sähköpostitse välittömästi onnistuneen maksun jälkeen.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const paymentMethodsHeading = () => `2. Maksutavat`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const paymentMethodsContent = () => `Hyväksymme luottokortit, PayPalin ja mobiilimaksut. Kaikki tapahtumat käsitellään turvallisesti salatun yhteyden kautta.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const deliveryOptionsHeading = () => `3. Toimitustavat`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const deliveryOptionsContent = () => `Normaali toimitusaika on 3-5 arkipäivää. Pikatoimitus saatavilla lisämaksusta. Digitaaliset tuotteet toimitetaan välittömästi sähköpostitse.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const returnsHeading = () => `4. Palautukset ja vaihdot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const returnsContent = () => `Avattomia tuotteita voidaan palauttaa 14 päivän kuluessa toimituksesta. Ota yhteyttä palautusluvan saamiseksi. Digitaalisia tuotteita ei palauteta.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const liabilityHeading = () => `5. Vastuu`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const liabilityContent = () => `Emme vastaa kuljetusyhtiön tai tullin aiheuttamista viivästyksistä. Vaurioituneet tuotteet on ilmoitettava 48 tunnin kuluessa toimituksesta.`


/**
 * @param {{ email: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const orderContact = (params) => `Tilaukseen liittyvissä kysymyksissä ota yhteyttä sähköpostitse osoitteeseen ${params.email}.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contactTitle = () => `Yhteystiedot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contactIntroduction = () => `Ota meihin yhteyttä alla olevien yhteystietojen kautta. Autamme mielellämme!`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contactDetails = () => `Yhteystiedot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contactEmail = () => `hello@esimerkki.com`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contactPhone = () => `+358 222 222 222`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contactAddress = () => `Liiketoimintakatu 123, Helsinki, Suomi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const businessHours = () => `Aukioloajat`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const hoursWeekdays = () => `Ma-Pe: 9:00 - 17:00`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const hoursWeekends = () => `La-Su: Suljettu`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const hoursHolidays = () => `Pyhäpäivät: Suljettu`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contactFormHeading = () => `Lähetä viesti`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const nameLabel = () => `Nimesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const namePlaceholder = () => `Matti Meikäläinen`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const emailLabel = () => `Sähköpostiosoitteesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const emailPlaceholder = () => `matti@esimerkki.com`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const messageLabel = () => `Viesti`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const messagePlaceholder = () => `Kirjoita viestisi tähän...`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const submitButton = () => `Lähetä viesti`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const contactSuccessMessage = () => `Kiitos viestistä! Vastaamme viestiisi 24 tunnin kuluessa.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const locationHeading = () => `Sijaintimme`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const mapPlaceholder = () => `Kartan paikkamerkki - integroi karttapalvelu tähän`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const paytrail = () => `Maksa paytrailillä. Suomalainen maksupalvelu josta löytyy kaikki suomalaiset pankit.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const cancel_payment = () => `Peruuta maksu`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const payment_details = () => `Maksutiedot`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const close = () => `Sulje`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const welcome = () => `Tervetuloa`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const description = () => `Kuvaus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const hot_products = () => `Kuumat tuotteet!`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const error_email_required = () => `Sähköposti on pakollinen`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const error_email_invalid = () => `Anna kelvollinen sähköpostiosoite`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const error_password_required = () => `Salasana vaaditaan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const error_password_length = () => `Salasanan tulee olla vähintään 6 merkkiä`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const error_login_invalid = () => `Virheellinen sähköposti tai salasana`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const error_general = () => `Tapahtui virhe`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const reset_instructions_sent = () => `Salasanan nollausohjeet lähetetty sähköpostiisi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const reset_success = () => `Salasana nollattu onnistuneesti`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const reset_password_heading = () => `Nollaa salasana`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const no_addresses = () => `Ei tallennettuja osoitteita`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const add_address = () => `Lisää osoite`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const save_address = () => `Tallenna osoite`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const street_address = () => `Katuosoite`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const street_address_2 = () => `Asunto, huoneisto, jne.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const success_new_address = () => `Uusi osoite lisätty`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const banner_text = () => `Ilmainen toimitus | 30 päivän palautus | Premium-laatu`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const favorites_title = () => `Suosikit`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const favorites_empty = () => `Suosikkisi on tyhjillään`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const page_not_found = () => `Sivua ei löytynyt`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const sort_by = () => `Lajittele`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const sort_products = () => `Lajittele tuotteet`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const default_sort = () => `Oletus`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const price_low_high = () => `Hinta: Alhaalta ylöspäin`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const price_high_low = () => `Hinta: Ylhäältä alaspäin`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const name_a_z = () => `Nimi: A-Z`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const name_z_a = () => `Nimi: Z-A`


/**
 * @param {{ name: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const aboutTitle = (params) => `Tietoa meistä - ${params.name}`


/**
 * @param {{ name: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const aboutDescription = (params) => `Tutustu tarinamme, arvoihimme ja intohimoiseen tiimiimme ${params.name} takana`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const heroTitle = () => `Luomme kokemuksesi`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const heroSubtitle = () => `Olemme sitoutuneet tuomaan sinulle parhaat tuotteet ja poikkeuksellista palvelua jo vuosikymmenen ajan`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const ourStory = () => `Tarinamme`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const ourValues = () => `Arvomme`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const ourTeam = () => `Tiimimme`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const storyTitle = () => `Autotallista maailmalle`


/**
 * @param {{ founder: NonNullable<unknown> }} params
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const storyContent1 = (params) => `Se mikä alkoi pienenä perhepajana vuonna 2010, on kukoistanut kansainväliseksi verkkokaupaksi. Perustajamme ${params.founder} alkoi valmistaa käsintehtyä koruja keittiön pöydällään, intohimonaan kestävä muoti.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const storyContent2 = () => `Tänään teemme yhteistyötä yli 200 käsityöläisen kanssa ympäri maailmaa, tuoden sinulle ainutlaatuisia, eettisesti valmistettuja tuotteita säilyttäen sen henkilökohtaisen kosketuksen, josta kaikki alkoi.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const valueSustainability = () => `Kestävyys`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const valueQuality = () => `Laatu`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const valueCommunity = () => `Yhteisö`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const valueDescription = () => `Lorem suomi dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const statsCustomers = () => `Tyytyväistä asiakasta`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const statsArtisans = () => `Käsityöläiskumppania`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const statsCountries = () => `Palveltua maata`


/**
 * 
 * @returns {string}
 */
/* @__NO_SIDE_EFFECTS__ */
export const valueDescription2 = () => `Lorem suomi2 ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.`
