export interface IMint {
    telegram_id: number;
    contractAddress: string;
    price: number;
    amount: number;
    mintdate: Date;
    minted: boolean; // ???
}