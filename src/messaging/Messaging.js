const Messenger = require("bridge-communication/lib/messenger");

const WALLET_BRIDGE_CHANNEL_NAME = "wallet-bridge-communication-channel";

class Messaging {

	/**
	 * @description Request object
	 * @typedef {Object} Request
	 * @property {string} method Request method
	 * @property {Object} [params] Optionally, request params
	 */

	/**
	 * @description Response object
	 * @typedef {Object} Response
	 * @property {"error"|"success"} status Response status
	 * @property {string} message Response message
	 * @property {Object} [data] Optionally, is the request was a success and sent data
	 */


	/**
	 * @description Callback function to manage message received from the channel
     * @callback onMessagingCallback
     * @param {Request} request Request received from another window
     * @param {sendResponse} cb Response callback
	 * @returns {void}
     */

	/**
     * @constructor Messaging constructor
     * @param {onMessagingCallback} [listenerCallback]
     * @description Create an abstraction of Messenger class
     */

	constructor(listenerCallback) {
		this.bridge = new Messenger(WALLET_BRIDGE_CHANNEL_NAME, function(req, source, cb, bridge) {
			if (listenerCallback)
				listenerCallback(req, cb);
		});
	}

	/**
     * @description Send message to a target window
     * @param {Window} window Target window
     * @param {Request} request Request
     * @param {string} origin Target origin
     * @param {import("bridge-communication").sendMessageOptions} options Request options
	 * @returns {Promise<Response>} Response of the target window
     */

	sendMessage(window, request, origin, options) {
		return this.bridge.sendMessage(window, request, origin, options);
	}

	close() {
		this.bridge.close();
	}
}

module.exports = Messaging;
