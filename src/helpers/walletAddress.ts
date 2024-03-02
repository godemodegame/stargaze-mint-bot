import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

const walletAddress = async (mnemonic: string) => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonic,
        {
            prefix: 'stars',
        }
    );
    return (await wallet.getAccounts())[0];
}

export default walletAddress;