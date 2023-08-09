import {Blockchain, SandboxContract} from '@ton-community/sandbox';
import {Cell, toNano} from 'ton-core';
import {Task2} from '../wrappers/Task2';
import '@ton-community/test-utils';
import {compile} from '@ton-community/blueprint';

describe('Task2', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task2');
    });

    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task2 = blockchain.openContract(Task2.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task2.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task2.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task2 are ready to use
    });

    it('2x3:3x2', async () => {
        const a = [[1, 2, 3], [4, 5, 6]];
        const b = [[7, 8], [9, 10], [11, 12]];

        const result = await task2.getMatrixMultiplier(a, b);
        expect(result).toBe(true);
    });

    it('4x4:4x4', async () => {
        const a = [[1, 2, 3, 4], [4, 5, 6, 7]];
        const b = [[7, 8, 9, 10], [9, 10, 11, 12]];

        const result = await task2.getMatrixMultiplier(a, b);
        expect(result).toBe(true);
    });

    it('5x5:5x5', async () => {
        const a = task2.generateDummyMatrix(5, 5);
        const b = task2.generateDummyMatrix(5, 5);
        console.log(a);
        console.log(b);

        const result = await task2.getMatrixMultiplier(a, b);
        expect(result).toBe(true);
    });

    it('10x10:10x10', async () => {
        const a = task2.generateDummyMatrix(10, 10);
        const b = task2.generateDummyMatrix(10, 10);
        console.log(a);
        console.log(b);

        const result = await task2.getMatrixMultiplier(a, b);
        expect(result).toBe(true);
    });

    it('should pass', async () => {
        for (let i = 1; i < 30; i++) {
            console.log('test for', i);
            const a = task2.generateDummyMatrix(i, i);
            const b = task2.generateDummyMatrix(i, i);
            // console.log(a);
            // console.log(b);

            const result = await task2.getMatrixMultiplier(a, b);
            expect(result).toBe(true);
        }
    });
});