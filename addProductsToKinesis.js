const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const kinesis = new AWS.Kinesis()

module.exports = async event => {
    
   for(const record of event.Records) {
        
        const {
            bucket,
            object
        } = record.s3
        
        const csv = await s3.getObject({
            Bucket: bucket.name,
            Key: object.key
        }).promise()
        
                
        const [
            brand,
            name,
            categoryId,
            price,
            quantity
        ] = csv.split('|')
        
        const product = {
            brand,
            name,
            categoryId,
            price,
            quantity
        } 
        
        await kinesis.putRecord({
            Data: JSON.stringify({
                key: object.key,
                product
            }),
            PartitionKey: 0,
            StreamName: process.env.STREAM_NAME
        })
    }
}
