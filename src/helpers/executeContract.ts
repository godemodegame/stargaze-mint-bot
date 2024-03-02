import { DirectSecp256k1HdWallet, Registry } from '@cosmjs/proto-signing';
import { SigningStargateClient, coins } from '@cosmjs/stargate';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import user from '../models/user';

const rpcEndpoint = "https://rpc.stargaze-apis.com";

async function executeContract(id: number, contractAddress: string, price: number, amount: number) {
    const myRegistry = new Registry();
    myRegistry.register("/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract);

    const mnemonic = (await user.find({ telegram_id: id }))[0].seed;

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "stars" });
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { registry: myRegistry });
    const [{ address: senderAddress }] = await wallet.getAccounts();

    const msgBase64 = Buffer.from(JSON.stringify({ mint: {} })).toString('base64');

    const messages = Array.from({ length: amount }, () => ({
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
            sender: senderAddress,
            contract: contractAddress,
            msg: Buffer.from(msgBase64, 'base64'),
            funds: coins(price * 100000, "ustars"), 
        }),
    }));

    const result = await client.signAndBroadcast(senderAddress, messages, "auto", "");

    if (result.code !== undefined && result.code !== 0) {
        return false;
    } else {
        return true;
    }
}

export default executeContract;