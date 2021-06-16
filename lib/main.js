const { openPopup } = require("./popup/popup");
const { sleep, prepareTxn } = require("./utils/utils");
const Errors = require("./utils/errors");

const Messaging = require("./messaging/Messaging");
const bridge = new Messaging();

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
  * @property {string} [bridgeUrl] Override wallet.myalgo.com default frame url.
  * @property {number} [timeout] Number of msec to wait the popup response, default value: 1600000 msec.
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
 * @typedef EncodedTransaction
 * @type {Uint8Array|Base64} Algorand Encoded Transaction
 */

/**
 * @typedef SignedTx
 * @type {object}
 * @property {TxHash} txID Transaction hash
 * @property {Uint8Array} blob Signed transaction
 */

class MyAlgoConnect {

	/**
	 * @constructor
	 * @param {Options} [options] Operation options
	 */
	constructor(options) {

		/**
		 * @access private
		 * @type {Messaging}
		 */
		this.bridge = bridge;

		/**
		 * @access private
		 * @type {number} Popup Timeout
		 */
		this.timeout = (options && options.timeout ? options.timeout : 1600000);

		/**
		 * @access private
		 * @type {string} Frame url
		 */
		this.url = (options && options.bridgeUrl ? options.bridgeUrl : "https://wallet.myalgo.com/bridge");

		if (this.url.endsWith("/"))
			this.url = this.url.slice(0, -1);

		/**
		 * @access private
		 * @description This is used to reuse the current connect opened popup
		 * @type {Window|null}
		 */
		this.currentConnectPopup = null;

		/**
		 * @access private
		 * @description This is used to reuse the current signtx opened popup
		 * @type {Window|null}
		 */
		this.currentSigntxPopup = null;

		/**
		 * @access private
		 * @description This is used to reuse the current signlogic opened popup
		 * @type {Window|null}
		 */
		this.currentSignLogicSigPopup = null;

	}

	/**
	 * @async
	 * @access public
	 * @description Open a new window to load accounts from storage.
	 * @param {ConnectionSettings} settings Connect settings
	 * @returns {Promise<string[]>} Returns allowed accounts by the user.
	 */
	async connect(settings = { shouldSelectOneAccount: false }) {

		if (this.currentConnectPopup) {
			this.currentConnectPopup.focus();
			throw new Error(Errors.WINDOW_IS_OPENED);
		}

		try {
			this.currentConnectPopup = openPopup(this.url + "/connect.html");

			await this.waitForWindowToLoad(this.currentConnectPopup);

			const res = await this.bridge.sendMessage(
				this.currentConnectPopup, { method: "unlock", params: { shouldSelectOneAccount: settings.shouldSelectOneAccount } },
				this.url, { waitForReply: true, timeout: this.timeout }
			);

			if (this.currentConnectPopup)
				this.currentConnectPopup.close();
			this.currentConnectPopup = null;

			if (res.status === "error")
				throw new Error(res.message);

			this.currentConnectPopup = null;

			return res.data.accounts;
		}
		catch (err) {
			if (this.currentConnectPopup)
				this.currentConnectPopup.close();
			this.currentConnectPopup = null;
			throw err;
		}
	}

	/**
	 * @async
	 * @access public
	 * @description Open a new window to sign transaction.
	 * @param {Transaction|Transaction[]|EncodedTransaction|EncodedTransaction[]} transaction Transaction object or a Transaction array.
	 * (The signer account must be the same for all transactions).
	 * @returns {(SignedTx|SignedTx[])} Returns transaction blob or an Array of blobs, depends if the
	 * transaction was an object or an array.
	 */
	async signTransaction(transaction) {
		let txn;

		if (Array.isArray(transaction))
			txn = Array.from(transaction).map(tx => prepareTxn(tx));
		else
			txn = prepareTxn(transaction);

		if (this.currentSigntxPopup) {
			this.currentSigntxPopup.focus();
			throw new Error(Errors.WINDOW_IS_OPENED);
		}

		try {
			this.currentSigntxPopup = openPopup(this.url + "/signtx.html");

			await this.waitForWindowToLoad(this.currentSigntxPopup);

			// Send transaction info
			const res = await this.bridge.sendMessage(
				this.currentSigntxPopup, { method: "transaction", params: { txn } },
				this.url, { waitForReply: true, timeout: this.timeout }
			);

			if (this.currentSigntxPopup)
				this.currentSigntxPopup.close();
			this.currentSigntxPopup = null;

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
			if (this.currentSigntxPopup)
				this.currentSigntxPopup.close();
			this.currentSigntxPopup = null;
			throw err;
		}
	}

	/**
	 * @async
	 * @access public
	 * @description Open a new window to sign a teal program.
	 * @param {Uint8Array|Base64} logic LogicSig program
	 * @param {Address} address Signer Address
	 * @returns {Uint8Array} Returns logicsig blob
	 */
	async signLogicSig(logic, address) {

		if (this.currentSignLogicSigPopup) {
			this.currentSignLogicSigPopup.focus();
			throw new Error(Errors.WINDOW_IS_OPENED);
		}

		try {
			this.currentSignLogicSigPopup = openPopup(this.url + "/logicsigtx.html");
			await this.waitForWindowToLoad(this.currentSignLogicSigPopup);

			// Send program
			let logicInBase64 = logic;
			if (logic.constructor === Uint8Array)
				logicInBase64 = Buffer.from(logic).toString("base64");
			const res = await this.bridge.sendMessage(
				this.currentSignLogicSigPopup, { method: "logicsig", params: { logic: logicInBase64, address } },
				this.url, { waitForReply: true, timeout: this.timeout }
			);

			if (this.currentSignLogicSigPopup)
				this.currentSignLogicSigPopup.close();
			this.currentSignLogicSigPopup = null;

			if (res.status === "error")
				throw new Error(res.message);

			return new Uint8Array(Buffer.from(res.data.signedTeal, "base64"));
		}
		catch (err) {
			if (this.currentSignLogicSigPopup)
				this.currentSignLogicSigPopup.close();
			this.currentSignLogicSigPopup = null;
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
	async waitForWindowToLoad(targetWindow, retries = 30) {
		for (let i = 0; i < retries; i++) {
			await sleep(300);
			if (!targetWindow) break;
			try {
				const res = await bridge.sendMessage(targetWindow, { method: "status" }, this.url);
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
