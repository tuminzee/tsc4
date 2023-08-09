import {Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode} from 'ton-core';

export type Task1Config = {};

export function task1ConfigToCell(config: Task1Config): Cell {
    return beginCell().endCell();
}

export class Task1 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
    }

    static createFromAddress(address: Address) {
        return new Task1(address);
    }

    static createFromConfig(config: Task1Config, code: Cell, workchain = 0) {
        const data = task1ConfigToCell(config);
        const init = {code, data};
        return new Task1(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getFindBranchByHash(provider: ContractProvider, hash: bigint, root: Cell, expected: Cell): Promise<boolean> {
        const {stack} = await provider.get('find_branch_by_hash', [
            {type: 'int', value: hash},
            {type: 'cell', cell: root}
        ]);

        const result = stack.readCell();
        console.log({
            result,
            expected
        })
        return result.equals(expected);
    }
}
