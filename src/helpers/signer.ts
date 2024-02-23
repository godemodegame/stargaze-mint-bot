import { getOfflineSignerProto as getOfflineSigner } from 'cosmjs-utils';
import { chains } from 'chain-registry';

const signer = async (mnemonic: string) => {
    const chain = chains.find(({ chain_name }) => chain_name === 'stargaze');
    return await getOfflineSigner({
        mnemonic,
        chain
    });
}

export default signer;

// const mnemonic = 'unfold client turtle either pilot stock floor glow toward bullet car science';