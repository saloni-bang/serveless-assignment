const dynamo = require("dynamodb");
dynamo.AWS.config.update({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
});

function collectionDefiner(collectionName, collectionModel) {
    try {
        const collectionInstance = dynamo.define(collectionName, collectionModel);
        return [null, collectionInstance];
    } catch (err) {
        return [err, null];
    }
}

async function createTables() {
    try {
        await new Promise((resolve, reject) => {
            dynamo.createTables(err => (err ? reject(err) : resolve()))
        });
        return [null, null];
    } catch (err) {
        return [err, null];
    }
}

async function createRecord(collectionInstance, payLoad) {
    try {
        return await new Promise((resolve, reject) => {
            collectionInstance.create(payLoad, function (err, record) {
                if (err) {
                    reject([err, null]);
                }

                resolve([null, JSON.stringify(record)]);
            });
        });
    } catch (err) {
        return [err, null];
    }
}

async function deleteRecord(collectionInstance, id) {
    try {
        return await new Promise((resolve, reject) => {
            collectionInstance.destroy(
                id, 
                { ReturnValues: 'ALL_OLD' }, 
                function (err, record) {
                    if (err) {
                        reject([err, null]);
                    }

                    resolve([null, JSON.stringify(record)]);
                }
            );
        });
    } catch (err) {
        return [err, null];
    }
}

async function getAllRecords(collectionInstance) {
    try {
        const items = await new Promise((resolve, reject) => {
            collectionInstance.scan()
            .loadAll()
            .exec((err, records) => {
                return err ? reject(err) : resolve(records.Items)
            })
        });
        return [null, items];
    } catch (err) {
        return [err, null];
    }
}

async function getRecordById(collectionInstance, id) {
    try {
        return await new Promise((resolve, reject) => {
            collectionInstance.get(id)
            .then((record) => resolve([null,record.attrs]))
            .catch((err) => reject([err,null]))
        });
    } catch (err) {
        return [err, null];
    }
}

async function updateRecordById(collectionInstance, id, data){
    try {
        data.id = id;
        return await new Promise((resolve, reject) => {
            collectionInstance.update(data)
            .then((record) => resolve([null,record.attrs]))
            .catch((err) => reject([err,null]))
        });
    } catch (err) {
        return [err, null];
    }

}

module.exports = {
    dynamo,
    collectionDefiner,
    createTables,
    createRecord,
    deleteRecord,
    getAllRecords,
    getRecordById,
    updateRecordById
}