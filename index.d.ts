export type Address = string;
export type Base64 = string;
export type TxHash = string;

interface Txn {
	from: Address;
	fee: number;
	firstRound: number;
	lastRound: number;
	genesisID: string;
	genesisHash: Base64;
	note?: Uint8Array;
	reKeyTo?: Address;
}

interface ConfigTxn extends Txn {
	type: "acfg";
	assetManager?: Address;
	assetReserve?: Address;
	assetFreeze?: Address;
	assetClawback?: Address;
}

interface TransferTxn extends Txn {
	to: Address;
	amount: number;
	closeRemainderTo?: Address;
}

export interface PaymentTxn extends TransferTxn {
	type: "pay";
}

export interface AssetTxn extends TransferTxn {
	type: "axfer";
	assetRevocationTarget?: Address;
	assetIndex: number;
}

export interface AssetConfigTxn extends ConfigTxn {
	assetIndex: number;
}

export interface AssetCreateTxn extends ConfigTxn {
	assetTotal?: number;
	assetDecimals?: number;
	assetDefaultFrozen?: boolean;
	assetName?: string;
	assetUnitName?: string;
	assetURL?: string;
	assetMetadataHash?: Base64;
}

export interface DestroyAssetTxn extends Txn {
	type: "acfg";
	assetIndex: number;
}

export interface FreezeAssetTxn extends Txn {
	type: "afrz";
	assetIndex: number;
	freezeAccount: Address;
	freezeState: boolean;
}

export interface KeyRegTxn extends Txn {
	type: "keyreg";
	voteKey?: Base64;
	selectionKey?: Base64;
	voteFirst: number;
	voteLast: number;
	voteKeyDilution: number;
}

export type AlgorandTxn = PaymentTxn | AssetTxn | AssetConfigTxn | AssetCreateTxn | DestroyAssetTxn | FreezeAssetTxn;


interface SignedTx {
	// Transaction hash
	txID: TxHash;
	// Signed transaction
	blob: Uint8Array;
}

interface Accounts {
	address: Address;
}

interface Options {
	timeout: number;
}

export class MyAlgoWallet {

	/**
	 * @param frameUrl Override wallet.myalgo.com default frame url.
	 */
	constructor(frameUrl?: string);

	/**
	 * @async
	 * @description Receives user's accounts from MyAlgo.
	 * @param options Operation options
	 * @returns Returns an array of Algorand addresses.
	 */
	connect(options?: Options): Promise<Accounts[]>;

	/**
	 * @async
	 * @description Sign an Algorand Transaction.
	 * @param transaction Expect a valid Algorand transaction or transaction array.
	 * @param options Operation options
	 * @returns Returns signed transaction or an array of signed transactions.
	 */
	signTransaction(transaction: AlgorandTxn | AlgorandTxn[], options?: Options): Promise<SignedTx | SignedTx[]>;

	/**
	 * @async
	 * @description Sign a teal program
	 * @param logic Teal program
	 * @param address Signer Address
	 * @param options Operation options
	 * @returns Returns signed teal program
	 */
	signLogicSig(logic: Uint8Array, address: Address, options?: Options): Promise<Uint8Array>
}

type EventNames = "ACCOUNTS_UPDATE" | "SETTINGS_UPDATE" | "ON_LOCK_WALLET";
type onUpdate = (update: any) => void | Promise<void>;

interface StoredAccount {
	address: Address;
	id: string;
	name: string;
	type: string;
}

export class MyAlgoWalletWithIframe extends MyAlgoWallet {
	constructor(frameUrl?: string, frameId?: string);
	onLoad(): Promise<void>;
	isLocked(): Promise<boolean>;
	lock(): Promise<void>;
	unlock(password: string): Promise<void>;
	on(eventName: EventNames, callback: onUpdate): void;
	off(eventName: EventNames, callback: onUpdate): void;
	getAccounts(): Promise<StoredAccount[]>;
	getFullAccountInfo(accountId: string): Promise<any>;
	hasAccount(): Promise<boolean>;
	getSettings(): Promise<any>;
}
