const MyAlgoWallet = require("./main");
const Errors = require("./utils/errors");
const { EventEmitter } = require("events");

class MyAlgoWalletWithIframe extends MyAlgoWallet {

	/**
	 * @typedef EventNames
	 * @type {"ACCOUNTS_UPDATE"|"SETTINGS_UPDATE"}
	 */

	/**
	 * @constructor
	 * @param {string} frameUrl Override wallet.myalgo.com default frame url.
	 */
	constructor(frameUrl) {
		super(frameUrl);
		this._listenerCallback = this._listenerCallback.bind(this);
		this._bridge.setNewListener(this._listenerCallback);

		/**
		 * @access private
		 * @type {string}
		 */
		this._frameId = "MyAlgoWallet";

		let frame = document.getElementById(this._frameId);
		frame = frame || this._createFrame(this._url + "/frame.html");

		/**
		 * @access private
		 * @type {Window|null}
		 * @description frameHub contains the windows context of the injected iframe.
		 */
		if (!frame.contentWindow)
			throw new Error(Errors.IFRAME_NOT_FOUND);

		this._frameHub = frame.contentWindow;

		/**
		 * @access private
		 * @type {boolean}
		 * @description Subscription identifier
		 */
		this._isSuscribed = false;

		/**
		 * @access private
		 * @type {EventEmitter}
		 * @description Event emitter
		 */
		this._eventEmitter = new EventEmitter();
	}

	/**
	 * @access public
	 * @description Wait for iframe to load.
	 * @returns {void}
	 */
	onLoad() {
		return new Promise((resolve) => {

			const checkIframeLoaded = () => {

				/**
				 * @type {HTMLIFrameElement}
				 */
				let frame = document.getElementById(this._frameId);
				let iframeDoc = frame.contentDocument || frame.contentWindow.document;
				if (iframeDoc.readyState === "complete") {
					resolve();
					return;
				};

				setTimeout(checkIframeLoaded, 100);
			};

			checkIframeLoaded();
		});
	}

	/**
	 * @async
	 * @access public
	 * @description Get iframe lock status.
	 * @returns {boolean} Returns true if the iframe is locked.
	 */
	async isLocked() {
		// Connection to iframe
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "status" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		return res.data.isLocked;
	}

	/**
	 * @async
	 * @access public
	 * @description Lock the iframe
	 * @returns {void}
	 */
	async lock() {
		// Connecting to iframe
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "lock" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		this._isSuscribed = false;

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
	 * @param {EventNames} eventName a
	 * @param {Listener} callback Callback listener function
	 * @returns {void}
	 */
	on(eventName, callback) {
		if (!this._isSuscribed)
			this._subscribe().then(() => undefined);
		this._eventEmitter.on(eventName, callback);
	}

	/**
	 * @access public
	 * @description Stop listener
	 * @param {EventNames} eventName a
	 * @param {Listener} callback Callback listener function
	 * @returns {void}
	 */
	off(eventName, callback) {
		this._eventEmitter.off(eventName, callback);
	}

	/**
	 * @access private
	 * @description Receive iframe updates
	 * @param {any} req Request
	 * @param {Function} cb Send response function
	 * @returns {void}
	 */
	_listenerCallback(req, cb) {
		if (req.method === "update") {
			this._eventEmitter.emit("ACCOUNTS_UPDATE", req.params);
			this._eventEmitter.emit("SETTINGS_UPDATE", req.params);
			this._eventEmitter.emit("ON_LOCK_WALLET", req.params);
		}
	}

	/**
	 * @async
	 * @access private
	 * @description Subscribe for iframe updates
	 * @returns {void}
	 */
	async _subscribe() {
		if (this._isSuscribed) return;
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "subscribe" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		this.subscribeID = res.data.subscriptionID;
		this._isSuscribed = true;
	}

	/**
	 * @async
	 * @access private
	 * @description Unsubscribe for iframe updates
	 * @returns {void}
	 */
	async _unsubscribe() {
		if (!this.subscribeID) return;
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "unsubscribe" }, FRAME_URL,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		this.subscribeID = null;
		this._isSuscribed = false;
	}

	/**
	 * @async
	 * @access public
	 * @description Get wallet accounts from iframe
	 * @returns {Promise<string[]>} Accounts list
	 */
	async getAccounts() {
		if (!this._isSuscribed)
			await this._subscribe();

		// Connecting to iframe
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "list" }, FRAME_URL,
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
		if (!this._isSuscribed)
			await this._subscribe();

		// Connecting to iframe
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "list" }, FRAME_URL,
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
