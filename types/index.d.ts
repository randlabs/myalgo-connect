import { AlgorandTxn, Address } from "./transaction";

type TxHash = string;

interface SignedTx {
	// Transaction hash
	txID: TxHash;
	// Signed transaction
	blob: Uint8Array;
}

declare abstract class MyAlgo {
	abstract connect(): Promise<Address[]> | Promise<StoredAccount[]>;
	abstract signTransaction(transaction: AlgorandTxn | AlgorandTxn[], timeout?: number): Promise<SignedTx | SignedTx[]>;
}

export class MyAlgoWallet extends MyAlgo {

	/**
	 * @param frameUrl Override wallet.myalgo.com default frame url.
	 */
	constructor(frameUrl?: string);

	/**
	 * @async
	 * @description Receives user's accounts from MyAlgo.
	 * @param timeout Number of msec to wait the popup response, default value: 1600000 msec.
	 * @returns Returns an array of Algorand addresses.
	 */
	connect(timeout?: number): Promise<Address[]>;

	/**
	 * @async
	 * @description Sign an Algorand Transaction.
	 * @param transaction Expect a valid Algorand transaction or transaction array.
	 * @param timeout Number of msec to wait the popup response, default value: 1600000 msec.
	 * @returns Returns signed transaction or an array of signed transactions.
	 */
	signTransaction(transaction: AlgorandTxn | AlgorandTxn[], timeout?: number): Promise<SignedTx | SignedTx[]>;
}

type EventNames = "ACCOUNTS_UPDATE" | "SETTINGS_UPDATE" | "ON_LOCK_WALLET";
type onUpdate = (update: any) => void|Promise<void>;

interface StoredAccount {
	address: Address;
	id: string;
	name: string;
	type: string;
}

export class MyAlgoWalletWithIframe extends MyAlgo {
	constructor(frameUrl?: string);
	connect(timeout?: number): Promise<StoredAccount[]>;
	signTransaction(transaction: AlgorandTxn | AlgorandTxn[], timeout?: number): Promise<SignedTx | SignedTx[]>;
	onLoad(): Promise<void>;
	isLocked(): Promise<boolean>;
	lock(): Promise<void>;
	on(eventName: EventNames, callback: onUpdate): void;
	off(eventName: EventNames, callback: onUpdate): void;
	getAccounts(): Promise<StoredAccount[]>;
	getSettings(): Promise<any>;
}
