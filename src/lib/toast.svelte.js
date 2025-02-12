/**
 * Object containing a message string and a timeout number.
 * @typedef {Object} MessageWithTimeout
 * @property {string} message - The message string.
 * @property {number} timeout - The timeout number.
 * @property {string} type - Notif type.
 * @property {string} id - Unique identifier.
 */
function createNotificationStore() {
	/** @type {MessageWithTimeout[]} */
	// @ts-ignore
	let notifications = $state([]);

	/**
	 * Creates a new notification and automatically removes it after timeout
	 * @param {string} message - The message content
	 * @param {number} timeout - Time in milliseconds before auto-removal
	 * @param {string} type - Notification type (success/error)
	 */
	function newNotif(message, timeout, type) {
		const notification = {
			message,
			timeout,
			type,
			id: window.crypto.randomUUID()
		};

		notifications.push(notification);

		setTimeout(() => {
			const index = notifications.findIndex((n) => n.id === notification.id);
			if (index !== -1) {
				notifications.splice(index, 1);
			}
		}, notification.timeout);
	}

	/**
	 * Closes a notification immediately by its ID
	 * @param {string} id - Notification ID to remove
	 */
	function closeNotif(id) {
		const index = notifications.findIndex((n) => n.id === id);
		if (index !== -1) {
			notifications.splice(index, 1);
		}
	}

	return {
		get notifs() {
			return notifications;
		},
		success: (/** @type {string} */ message, /** @type {number} */ timeout = 3000) =>
			newNotif(message, timeout, 'success'),
		error: (/** @type {string} */ message, /** @type {number} */ timeout = 3000) =>
			newNotif(message, timeout, 'error'),
		close: closeNotif
	};
}

export const toast = createNotificationStore();
