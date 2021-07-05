
describe('Loan -> create', () => {
    const loan = require('./loan');
    it('create: should give error response', async(done) => {
        const params = { pathParameters: { ammount: 5007, organizationId: 'abc'} };
        const response = await loan.create(params);
        expect(response.statusCode).toBe(500);
        done();
    });

    it('create: should give valid response', async(done) => {
        const params = { pathParameters: { ammount: 5007, organizationId: 'rechtspersoon-27249276-wodorata'}};
        const response = await loan.create(params);
        expect(response.statusCode).toBe(200);
        done();
    });

    it('getAll: should give valid response', async(done) => {
        const response = await loan.getAll({});
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(5);
        done();
    });

    
});




