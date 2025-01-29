sveltekit vendure storefront with starting point coming from this repo: https://github.com/pevey/sveltekit-storefront

use different browser for vendure backend and storefront because of cookie overlap

vendure needs stripe plugin and my custom paytrail plugin or just remove paytrail code from code,

For 1gb vm builds
NODE_OPTIONS="--max-old-space-size=768" npm run build
