import {Blockchain, SandboxContract} from '@ton-community/sandbox';
import {Builder, Cell, toNano} from 'ton-core';
import {Task1} from '../wrappers/Task1';
import '@ton-community/test-utils';
import {compile} from '@ton-community/blueprint';

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task1 = blockchain.openContract(Task1.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task1 are ready to use
    });

    it('level 0', async () => {
        const dataBuilder = new Builder();
        const data = dataBuilder.endCell();
        const root = new Cell();


        const hash = BigInt('0x' + root.hash().toString('hex'));

        const result = await task1.getFindBranchByHash(hash, root, data);
        expect(result).toBe(true);
    });


    it('level 1', async () => {
        const dataBuilder = new Builder();
        dataBuilder.storeUint(111, 8);
        const data = dataBuilder.endCell();
        const hash = BigInt('0x' + data.hash().toString('hex'));

        const b0 = new Builder();
        b0.storeRef(new Cell());
        b0.storeRef(data);
        const root = b0.endCell();

        const result = await task1.getFindBranchByHash(hash, root, data);
        expect(result).toBe(true);
    });

    it('level 2', async () => {
        const dataBuilder = new Builder();
        dataBuilder.storeUint(1234, 32);
        dataBuilder.storeUint(5678, 32);
        dataBuilder.storeUint(9101, 32);
        dataBuilder.storeRef(new Cell());
        dataBuilder.storeRef(new Cell());
        const data = dataBuilder.endCell();
        const hash = BigInt('0x' + data.hash().toString('hex'));

        const b1 = new Builder();
        b1.storeUint(32, 8);
        b1.storeRef(data);
        const c1 = b1.endCell();

        const b0 = new Builder();
        b0.storeRef(new Cell());
        b0.storeRef(c1);
        const root = b0.endCell();

        const result = await task1.getFindBranchByHash(hash, root, data);
        expect(result).toBe(true);
    });

    it('level 3', async () => {
        const dataBuilder = new Builder();
        dataBuilder.storeUint(1234, 32);
        dataBuilder.storeUint(5678, 32);
        dataBuilder.storeUint(9101, 32);
        dataBuilder.storeRef(new Cell());
        dataBuilder.storeRef(new Cell());
        const data = dataBuilder.endCell();
        const hash = BigInt('0x' + data.hash().toString('hex'));

        const b2 = new Builder();
        b2.storeUint(32, 8);
        b2.storeRef(data);
        const c2 = b2.endCell();

        const b1 = new Builder();
        b1.storeUint(32, 8);
        b1.storeRef(c2);
        const c1 = b1.endCell();

        const b0 = new Builder();
        b0.storeRef(new Cell());
        b0.storeRef(c1);
        const root = b0.endCell();

        const result = await task1.getFindBranchByHash(hash, root, data);
        expect(result).toBe(true);
    });
});