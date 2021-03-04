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
  * @description Options
  * @typedef Options
  * @type {object}
  * @property {number} timeout Number of msec to wait the popup response, default value: 1600000 msec.
  */

/**
 * @description Algorand account address
 * @typedef Address
 * @type {string}
 */

/**
 * @description Payment transaction object
 * @typedef PaymentTxn
 * @type {object}
 * @property {"pay"} type Transaction type
 * @property {Address} from Sender Address
 * @property {Address} [to] Receiver Address
 * @property {number} fee Transaction fee (in mAlgos)
 * @property {number} [amount] Amount to transfer (in mAlgos)
 * @property {number} firstRound First block round
 * @property {number} lastRound Last block round
 * @property {Uint8Array|Base64} [note] Transaction note
 * @property {string} genesisID Algorand network genesis ID
 * @property {string} genesisHash Algorand network genesis hash
 * @property {Address} [reKeyTo] Change signer address
 * @property {boolean} [flatFee] flatFee (default: false)
 * @property {Address} [signer] Signer address
 * @property {Buffer|Base64} [group] Group id
 * @property {Address} [closeRemainderTo] Close remainder to address
 */

/**
 * @description Asset transfer transaction object
 * @typedef AssetTransferTxn
 * @type {object}
 * @property {"axfer"} type Transaction type
 * @property {Address} from Sender Address
 * @property {Address} [to] Receiver Address
 * @property {number} fee Transaction fee (in mAlgos)
 * @property {number} [amount] Amount to transfer (in mAlgos)
 * @property {number} firstRound First block round
 * @property {number} lastRound Last block round
 * @property {Uint8Array|Base64} [note] Transaction note
 * @property {string} genesisID Algorand network genesis ID
 * @property {string} genesisHash Algorand network genesis hash
 * @property {Address} [reKeyTo] Change signer address
 * @property {boolean} [flatFee] flatFee (default: false)
 * @property {Address} [signer] Signer address
 * @property {Buffer|Base64} [group] Group id
 * @property {Address} [closeRemainderTo] Close remainder to address
 * @property {number} [assetIndex] Asset index
 * @property {Address} [assetRevocationTarget] Asset revocation address
 */

/**
 * @description Asset configuration transaction object
 * @typedef AssetConfigTxn
 * @type {object}
 * @property {"acfg"} type Transaction type
 * @property {Address} from Sender Address
 * @property {number} fee Transaction fee (in mAlgos)
 * @property {number} firstRound First block round
 * @property {number} lastRound Last block round
 * @property {Uint8Array|Base64} [note] Transaction note
 * @property {string} genesisID Algorand network genesis ID
 * @property {string} genesisHash Algorand network genesis hash
 * @property {Address} [reKeyTo] Change signer address
 * @property {boolean} [flatFee] flatFee (default: false)
 * @property {Address} [signer] Signer address
 * @property {Buffer|Base64} [group] Group id
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
 * @property {boolean} [strictEmptyAddressChecking]
 */

/**
 * @description Key registration transaction object
 * @typedef KeyRegTxn
 * @type {object}
 * @property {"keyreg"} type Transaction type
 * @property {Address} from Sender Address
 * @property {number} fee Transaction fee (in mAlgos)
 * @property {number} firstRound First block round
 * @property {number} lastRound Last block round
 * @property {Uint8Array|Base64} [note] Transaction note
 * @property {string} genesisID Algorand network genesis ID
 * @property {string} genesisHash Algorand network genesis hash
 * @property {Address} [reKeyTo] Change signer address
 * @property {boolean} [flatFee] flatFee (default: false)
 * @property {Address} [signer] Signer address
 * @property {Buffer|Base64} [group] Group id
 * @property {string} [voteKey] Vote key
 * @property {string} [selectionKey] Selection key
 * @property {number} voteFirst Vote first round
 * @property {number} voteLast Vote last round
 * @property {number} [voteKeyDilution] Vote key dilution
 */

/**
 * @description Application call transaction object
 * @typedef ApplicationTxn
 * @type {object}
 * @property {"appl"} type Transaction type
 * @property {Address} from Sender Address
 * @property {number} fee Transaction fee (in mAlgos)
 * @property {number} firstRound First block round
 * @property {number} lastRound Last block round
 * @property {Uint8Array|Base64} [note] Transaction note
 * @property {string} genesisID Algorand network genesis ID
 * @property {string} genesisHash Algorand network genesis hash
 * @property {Address} [reKeyTo] Change signer address
 * @property {boolean} [flatFee] flatFee (default: false)
 * @property {Address} [signer] Signer address
 * @property {Buffer|Base64} [group] Group id
 * @property {number} [appIndex] Application id
 * @property {0|1|2|3|4|5} [appOnComplete]
 * @property {number} [appLocalInts]
 * @property {number} [appLocalByteSlices]
 * @property {number} [appGlobalInts]
 * @property {number} [appGlobalByteSlices]
 * @property {Uint8Array|Base64} [appApprovalProgram]
 * @property {Uint8Array|Base64} [appClearProgram]
 * @property {Uint8Array[]|Base64[]} [appArgs]
 * @property {Address[]} [appAccounts]
 * @property {number[]} [appForeignApps]
 * @property {number[]} [appForeignAssets]
 */

/**
 * @description Transaction Object
 * @typedef Transaction
 * @type {PaymentTxn | AssetTransferTxn | AssetConfigTxn | KeyRegTxn | ApplicationTxn}
 */

/**
 * @typedef SignedTx
 * @type {object}
 * @property {TxHash} txID Transaction hash
 * @property {Uint8Array} blob Signed transaction
 */


/**
 * @description Preparate transactions before send it to the bridge.
 * This method changes all ArrayBuffer to base64.
 * @param {Transaction} txn Transaction provided by the user
 * @returns {Transaction} Return the same input
 */
function prepareTxn(txn) {

	if (txn.note && txn.note.constructor === Uint8Array)
		txn.note = Buffer.from(txn.note).toString("base64");

	if (txn.group && txn.group.constructor === Uint8Array)
		txn.group = Buffer.from(txn.group).toString("base64");

	if (txn.type === "appl" && txn.appApprovalProgram && txn.appApprovalProgram.constructor === Uint8Array)
		txn.appApprovalProgram = Buffer.from(txn.appApprovalProgram).toString("base64");

	if (txn.type === "appl" && txn.appClearProgram && txn.appClearProgram.constructor === Uint8Array)
		txn.appClearProgram = Buffer.from(txn.appClearProgram).toString("base64");

	if (txn.type === "appl" && txn.appArgs && txn.appArgs.length > 0)
		for (let i = 0; i < txn.appArgs.length; i++)
			if (txn.appArgs[i].constructor === Uint8Array)
				txn.appArgs[i] = Buffer.from(txn.appArgs[i]).toString("base64");

	return txn;
}

class MyAlgoConnect {

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
		this._url = (frameUrl ? frameUrl : "https://wallet.myalgo.com/bridge");

		if (this._url.endsWith("/"))
			this._url = this._url.slice(0, -1);
	}

	/**
	 * @async
	 * @access public
	 * @description Open a new window to load accounts from storage.
	 * @param {Options} [options] Operation options
	 * @returns {Promise<string[]>} Returns allowed accounts by the user.
	 */
	async connect(options = { timeout: 1600000 }) {
		try {
			if (currentConnectPopup)
				currentConnectPopup.focus();
			else
				currentConnectPopup = openPopup(this._url + "/connect.html");

			await this._waitForWindowToLoad(currentConnectPopup);

			const res = await this._bridge.sendMessage(
				currentConnectPopup, { method: "unlock" },
				this._url, { waitForReply: true, timeout: options.timeout }
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
	 * @async
	 * @access public
	 * @description Open a new window to sign transaction.
	 * @param {Transaction|Transaction[]} transaction Transaction object or a Transaction array.
	 * (The signer account must be the same for all transactions).
	 * @param {Options} [options] Operation options
	 * @returns {SignedTx|SignedTx[]} Returns transaction blob or an Array of blobs, depends if the
	 * transaction was an object or an array.
	 */
	async signTransaction(transaction, options = { timeout: 1600000 }) {
		let signtxPopup, txn;

		if (Array.isArray(transaction))
			txn = Array.from(transaction).map(tx => prepareTxn(tx));
		else
			txn = prepareTxn(Object.assign({}, transaction));

		try {
			signtxPopup = openPopup(this._url + "/signtx.html");
			await this._waitForWindowToLoad(signtxPopup);

			// Send transaction info
			const res = await this._bridge.sendMessage(
				signtxPopup, { method: "transaction", params: { txn } },
				this._url, { waitForReply: true, timeout: options.timeout }
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
	 * @access public
	 * @description Open a new window to sign a teal program.
	 * @param {Uint8Array|Base64} logic LogicSig program
	 * @param {Address} address Signer Address
	 * @param {Options} [options] Operation options
	 * @returns {Uint8Array} Returns logicsig blob
	 */
	async signLogicSig(logic, address, options = { timeout: 1600000 }) {
		let signLogicSigPopup;

		try {
			signLogicSigPopup = openPopup(this._url + "/logicsigtx.html");
			await this._waitForWindowToLoad(signLogicSigPopup);

			// Send program
			let logicInBase64 = logic;
			if (logic.constructor === Uint8Array)
				logicInBase64 = Buffer.from(logic).toString("base64");
			const res = await this._bridge.sendMessage(
				signLogicSigPopup, { method: "logicsig", params: { logic: logicInBase64, address } },
				this._url, { waitForReply: true, timeout: options.timeout }
			);

			if (signLogicSigPopup)
				signLogicSigPopup.close();

			if (res.status === "error")
				throw new Error(res.message);

			return new Uint8Array(Buffer.from(res.data.signedTeal, "base64"));
		}
		catch (err) {
			if (signLogicSigPopup)
				signLogicSigPopup.close();
			signLogicSigPopup = null;
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
				const res = await bridge.sendMessage(targetWindow, { method: "status" }, this._url);
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

module.exports = MyAlgoConnect;
