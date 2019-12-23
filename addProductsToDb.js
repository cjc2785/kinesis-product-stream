const axios = require('axios')

const addProduct = async product => {
    const apiUrl = process.env.API_URL
    await axios.post(`${apiUrl}/products`, product)
}

module.exports = async event => {
   
    const kinesisRecords = event.Records.map(record => {
        
        //Decode Kinesis base64 encoded record data
        const dataString = Buffer
            .from(record.kinesis.data, 'base64')
            .toString('ascii')
        
        //Convert decoded record data string to json object
        return JSON.parse(dataString)
    })
    
    for(const {product} of kinesisRecords) {
        await addProduct(product)
    }
}