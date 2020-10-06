const MyAlgoWallet = require("./main");
const Errors = require("./utils/errors");
const { EventEmitter } = require("events");

class MyAlgoWalletWithIframe extends MyAlgoWallet {

	/**
	 * @constructor
	 * @param {string} frameUrl Override wallet.myalgo.com default frame url.
	 */
	constructor(frameUrl) {
		super(frameUrl);
		this.listenerCallback = this.listenerCallback.bind(this);
		this.bridge.setNewListener(listenerCallback);

		/**
		 * @access private
		 * @type {string}
		 */
		this._frameId = "MyAlgoWallet";

		let frame = document.getElementById(this._frameId);
		frame = frame || this._createFrame(url);

		/**
		 * @access private
		 * @type {Window|null}
		 * @description frameHub contains the windows context of the injected iframe.
		 */
		if (!frame.contentWindow)
			throw new Error(Errors.IFRAME_NOT_FOUND);

		this.frameHub = frame.contentWindow;

		/**
		 * @access private
		 * @type {boolean}
		 * @description Subscription identifier
		 */
		this.isSuscribed = false;

		/**
		 * @access private
		 * @type {EventEmitter}
		 * @description Event emitter
		 */
		this.eventEmitter = new EventEmitter();
	}

	/**
	 * @async
	 * @access public
	 * @description Get iframe lock status.
	 * @returns {boolean} Returns true if the iframe is locked.
	 */
	async isLocked() {
		// Connection to iframe
		const res = await this.bridge.sendMessage(
			this.frameHub, { method: "status" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		return res.data.isLocked;
	}

	async unlock(password) {
		// TO-DO
	}

	/**
	 * @async
	 * @access public
	 * @description Lock the iframe
	 * @returns {void}
	 */
	async lock() {
		// Connection to iframe
		const res = await this.bridge.sendMessage(
			this.frameHub, { method: "lock" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);
	}

	/**
	 * @description Callback function to manage message received from the channel
     * @callback Listener
     * @param {object} update Request received from another window
	 * @returns {void}
	 */

	/**
	 * @access public
	 * @description Start listener
	 * @param {"ACCOUNTS_UPDATE"|"SETTINGS_UPDATE"} eventName a
	 * @param {Listener} callback Callback listener function
	 * @returns {void}
	 */
	on(eventName, callback) {
		if (!this.isSuscribed)
			this.subscribe().then(() => undefined);
		this.eventEmitter.on(eventName, callback);
	}

	/**
	 * @access public
	 * @description Stop listener
	 * @param {"ACCOUNTS_UPDATE"|"SETTINGS_UPDATE"} eventName a
	 * @param {Listener} callback Callback listener function
	 * @returns {void}
	 */
	off(eventName, callback) {
		this.eventEmitter.off(eventName, callback);
	}

	listenerCallback(req, cb) {
		this.eventEmitter.emit("ACCOUNTS_UPDATE");
		this.eventEmitter.emit("SETTINGS_UPDATE");
	}

	/**
	 * @async
	 * @access private
	 * @description Subscribe for iframe updates
	 * @returns {void}
	 */
	async subscribe() {
		if (this.isSuscribed) return;
		const res = await this.bridge.sendMessage(
			this.frameHub, { method: "subscribe" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		this.subscribeID = res.data.subscriptionID;
		this.isSuscribed = true;
	}

	/**
	 * @async
	 * @access private
	 * @description Unsubscribe for iframe updates
	 * @returns {void}
	 */
	async unsubscribe() {
		if (!this.subscribeID) return;
		const res = await this.bridge.sendMessage(
			this.frameHub, { method: "unsubscribe" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		this.subscribeID = null;
		this.isSuscribed = false;
	}

	/**
	 * @async
	 * @access public
	 * @description Get wallet accounts from iframe
	 * @returns {Promise<string[]>} Accounts list
	 */
	async getAccounts() {
		if (!this.isSuscribed)
			this.subscribe().then(() => undefined);

		// Connection to iframe
		const res = await this.bridge.sendMessage(
			this.frameHub, { method: "list" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		return res.data.accounts;
	}

	/**
	 * @async
	 * @access public
	 * @description Configuration has autolock time, network, default values ...
	 * @returns {Promise<object>} Returns MyAlgo user's settings
	 */
	async getSettings() {
		if (!this.isSuscribed)
			this.subscribe().then(() => undefined);

		// Connection to iframe
		const res = await this.bridge.sendMessage(
			this.frameHub, { method: "list" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		return res.data.settings;
	}
}

/**
 * The styles to be applied to the generated iFrame. Defines a set of properties
 * that hide the element by positioning it outside of the visible area, and
 * by modifying its display.
 *
 * @member {Object}
 */
MyAlgoWalletWithIframe.frameStyle = {
	display: 'none',
	position: 'absolute',
	top: '-999px',
	left: '-999px'
};

/**
 * Creates a new iFrame containing the hub. Applies the necessary styles to
 * hide the element from view, prior to adding it to the document body.
 * Returns the created element.
 *
 * @private
 *
 * @param  {string}            url The url to the hub
 * @returns {HTMLIFrameElement} The iFrame element itself
 */
MyAlgoWalletWithIframe.prototype._createFrame = function(url) {
	let frame, key;

	frame = window.document.createElement('iframe');
	frame.id = this._frameId;

	// Style the iframe
	for (key in MyAlgoWalletWithIframe.frameStyle) {
		if (MyAlgoWalletWithIframe.frameStyle.hasOwnProperty(key)) {
			frame.style[key] = MyAlgoWalletWithIframe.frameStyle[key];
		}
	}

	window.document.body.appendChild(frame);
	frame.src = url;

	return frame;
};

module.exports = MyAlgoWalletWithIframe;
