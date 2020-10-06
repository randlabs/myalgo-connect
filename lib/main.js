const { openPopup } = require("./popup/popup");
const { sleep } = require("./utils/utils");
const Errors = require("./utils/errors");


const Messaging = require("./messaging/Messaging");
const bridge = new Messaging();


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
		this.bridge = bridge;


		/**
		 * @access private
		 * @type {string} Frame url
		 */
		this.url = (frameUrl ? frameUrl : FRAME_URL) + "/frame.html";
	}

	/**
	 * @async
	 * @description Unlock MyAlgo storage
	 * @param {number} [timeout] Number of msec to wait the popup response, default value: 1600000 msec
	 * @returns {Promise<string[]>} Returns allowed accounts by the user
	 */
	async connect(timeout = 1600000) {
		// Open popup and wait for it
		const popup = openPopup(this.url + "/unlock.html");
		await this.waitForWindowLoad(popup);

		// Wait for unlock
		const res = await this.bridge.sendMessage(
			this.unlockWindow, { method: "unlock" },
			FRAME_URL, { waitForReply: true, timeout }
		);

		if (MODE === "development")
			console.debug(JSON.stringify(res));

		if (res.status === "error")
			throw new Error(res.message);

		if (popup)
			popup.close();

		return res.data.accounts;
	}

	/**
	 * @async
	 * @description Hello World!
	 * @param {Transaction} transaction Transaction object
	 * @param {number} [timeout] Number of msec to wait the popup response, default value: 1600000 msec
	 * @returns {Uint8Array} Returns transaction blob
	 */
	async signTx(transaction, timeout = 1600000) {
		// Opent popup and wait for it
		const popup = openPopup(this.url + "/signtx.html");
		await this.waitForWindowLoad(popup);

		// Send transaction info
		const res = await this.bridge.sendMessage(
			popup, { method: "transaction", params: { txn: transaction } },
			FRAME_URL, { waitForReply: true, timeout }
		);

		if (MODE === "development")
			console.debug(JSON.stringify(res));

		if (res.status === "error")
			throw new Error(res.message);

		if (popup)
			popup.close();

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
	async waitForWindowLoad(targetWindow, retries = 25) {
		for (let i = 0; i < retries; i++) {
			 await sleep(300);
			if (!targetWindow) break;
			try {
				const res = await bridge.sendMessage(targetWindow, { method: "status" }, frameOrigin);
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
