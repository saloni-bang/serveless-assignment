const joi = require("joi");
const dynamo = require("dynamodb");
const {OFFERED , DISBURSED } = require("../constants");
const loanModel = {
    hashKey: 'id',
    timestamps: true,
    schema: {
        id: dynamo.types.uuid(),
        amount: joi.number().required(),
        status: joi.string().valid(OFFERED, DISBURSED),
        organization : joi.object()
    }
}

module.exports ={ loanModel };
