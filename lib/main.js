const { openPopup } = require("./popup/popup");
const { sleep, prepareTxn } = require("./utils/utils");
const Errors = require("./utils/errors");

const Messaging = require("./messaging/Messaging");

/**
 * @type {Messaging | null}
 */
let bridge = null;

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
  * @property {boolean} [disableLedgerNano] It will disable ledger nano accounts and returns only mnemonic accounts.
  */

/**
  * @description Sign transaction options
  * @typedef SignTransactionOptions
  * @type {object}
  * @property {Address} [overrideSigner] Force transactions to be signed with the specified account instead of the from/auth address.
  */

/**
 * @description Connect method settings
 * @typedef ConnectionSettings
 * @type {object}
 * @property {boolean} [shouldSelectOneAccount] Only returns one account
 * @property {boolean} [openManager] Open account manager
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

		if (!bridge) {
			bridge = new Messaging();
		}

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

		/**
		 * @access private
		 * @description Replace default bridge options
		 * @type {import("@randlabs/communication-bridge").sendMessageOptions}
		 */
		this.options = { waitForReply: true, timeout: this.timeout };

		/**
		 * @access private
		 * @description Disable ledger nano
		 * @type {boolean}
		 */
		this.disableLedgerNano = (options && options.disableLedgerNano) ? options.disableLedgerNano : false;
	}

	/**
	 * @async
	 * @access public
	 * @description Open a new window to load accounts from storage.
	 * @param {ConnectionSettings} settings Connect settings
	 * @returns {Promise<string[]>} Returns allowed accounts by the user.
	 */
	async connect(settings = { shouldSelectOneAccount: false, openManager: false }) {

		if (this.currentConnectPopup) {
			if (this.currentConnectPopup.closed) {
				this.currentConnectPopup = null;
			}
			else {
				this.focusWindow(this.currentConnectPopup);
			}
		}

		try {
			this.currentConnectPopup = openPopup(this.url + "/connect.html");

			await this.waitForWindowToLoad(this.currentConnectPopup);

			const res = await this.bridge.sendMessage(
				this.currentConnectPopup,
				{ method: "unlock", params: Object.assign(settings, { disableLedgerNano: this.disableLedgerNano }) },
				this.url, this.options
			);

			this.closeWindow(this.currentConnectPopup);
			this.currentConnectPopup = null;

			if (res.status === "error")
				throw new Error(res.message);

			return res.data.accounts;
		}
		catch (err) {
			this.closeWindow(this.currentConnectPopup);
			this.currentConnectPopup = null;
			throw err;
		}
	}

	/**
	 * @async
	 * @access public
	 * @description Open a new window to sign transaction.
	 * @param {Transaction|Transaction[]|EncodedTransaction|EncodedTransaction[]} transaction Transaction object or a Transaction array.
	 * @param {SignTransactionOptions} [signOptions] Sign transactions options object.
	 * (The signer account must be the same for all transactions).
	 * @returns {(SignedTx|SignedTx[])} Returns transaction blob or an Array of blobs, depends if the
	 * transaction was an object or an array.
	 */
	async signTransaction(transaction, signOptions) {
		let txn;

		if (this.currentSigntxPopup) {
			if (this.currentSigntxPopup.closed) {
				this.currentSigntxPopup = null;
			}
			else {
				this.focusWindow(this.currentSigntxPopup);
			}
		}

		if (Array.isArray(transaction))
			txn = Array.from(transaction).map(tx => prepareTxn(tx));
		else
			txn = prepareTxn(transaction);

		try {
			this.currentSigntxPopup = openPopup(this.url + "/signtx.html");

			await this.waitForWindowToLoad(this.currentSigntxPopup);

			// Send transaction info
			const res = await this.bridge.sendMessage(
				this.currentSigntxPopup, {
					method: "transaction",
					params: { txn, settings: { disableLedgerNano: this.disableLedgerNano }, options: signOptions },
				},
				this.url, this.options
			);

			this.closeWindow(this.currentSigntxPopup);
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
			this.closeWindow(this.currentSigntxPopup);
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
			if (this.currentSignLogicSigPopup.closed) {
				this.currentSignLogicSigPopup = null;
			}
			else {
				this.focusWindow(this.currentSignLogicSigPopup);
			}
		}

		try {
			this.currentSignLogicSigPopup = openPopup(this.url + "/logicsigtx.html");
			await this.waitForWindowToLoad(this.currentSignLogicSigPopup);

			// Send program
			let logicInBase64 = logic;
			if (logic.constructor === Uint8Array)
				logicInBase64 = Buffer.from(logic).toString("base64");
			const res = await this.bridge.sendMessage(
				this.currentSignLogicSigPopup,
				{ method: "logicsig", params: { logic: logicInBase64, address } },
				this.url, this.options
			);

			this.closeWindow(this.currentSignLogicSigPopup);
			this.currentSignLogicSigPopup = null;

			if (res.status === "error")
				throw new Error(res.message);

			return new Uint8Array(Buffer.from(res.data.signedTeal, "base64"));
		}
		catch (err) {
			this.closeWindow(this.currentSignLogicSigPopup);
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

	/**
	 * @access private
	 * @description Safely close an opened window
	 * @param {Window} window Window object
	 * @returns {void}
	 */
	closeWindow(window) {
		if (window && !window.closed && window.close) {
			window.close();
		}
	}

	/**
	 * @access private
	 * @description Focus current popup
	 * @param {Window} window Window object
	 * @returns {void}
	 * @throws {"Windows is opened"}
	 */
	focusWindow(window) {
		if (window && window.focus) {
			window.focus();
			throw new Error(Errors.WINDOW_IS_OPENED);
		}
		else {
			throw new Error(Errors.INVALID_WINDOW);
		}
	}
}

module.exports = MyAlgoConnect;
