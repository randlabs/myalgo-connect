const myalgo = new MyAlgo.MyAlgoWallet();
let accounts;

function createPaymentButton() {
	const newButton = document.createElement("button");
	newButton.onclick = async function() {
		const blob = await myalgo.signTransaction({
			type: "pay",
			from: accounts[0],
			to: "MKRTMBATIWUFMGAILZFQUWKVON2DCBUUC26FLY34KY3HLE4HCPYSCZA42M",
			amount: 0,
			fee: 1000,
			firstRound: 1000,
			lastRound: 2000,
			note: Buffer.from("Thanks you!", "ascii").toString("base64"),
			genesisID: "mainnet-v1.0",
			genesisHash: "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8="
		});
		console.log(blob);
	};
	newButton.append("Send me 0 algos");
	document.body.appendChild(newButton);
}

const button = document.createElement("button");
button.onclick = async function() {
	accounts = await myalgo.connect();
	if (accounts && accounts.length > 0) {
		createPaymentButton();
		button.hidden = true;
	}
};
button.append("Button1");
document.body.appendChild(button);
