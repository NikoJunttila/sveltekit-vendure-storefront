//@ts-nocheck
export function clickOutside(node : any) {
	// the node has been mounted in the DOM
	window.addEventListener('click', handleClick);
	function handleClick(e : any) {
		if (!node.contains(e.target)) {
			node.dispatchEvent(new CustomEvent('outsideclick'));
		}
	}
	return {
		destroy() {
			// the node has been removed from the DOM
			window.removeEventListener('click', handleClick);
		}
	};
}
export const formatCurrency = function (value: number, currencyCode: string, locale?: string) {
	// See Vendure docs for more info:
	// https://docs.vendure.io/guides/core-concepts/money/#displaying-monetary-values
	const majorUnits = value / 100;
	try {
		// If no `locale` is provided, the browser's default locale will be used.
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currencyCode,
			currencyDisplay: 'symbol'
		}).format(majorUnits);
	} catch (e: any) {
		// A fallback in case the NumberFormat fails for any reason
		return majorUnits.toFixed(2);
	}
};

export type HasParent = { id: string; parentId: string | null };
export type TreeNode<T extends HasParent> = T & {
    children: Array<TreeNode<T>>;
};
export type RootNode<T extends HasParent> = {
    id?: string;
    children: Array<TreeNode<T>>;
};

/**
 * Builds a tree from an array of nodes which have a parent.
 * Based on https://stackoverflow.com/a/31247960/772859, modified to preserve ordering.
 */
export function arrayToTree(nodes: any): any[] {
    const map: { [id: string]: TreeNode<T> } = {};
    const roots: TreeNode<T>[] = [];

    // Initialize all nodes in the map
    for (const node of nodes) {
        map[node.id] = { ...node, children: [] };
    }

    // Assign children to their respective parents
    for (const node of nodes) {
        if (node.parentId && map[node.parentId]) {
            map[node.parentId].children.push(map[node.id]);
        } else {
            roots.push(map[node.id]); // Root-level items
        }
    }

    return roots;
}