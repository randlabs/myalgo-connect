const MyAlgoWallet = require("./main");
const Errors = require("./utils/errors");
const { EventEmitter } = require("events");

class MyAlgoWalletWithIframe extends MyAlgoWallet {

	/**
	 * @typedef EventNames
	 * @type {"ACCOUNTS_UPDATE"|"SETTINGS_UPDATE"|"ON_LOCK_WALLET"}
	 */

	constructor(frameUrl, frameId = "myalgo-bridge-iframe") {
		super(frameUrl);
		this._listenerCallback = this._listenerCallback.bind(this);
		this._bridge.setNewListener(this._listenerCallback);
		this._frameId = frameId;
		let frame = document.getElementById(this._frameId);
		if (!frame)
			frame = this._createFrame(this._url + "/frame.html");

		if (!frame.contentWindow)
			throw new Error(Errors.IFRAME_NOT_FOUND);

		this._frameHub = frame.contentWindow;
		this._isSuscribed = false;
		this._eventEmitter = new EventEmitter();
	}

	/**
	 * The styles to be applied to the generated iFrame. Defines a set of properties
	 * that hide the element by positioning it outside of the visible area, and
	 * by modifying its display.
	 *
	 * @member {Object}
	 */
	frameStyle = {
		display: 'none',
		position: 'absolute',
		top: '-999px',
		left: '-999px'
	};

	/**
	 * @access public
	 * @description Wait for iframe to load.
	 * @returns {void}
	 */
	onLoad() {
		return this._waitForWindowToLoad(this._frameHub);
	}

	/**
	 * @access public
	 * @description Unlock the iframe.
	 * @returns {void}
	 */
	async unlock(password) {
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "unlock", params: { password: password } }, this._url,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);
	}

	/**
	 * @access public
	 * @description Get iframe lock status.
	 * @returns {boolean} Returns true if the iframe is locked.
	 */
	async isLocked() {
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "status" }, this._url,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		return res.data.isLocked;
	}

	/**
	 * @access public
	 * @description Lock the iframe
	 * @returns {void}
	 */
	async lock() {
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "lock" }, this._url,
			{ waitForReply: true, timeout: 4000 }
		);

		this._isSuscribed = false;

		if (res.status === "error")
			throw new Error(res.message);
	}

	/**
	 * @access public
	 * @description Start listener
	 * @param {EventNames} eventName Event name to subscribe
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
	 * @param {EventNames} eventName Event name to unsubscribe
	 * @param {Listener} callback Callback listener function
	 * @returns {void}
	 */
	off(eventName, callback) {
		this._eventEmitter.off(eventName, callback);
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
			this._frameHub, { method: "list" }, this._url,
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
			this._frameHub, { method: "list" }, this._url,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		return res.data.settings;
	}


	//PRIVATES METHODS


	/**
	 * @access private
	 * @description Receive iframe updates
	 * @param {any} req Request
	 * @param {Function} cb Response callback
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
	 * @access private
	 * @description Subscribe for iframe updates
	 * @returns {void}
	 */
	async _subscribe() {
		if (this._isSuscribed) return;
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "subscribe" }, this._url,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		this.subscribeID = res.data.subscriptionID;
		this._isSuscribed = true;
	}

	/**
	 * @access private
	 * @description Unsubscribe for iframe updates
	 * @returns {void}
	 */
	async _unsubscribe() {
		if (!this.subscribeID) return;
		const res = await this._bridge.sendMessage(
			this._frameHub, { method: "unsubscribe" }, this._url,
			{ waitForReply: true, timeout: 4000 }
		);

		if (res.status === "error")
			throw new Error(res.message);

		this.subscribeID = null;
		this._isSuscribed = false;
	}

	

	/**
	 * Creates a new iFrame containing the hub. Applies the necessary styles to
	 * hide the element from view, prior to adding it to the document body.
	 * Returns the created element.
	 *
	 * @private
	 * @param  {string}            url The url to the hub
	 * @returns {HTMLIFrameElement} The iFrame element itself
	 */
	_createFrame(url) {
		let frame, key;

		frame = window.document.createElement('iframe');
		frame.id = this._frameId;

		// Style the iframe
		for (key in this.frameStyle) {
			if (this.frameStyle.hasOwnProperty(key)) {
				frame.style[key] = this.frameStyle[key];
			}
		}

		window.document.body.appendChild(frame);
		frame.src = url;

		return frame;
	};
}


module.exports = MyAlgoWalletWithIframe;
