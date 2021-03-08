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
	note?: Uint8Array|Base64;
	reKeyTo?: Address;
	signer?: Address;
	group?: Buffer|Base64;
	flatFee: boolean;
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
	strictEmptyAddressChecking?: boolean;
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

export interface DestroyAssetTxn extends ConfigTxn {
	assetIndex: number;
	strictEmptyAddressChecking?: boolean;
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
	voteKeyDilution?: number;
}

// eslint-disable-next-line no-shadow
export enum OnApplicationComplete {
	NoOpOC = 0,
	OptInOC = 1,
	CloseOutOC = 2,
	ClearStateOC = 3,
	UpdateApplicationOC = 4,
	DeleteApplicationOC = 5
}

export interface ApplicationTxn extends Txn {
	type: "appl";
	appArgs?: Uint8Array[]|Base64[];
	appAccounts?: Address[];
	appForeignApps?: number[];
	appForeignAssets?: number[];
}

export interface CreateApplTxn extends ApplicationTxn {
	appApprovalProgram: Uint8Array|Base64;
	appClearProgram: Uint8Array|Base64;
	appLocalInts: number;
	appLocalByteSlices: number;
	appGlobalInts: number;
	appGlobalByteSlices: number;
}

export interface CallApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.NoOpOC;
}

export interface OptInApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.OptInOC;
}

export interface CloseOutApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.CloseOutOC;
}

export interface ClearApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.ClearStateOC;
}
export interface UpdateApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.UpdateApplicationOC;
	appApprovalProgram: Uint8Array|Base64;
	appClearProgram: Uint8Array|Base64;
}

export interface DeleteApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.DeleteApplicationOC;
}

export type ApplTxn = CreateApplTxn | CallApplTxn | OptInApplTxn | CloseOutApplTxn | ClearApplTxn | UpdateApplTxn;


export type AlgorandTxn = PaymentTxn | AssetTxn | AssetConfigTxn | AssetCreateTxn | DestroyAssetTxn | FreezeAssetTxn | KeyRegTxn | ApplTxn;


export interface SignedTx {
	// Transaction hash
	txID: TxHash;
	// Signed transaction
	blob: Uint8Array;
}

export interface Accounts {
	address: Address;
}

export interface Options {
	timeout: number;
}

export default class MyAlgoConnect {

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
	 * @param transaction Expect a valid Algorand transaction
	 * @param options Operation options
	 * @returns Returns signed transaction
	 */
	signTransaction(transaction: AlgorandTxn, options?: Options): Promise<SignedTx>;

	/**
	 * @async
	 * @description Sign an Algorand Transaction.
	 * @param transaction Expect a valid Algorand transaction array.
	 * @param options Operation options
	 * @returns Returns signed an array of signed transactions.
	 */
	signTransaction(transaction: AlgorandTxn[], options?: Options): Promise<SignedTx[]>;


	/**
	 * @async
	 * @description Sign a teal program
	 * @param logic Teal program
	 * @param address Signer Address
	 * @param options Operation options
	 * @returns Returns signed teal program
	 */
	signLogicSig(logic: Uint8Array | Base64, address: Address, options?: Options): Promise<Uint8Array>
}
