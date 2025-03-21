import { gql } from '$lib/gql';

export const Product = gql(`
	fragment Product on Product {
		id
		name
		slug
		description
		featuredAsset {
			id
			preview
		}
		variants {
			id
			price
			stockLevel
		}
	}
`);

export const ProductDetail = gql(`
	fragment ProductDetail on Product {
		id
		name
		slug
		description
		featuredAsset {
			...Asset
		}
		assets {
			...Asset
		}
		optionGroups {
			id
			code
			name
			options {
				id
				code
				name
			}
		}
		variants {
			id
			name
			sku
			stockLevel
			currencyCode
			price
			priceWithTax
			facetValues {
				id
				name
				facet {
					id
					name
				}
			}
			options {
				id
				groupId
				code
				name
			}
			featuredAsset {
				...Asset
			}
			assets {
				...Asset
			}
		}
		collections {
			breadcrumbs {
			name
			slug
			}
		}
		customFields {
			incredientlist
			allergenlist
    		customizationOptions {
    			enabled
       			limit
       			filling
      			}
			extraoptions {
				enabled
				price
				extrachoices
				}
			}
	}
`);

export const ProductDetailCustomFields = gql(`
	fragment ProductDetailCustomFields on Product {
		id
		name
		slug
		description
		featuredAsset {
			...Asset
		}
		assets {
			...Asset
		}
		optionGroups {
			id
			code
			name
			options {
				id
				code
				name
			}
		}
		variants {
			id
			name
			sku
			stockLevel
			currencyCode
			price
			priceWithTax
			facetValues {
				id
				name
				facet {
					id
					name
				}
			}
			options {
				id
				groupId
				code
				name
			}
			featuredAsset {
				...Asset
			}
			assets {
				...Asset
			}
		}
		collections {
			breadcrumbs {
			name
			slug
			}
		}
		customFields {
			incredientlist  # string with , seperating incredients
	 		allergenlist # string with , seperating incredients
    		customizationOptions {
    			enabled #boolean
       			limit #int
       			filling # string with , seperating incredients
      			}
			extraoptions {
				enabled #boolean
				price # int
				extrachoices # string with , seperating incredients
				}
			}
	}
`);

export const SearchResult = gql(`
	fragment SearchResult on SearchResult {
		productName
		slug
		description
		productId
		productAsset {
			id
			preview
		}
		price {
			... on SinglePrice {
				value
			}
			... on PriceRange {
				min
				max
			}
		}
		facetIds
		facetValueIds
		currencyCode
		productVariantId
		inStock
	}
`);

export const Asset = gql(`
	fragment Asset on Asset {
		id
		createdAt
		updatedAt
		name
		type
		fileSize
		mimeType
		width
		height
		source
		preview
		focalPoint {
			x
			y
		}
		tags {
			id
			value
			createdAt
			updatedAt
		}
	}
`);

export const GetProducts = gql(`
	query GetProducts($options: ProductListOptions) {
		products(options: $options) {
			items {
				...ProductDetail
			}
			totalItems
		}
	}
`);

export const GetProduct = gql(`
	query GetProduct($slug: String!) {
		product(slug: $slug) {
			...ProductDetailCustomFields
			}
	}
`);

export const FacetValueResult = gql(`
	fragment FacetValueResult on FacetValueResult{
		facetValue {
		    id
        	name
        	facet {
          		id
          		name
        	}
		}
		count
	}
`);
export const SearchProducts = gql(`
	query SearchProducts($input: SearchInput!) {
		search(input: $input) {
			items {
				...SearchResult
			}
			totalItems
			facetValues {
			...FacetValueResult
    		}
		}
	}
`);
