const dbUtils = require("../lib/db-utils");
const joi = require("joi");
const { OFFERED, DISBURSED } = require("../lib/constants");
const loanModel = require("../lib/models/loan.model").loanModel;

const [err, loanInstance] = dbUtils.collectionDefiner("Loan", loanModel);
if (err) {
    throw "Loan collection could not be defined";
}

async function validateOrganization(organizationId) {

    const https = require('https');
    const { API_KEY } = require('../lib/.credentials.js')
    return await new Promise((resolve, reject) => {
        https
        .get(`https://api.overheid.io/openkvk/${organizationId}?ovio-api-key=${API_KEY}`, (resp) => {
            let data = '';
            resp.on('data', (chunk) => data += chunk);
            resp.on('end', () => {
                if(resp.statusCode >=200 && resp.statusCode < 400){
                    resolve([null, JSON.parse(data)]);
                }
                resolve([JSON.parse(data),null]);
            });
        })
        .on("error", (err) => resolve([err, null]));
    });
}

async function create(event) {
    try {
        const { amount, organizationId } = event.pathParameters;
        const inputSchema = joi.object({
            amount: joi.number(),
            organizationId: joi.string()
        }
        );
        const { error, value } = inputSchema.validate({amount,organizationId});
        if (error) {
            return {
                statusCode: 400,
                message: "Input is either not passed or not a valid ",
                body: JSON.stringify(error)
            };
        }
      

        const [orgValidationErr, validatedOrg] = await validateOrganization(organizationId);
        if (orgValidationErr) {
            orgValidationErr.message = "Error whlie validating  organisation";
            return {
                statusCode: 500,
                body: JSON.stringify(orgValidationErr)
            }
        }
        if (!validatedOrg) {
            return {
                statusCode: 500,
                body: `organisation with id ${organisationId} not found `
            };

        }
        const [createTableErr] = await dbUtils.createTables();
        if (createTableErr) {
            return {
                statusCode: 500,
                message: "Error whlie creating tables",
                body: createTableErr.stack
            }
        }
        const [createRecordErr, createdRecord] = await dbUtils.createRecord(
            loanInstance,
            {
                amount,
                status: OFFERED,
                organization: validatedOrg
            }
        );
        if (createRecordErr) {
            return {
                statusCode: 500,
                message: "Error whlie creating a loan record",
                body: createTableErr.stack
            }
        }
        return {
            statusCode: 200,
            message: "Loan record successsfully created!",
            body: createdRecord
        }

    } catch (err) {
        return {
            statusCode: 500,
            message: "Error in application",
            body: err
        }
    }
}

async function remove(event) {
    try {
        const { id } = event.pathParameters;
        const { error, value } = joi.string().validate(id);
        if (error) {
            return {
                statusCode: 400,
                message: "id is either not passed or not a valid id",
                body: error
            }
        }

        const [deleteRecordErr, deletedRecord] = await dbUtils.deleteRecord(loanInstance, id);
        if (deleteRecordErr) {
            return {
                statusCode: 500,
                message: "Error whlie deleting a loan record",
                body: deleteRecordErr.stack
            }
        }
        return {
            statusCode: 200,
            message: "Loan record successsfully deleted!",
            body: deletedRecord
        }

    } catch (err) {
        return {
            statusCode: 500,
            message: "Error in application",
            body: err.stack

        }

    }


}

async function getAll(event) {
    try {
        const [allRecordErr, allRecords] = await dbUtils.getAllRecords(loanInstance);
        if (allRecordErr) {
            return {
                statusCode: 500,
                message: "Error whlie fetching loan records",
                body: allRecordErr.stack
            }
        }
        return {
            statusCode: 200,
            message: " All Loan record successsfully fetched!",
            body: JSON.stringify(allRecords)
        }

    } catch (err) {
        return {
            statusCode: 500,
            message: "Error in application",
            body: err.stack

        }
    }
}

async function disburse(event) {
    try{
        const { id } = event.pathParameters;
        const { error, value } = joi.string().validate(id);
        if (error) {
            return {
                statusCode: 400,
                message: "id is either not passed or not a valid id",
                body: error
            }
        }
        const [loanFetchErr, loan ] = await dbUtils.getRecordById(loanInstance, id);
        if(loanFetchErr){
            loanFetchErr.message = `loan with id ${id} is not valid`;
            return {
                statusCode: 404,
                body: loanFetchErr
            }
        }

     const EventBridge = require('aws-sdk').EventBridge;
     const eventBridge = new EventBridge({
        endpoint: 'http://127.0.0.1:4010',
        accessKeyId: "YOURKEY",
        secretAccessKey: "YOURSECRET",
        region: "eu-west-1"
      });

      await eventBridge.putEvents({
          Entries : [{
              Source : "loan-disburse-triggered",
              DetailType : "loan-disbursed",
              Detail: JSON.stringify({loanId: id})

          }]
      }).promise();

    }catch(error){
        return {
            statusCode: 500,
            message: "Error in application",
            body: error

        }
    }
}

async function disrbuseConfirm(event) {
    const { loanId } = event.detail;
    const { error, value } = joi.string().validate(loanId);
    if (error) {
        return {
            statusCode: 400,
            message: "id is either not passed or not a valid id",
            body: error
        }
    }
    const [loadUpdateErr, loan ] = await dbUtils.updateRecordById(loanInstance, loanId, { status: DISBURSED });
    if(loadUpdateErr){
        loadUpdateErr.message = `loan with id ${loanId} could not be disbursed`;
        return {
            statusCode: 500,
            body: loadUpdateErr
        }
    }
    return {
        statusCode: 200,
        body: loan
    }

}

module.exports = {
    create,
    remove,
    getAll,
    disburse,
    disrbuseConfirm
};


