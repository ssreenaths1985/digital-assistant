var LOG               = require('../log/logger')
var persist           = require('../api/elastic/persistence')


function sendToElastic(data, created_by, session_id, cb){
    persist.saveToEDB(data, created_by, session_id, (err, res)=>{
        if(err){
            // LOG.error(err)
            cb(err, null)
        } else{
            cb(null, res)
        }
    });
}

module.exports.sendToElastic     = sendToElastic;
