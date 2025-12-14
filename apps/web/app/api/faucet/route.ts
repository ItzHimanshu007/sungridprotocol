
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PK = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();

        if (!address) {
            return NextResponse.json({ success: false, error: "Address required" }, { status: 400 });
        }

        const adminAccount = privateKeyToAccount(ADMIN_PK);
        const client = createWalletClient({
            account: adminAccount,
            chain: anvil,
            transport: http('http://127.0.0.1:8545')
        });

        const hash = await client.sendTransaction({
            to: address as `0x${string}`,
            value: parseEther('10') // 10 ETH
        });

        return NextResponse.json({ success: true, hash });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
