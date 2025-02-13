import { gql } from '$lib/gql';

export const Collection = gql(`
	fragment Collection on Collection {
		id
		name
		slug
		description
		parentId
		parent {
			id
			name
			slug
		}
		breadcrumbs {
			id
			name
			slug
		}
		featuredAsset {
			id
			preview
		}
	}
`);

export const GetCollection = gql(`
	query GetCollection($slug: String!, $skip: Int, $take: Int) {
		collection(slug: $slug) {
			...Collection
		}
		search(
			input: {
				collectionSlug: $slug,
				groupByProduct: true,
				skip: $skip,
				take: $take 
			}
		) {
			items {
				...SearchResult
			}
			totalItems
		}
	}
`);

export const GetCollections = gql(`
	query GetCollections($options: CollectionListOptions) {
		collections(options: $options) {
			items {
				...Collection
			}
			totalItems
		}
	}
`);

export const GetTopLevelCollections = gql(`
	query GetTopLevelCollections {
		collections(options: { topLevelOnly: true }) {
			items {
				...Collection
			}
			totalItems
		}
	}
`);
