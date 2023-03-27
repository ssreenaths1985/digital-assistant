var LOG                 = require('../log/logger');
var API                 = require('../api/rasa.core/botwebhook')
// var KronosController    = require('../controllers/kronosController')
// var ConversionController= require('../controllers/conversionController')
var ElasticController   = require('../controllers/elasticController')
// var SunbirdController   = require('../controllers/sunbirdController')
// var Weather             = require('../api/weather/openWeather')
// var Distance            = require('../api/distance/distance24')
// var Time                = require('../api/time/timeZone')
// var SalesController     = require('../controllers/salesController')
//var WikiAPI             = require('../api/wiki/wikipediaOpenSearch')
var Offerings           = require('../config/offerings')
const _ = require("lodash")

/**
 * @description handle data received on 'user_uttered' channel
 * @param arg1: data, received from 'user'
 * @param arg2: clientId, client id allocated to the connected session
 * @param arg3: cb, callback function
 */
function processUserData(data, clientId, client, cb) {
        console.log(data["endpoint"])
    webHookData = {
        text     : data["message"],
        endpoint : data["endpoint"],
        jwt : data["jwt"],
        wid : data["wid"],
        uid: data["uid"],
        username: data["username"],
        mdo_id: data["mdoId"]
    }
    API.BOTWebHookAPI(webHookData, clientId, client, (err, res) => {
        if (err) {
            LOG.error(`BOTWebHookAPI failed: ${err}`)
            return cb(err, null)
        } else {
            return cb(null, res)
        }
    })
}


/**
 * @description send data to user
 * @param arg1: client, client identifier
 * @param arg2: data, data to send
 * @param arg3: cb, callback function
 */
function sendDataToUser(message, client, data, cb) {
    data["message"] = message
    let timestamp = Date.now();
    console.log(timestamp);
//     var today = new Date();
//     var dd = String(today.getDate()).padStart(2, '0');
//     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//     var yyyy = today.getFullYear();
//     today = dd + '/' + mm + '/' + yyyy;

    data['date'] = Math.floor(timestamp/1000)
    var payload = {payload:data}
//     LOG.info(`uttering to bot ${JSON.stringify(payload)}`)
    ElasticController.sendToElastic(payload, 'bot_uttered', client['session_id'], (err,res)=>{
          if(err){
        //      LOG.error(err)
          }
    });
    if(data.quick_replies && data.quick_replies[0]  && data.quick_replies[0].type && data.quick_replies[0].type=='low_confidence'){
            console.log('calling wikipedia open API from rasaController')
	    console.log(data.quick_replies[0])
	    if(data.quick_replies[0].entities.length == 0 && data.quick_replies[0].adj.length == 0){
		    	    data['text']   = 'Sorry, failed to get you. Can you rephrase your question please?'
                            data['intent'] = 'low_confidence'
                            data['type']   = 'response'
                            client.emit('bot_uttered', data, (err,res) => {
                                        if(err){
                                                sendCustomTextToUser(client, err, ()=>{})
                                                LOG.err('could not emit to client')
                                        }else{
                                                persist.saveToEDB(data, (err,res)=>{
                                                        if(err){
                                                                LOG.error(err)
                                                        }
                                                });
                                                return cb()
                                       }
                            })
		    
	    }
   // 	    }

    }

    //https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=everest
    else{
	console.log('plain utterance------------------------')
    	client.emit('bot_uttered', data, (err,res) => {
        	if(err){
			sendCustomTextToUser(client, err, ()=>{})
            		LOG.err('could not emit to client')
        	}else{
           		return cb()
        	}
    	})
    }
}

/**
 * @description send data to user
 * @param arg1: client, client identifier
 * @param arg2: cb, callback function
 */
function sendCustomTextToUser(client, text, cb) {
    data = {}
    data['text']   = 'Sorry, could not respond properly.'
    data['intent'] = 'text'
    data['type']   = 'response'

    client.emit('bot_uttered', data, () => {
        return cb()
    })
}

module.exports.processUserData              = processUserData;
module.exports.sendDataToUser               = sendDataToUser
module.exports.sendCustomTextToUser         = sendCustomTextToUser


