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
 * @description Base64 string
 * @typedef Base64
 * @type {string}
 */

/**
 * @description Algorand account address
 * @typedef Address
 * @type {string}
 */

/**
 * @description Transaction object
 * @typedef Transaction
 * @property {"pay"|"axfer"|"acfg"|"afrz"} type
 * @property {Address} from Sender Address
 * @property {Address} [to] Receiver Address
 * @property {number} [fee] Transaction fee (in mAlgos)
 * @property {number} [amount] Amount to transfer (in mAlgos)
 * @property {number} firstRound First block round
 * @property {number} lastRound Last block round
 * @property {Base64} [note] Note in base64
 * @property {string} genesisID Algorand network genesis ID
 * @property {string} genesisHash Algorand network genesis hash
 * @property {Address} [closeRemainderTo] Close remainder to address
 * @property {number} [assetIndex] Asset index
 * @property {number} [assetTotal] Asset total supply
 * @property {number} [assetDecimals] Asset decimals
 * @property {boolean} [assetDefaultFrozen] Default frozen
 * @property {Address} [assetManager] Asset manager address
 * @property {Address} [assetReserve] Asset reserve address
 * @property {Address} [assetFreeze] Asset freeze address
 * @property {Address} [assetClawback] Asset clawback address
 * @property {string} [assetUnitName] Asset unit name
 * @property {string} [assetName] Asset name
 * @property {string} [assetURL] Asset url
 * @property {string} [assetMetadataHash] Asset metadata hash
 * @property {Address} [freezeAccount] Freeze Account
 * @property {boolean} [freezeState] Freeze state
 * @property {Address} [assetRevocationTarget] Asset revocation address
 * @property {Address} [reKeyTo] Change signer address
 */

class MyAlgoWallet {

	/**
	 * @constructor
	 * @param {string} [frameUrl] Override wallet.myalgo.com default frame url.
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
	 * @description Open a new window to load accounts from storage.
	 * @param {number} [timeout] Number of msec to wait the popup response, default value: 1600000 msec.
	 * @returns {Promise<string[]>} Returns allowed accounts by the user.
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
	 * @description Open a new window to sign transaction.
	 * @param {Transaction|Array<Transaction>} transaction Transaction object or a Transaction array.
	 * (Sender must be the same for all transactions).
	 * @param {number} [timeout] Number of msec to wait the popup response, default value: 1600000 msec.
	 * @returns {Uint8Array|Array<Uint8Array>} Returns transaction blob or an Array of blobs, depends if the
	 * transaction was an object or an array.
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
	 * @description Wait until the window opened loads.
	 * @param {Window} targetWindow Window opened context.
	 * @param {number} retries Times to retry before throw an error.
	 * @returns {Promise<void>} Throw error if the window does not load.
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
