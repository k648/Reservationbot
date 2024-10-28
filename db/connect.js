const mongoose = require ('mongoose')

const twilioDB = (url) => {
   return  mongoose.connect(url,{
        //useNewurlParser: true,
        //useCreateIndex : true,
        //useFindAndModify : false,
        //useUnifiedTopology : true
    })}


module.exports = twilioDB