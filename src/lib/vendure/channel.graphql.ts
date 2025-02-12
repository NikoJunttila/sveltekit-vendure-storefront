import { gql } from '$lib/gql';

export const ActiveChannel = gql(`
query ActiveChannel {
  activeChannel {
    id
    code
    defaultLanguageCode
    availableLanguageCodes
    availableCurrencyCodes
    defaultCurrencyCode
    seller{
      name
    }
  }
}    
`);
