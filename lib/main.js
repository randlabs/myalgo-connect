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
 * @description Transaction hash
 * @typedef TxHash
 * @type {string}
 */

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
 * @description Transaction type
 * @typedef TxType
 * @type {"pay"|"axfer"|"acfg"|"afrz"|"keyreg"}
 */

/**
 * @description Transaction object
 * @typedef Transaction
 * @property {TxType} type
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
 * @property {string} [voteKey] Vote key
 * @property {string} [selectionKey] Selection key
 * @property {number} [voteFirst] Vote first round
 * @property {number} [voteLast] Vote last round
 * @property {number} [voteKeyDilution] Vote key dilution
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
		 * @type {boolean}
		 */
		this._gotIframe = false;

		/**
		 * @access private
		 * @type {string} Frame url
		 */
		this._url = (frameUrl ? frameUrl : FRAME_URL);

		if (this._url.endsWith("/"))
			this._url = this._url.slice(0, -1);
	}

	/**
	 * @async
	 * @access public
	 * @description Open a new window to load accounts from storage.
	 * @param {number} [timeout] Number of msec to wait the popup response, default value: 1600000 msec.
	 * @returns {Promise<string[]>} Returns allowed accounts by the user.
	 */
	async connect(timeout = 1600000) {
		try {
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

			this._gotIframe = (res.data && res.data.gotIframe) ? res.data.gotIframe : false;

			return res.data.accounts;
		}
		catch (err) {
			if (currentConnectPopup)
				currentConnectPopup.close();
			currentConnectPopup = null;
			throw err;
		}
	}

	/**
	 * @typedef SignedTx
	 * @type {object}
	 * @property {TxHash} txID Transaction hash
	 * @property {Uint8Array} blob Signed transaction
	 */

	/**
	 * @async
	 * @access public
	 * @description Open a new window to sign transaction.
	 * @param {Transaction|Array<Transaction>} transaction Transaction object or a Transaction array.
	 * (Sender must be the same for all transactions).
	 * @param {number} [timeout] Number of msec to wait the popup response, default value: 1600000 msec.
	 * @returns {SignedTx|Array<SignedTx>} Returns transaction blob or an Array of blobs, depends if the
	 * transaction was an object or an array.
	 */
	async signTransaction(transaction, timeout = 1600000) {
		let signtxPopup;

		try {
			signtxPopup = openPopup(this._url + "/signtx.html");
			await this._waitForWindowToLoad(signtxPopup);

			// Send transaction info
			const res = await this._bridge.sendMessage(
				signtxPopup, { method: "transaction", params: { txn: transaction } },
				FRAME_URL, { waitForReply: true, timeout }
			);

			if (signtxPopup)
				signtxPopup.close();

			if (res.status === "error")
				throw new Error(res.message);

			if (Array.isArray(res.data)) {
				const result = [];
				for (const t of res.data) {
					t.blob = new Uint8Array(Buffer.from(t.blob, "hex"));
					result.push(t);
				}
				return result;
			}

			res.data.blob = new Uint8Array(Buffer.from(res.data.blob, "hex"));

			return res.data;
		}
		catch (err) {
			if (signtxPopup)
				signtxPopup.close();
			signtxPopup = null;
			throw err;
		}
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
