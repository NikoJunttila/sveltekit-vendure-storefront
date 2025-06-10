export const load = async ({ cookies }) => {
let languageCode = cookies.get("paraglide_lang")
if (!languageCode){
    languageCode = ""
}
  return {
    languageCode
  }
}
