const NSCDistributionContract = artifacts.require("./NSCDistributionContract.sol");

contract('NSCDistributionContract general functionality', async (accounts) => {

    let NSC;
    let ownerAddress = accounts[0];
    let initialDistribution = 500000000;
    let recipientOneAddress = accounts[1];
    let numberOfTransferTokensToRecipientOne = 700000;
    let numberOfTransferTokensToRecipientTwo = 300000;
    let recipientTwoAddress = accounts[2];
    let newOwnerAddress;

    beforeEach('setup contract for each test', async function () {
        NSC = await NSCDistributionContract.deployed()
    });

    it('Has an owner', async function () {
        assert.equal(await NSC.owner(), ownerAddress)
    });

    it(`Should put ${initialDistribution} NSC tokens in the owner account`, async () => {
        let balance = await NSC.balanceOf.call(ownerAddress);
        assert.equal(balance.valueOf(), getValidTokenNumbers(initialDistribution));
    });

    it(`Sending ${numberOfTransferTokensToRecipientOne} tokens to ${recipientOneAddress} and verify the recipient balance`, async function () {
        await NSC.sendTokens(recipientOneAddress, getValidTokenNumbers(numberOfTransferTokensToRecipientOne));
        let balanceRecepientOne = await NSC.balanceOf.call(recipientOneAddress);

        assert.equal(balanceRecepientOne.valueOf(), getValidTokenNumbers(numberOfTransferTokensToRecipientOne))
    });

    it(`Sending ${numberOfTransferTokensToRecipientTwo} tokens to ${recipientTwoAddress} and verify the recipient balance`, async function () {
        await NSC.sendTokens(recipientTwoAddress, getValidTokenNumbers(numberOfTransferTokensToRecipientTwo));
        let balanceRecepientOne = await NSC.balanceOf.call(recipientTwoAddress);

        assert.equal(balanceRecepientOne.valueOf(), getValidTokenNumbers(numberOfTransferTokensToRecipientTwo))
    });

    it(`Checking the owner balance after two transactions, should be ${getOwnerBalanceAfterTwoTransaction(initialDistribution, numberOfTransferTokensToRecipientOne, numberOfTransferTokensToRecipientTwo)}`, async function () {
        let balanceRecepientOne = await NSC.balanceOf.call(ownerAddress);

        assert.equal(balanceRecepientOne.valueOf(), getValidTokenNumbers(getOwnerBalanceAfterTwoTransaction(initialDistribution, numberOfTransferTokensToRecipientOne, numberOfTransferTokensToRecipientTwo)))
    });

    it(`Transfer ownership from ${ownerAddress} to ${recipientOneAddress}`, async function () {
        await NSC.transferOwnership(recipientOneAddress);
        let newOwnerAddress = await NSC.newOwner();

        assert.equal(newOwnerAddress, recipientOneAddress)
    });

    it(`Approve the new owner`, async function () {
        await NSC.acceptOwnership();
        newOwnerAddress = await NSC.owner();

        assert.equal(newOwnerAddress, recipientOneAddress);
    });

    it(`Trying to call the Ownable function from the old address. Should get the error.`, async function () {
        let isPossibleToRunTheOwnableFunction = true;
        try {
            await NSC.sendTokens(recipientTwoAddress, getValidTokenNumbers(numberOfTransferTokensToRecipientTwo));
        } catch (error) {
            isPossibleToRunTheOwnableFunction = false;
        }

        assert.equal(isPossibleToRunTheOwnableFunction, false, "We have been able to send the tokens from the old owner address");

    });

});


function getValidTokenNumbers(tokenNumbers) {
    return tokenNumbers * 1000000000000000000;
}

function getOwnerBalanceAfterTwoTransaction(initialDistribution, numberOfTransferTokensToRecipientOne, numberOfTransferTokensToRecipientTwo) {
    return initialDistribution - numberOfTransferTokensToRecipientOne - numberOfTransferTokensToRecipientTwo;
}