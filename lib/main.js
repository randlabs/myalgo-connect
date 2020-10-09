const { openPopup } = require("./popup/popup");
const { sleep } = require("./utils/utils");
const Errors = require("./utils/errors");


const Messaging = require("./messaging/Messaging");
const bridge = new Messaging();

/**
 * @description This is used to reuse the current opened popup
 * @type {Window|null}
 */
let currentConnectPopup = null;

/**
 * @typedef Transaction
 * @property {string} address Sender Address
 */

class MyAlgoWallet {

	/**
	 * @constructor
	 * @param {string} frameUrl Override wallet.myalgo.com default frame url
	 */
	constructor(frameUrl) {

		/**
		 * @access private
		 * @type {Messaging}
		 */
		this._bridge = bridge;


		/**
		 * @access private
		 * @type {string} Frame url
		 */
		this._url = (frameUrl ? frameUrl : FRAME_URL);
	}

	/**
	 * @async
	 * @access public
	 * @description Unlock MyAlgo storage
	 * @param {number} [timeout] Number of msec to wait the popup response, default value: 1600000 msec
	 * @returns {Promise<string[]>} Returns allowed accounts by the user
	 */
	async connect(timeout = 1600000) {

		if (currentConnectPopup)
			currentConnectPopup.focus();
		else
			currentConnectPopup = openPopup(this._url + "/connect.html");

		await this._waitForWindowToLoad(currentConnectPopup);

		const res = await this._bridge.sendMessage(
			currentConnectPopup, { method: "unlock" },
			FRAME_URL, { waitForReply: true, timeout }
		);

		if (currentConnectPopup)
			currentConnectPopup.close();

		if (res.status === "error")
			throw new Error(res.message);

		currentConnectPopup = null;

		return res.data.accounts;
	}

	/**
	 * @async
	 * @access public
	 * @description Hello World!
	 * @param {Transaction} transaction Transaction object
	 * @param {number} [timeout] Number of msec to wait the popup response, default value: 1600000 msec
	 * @returns {Uint8Array} Returns transaction blob
	 */
	async signTransaction(transaction, timeout = 1600000) {
		// Opent popup and wait for it
		const popup = openPopup(this._url + "/signtx.html");
		await this._waitForWindowToLoad(popup);

		// Send transaction info
		const res = await this._bridge.sendMessage(
			popup, { method: "transaction", params: { txn: transaction } },
			FRAME_URL, { waitForReply: true, timeout }
		);

		if (popup)
			popup.close();

		if (res.status === "error")
			throw new Error(res.message);

		return new Uint8Array(Buffer.from(res.data.signedTx, "hex"));
	}

	/**
	 * @async
	 * @access private
	 * @description Wait until the window opened loads
	 * @param {Window} targetWindow Window opened context
	 * @param {number} retries Times to retry before throw an error
	 * @returns {Promise<void>} Throw error if the window does not load
	 */
	async _waitForWindowToLoad(targetWindow, retries = 25) {
		for (let i = 0; i < retries; i++) {
			 await sleep(300);
			if (!targetWindow) break;
			try {
				const res = await bridge.sendMessage(targetWindow, { method: "status" }, FRAME_URL);
				if (res.status == "success")
					return;
			}
			catch (err) {
				// Ignore error
			}
		}
		throw new Error(Errors.WINDOW_NOT_LOADED);
	}
}

module.exports = MyAlgoWallet;
