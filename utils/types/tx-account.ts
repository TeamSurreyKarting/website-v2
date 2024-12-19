type TxAccount = {
	id: string;
	occurredAt: string;
	itemDescription: string;
	value: number;
	Accounts: {
		id: string;
		name: string;
	} | null
}
