/**
 * Object containing a message string and a timeout number.
 * @typedef {Object} MessageWithTimeout
 * @property {string} message - The message string.
 * @property {number} timeout - The timeout number.
 * @property {string} type - Notif type.
 * @property {string} id - id.
 */
function createNotificationStore() {
	/** @type {MessageWithTimeout[]} */
	// @ts-ignore
	let nofiticationsArr = $state([]);

	/**
	 * A function that takes a string and a number as parameters.
	 * @param {string} message - The input string.
	 * @param {number} timeout - The input number.
	 * @param {string} type - The type string.
	 * @returns {void}
	 */
	function newNotif(message, timeout, type) {
		const notifObj = {
			message: message,
			timeout: timeout,
			type: type,
			id: window.crypto.randomUUID()
		};
		nofiticationsArr.push(notifObj);
		setTimeout(() => {
			nofiticationsArr.shift();
		}, notifObj.timeout);
	}
	return {
		get notifs() {
			return nofiticationsArr;
		},
		success: (/** @type {string} */ message, /** @type {number} */ timeout = 3000) =>
			newNotif(message, timeout, 'success'),
		error: (/** @type {string} */ message, /** @type {number} */ timeout = 3000) =>
			newNotif(message, timeout, 'error')
	};
}
export const toast = createNotificationStore();