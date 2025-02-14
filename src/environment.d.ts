export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			PUBLIC_SHOPAPI_DEV_URL: string;
			PUBLIC_SHOPAPI_PROD_URL: string;
			PUBLIC_REQUIRE_EMAIL_VERIFICATION: boolean;
			PUBLIC_DEFAULT_CURRENCY: string;
			PUBLIC_SITE_NAME: string;
			PUBLIC_SITE_IMAGE: string;
			PUBLIC_SITE_URL: string;
			PUBLIC_STRIPE_KEY: string;
			PUBLIC_VENDURE_CHANNEL_TOKEN: string;
			PUBLIC_VENDURE_LANGUAGE: string;
			PUBLIC_VENDURE_MULTI: string;
			PUBLIC_ORGANIZATION: string;
			PUBLIC_SITE_ADDRESS: string;
			PUBLIC_SITE_CITY: string;
			PUBLIC_SITE_STATE: string;
			PUBLIC_SITE_ZIP: string;
			PUBLIC_SITE_EMAIL: string;
			PUBLIC_SITE_PHONE: string;
			PUBLIC_FACEBOOK_URL: string;
			PUBLIC_TWITTER_URL: string;
			PUBLIC_YOUTUBE_URL: string;
			PUBLIC_STRIPE_REDIRECT_URL: string;
		}
	}
}
