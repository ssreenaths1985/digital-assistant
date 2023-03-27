var axios = require("axios")
const { request, text, response } = require("express")
var APP_CONFIG = require('../../config/config')
var domain = require('../../config/domain')
var LOG = require('../../log/logger')
var config = require('../../config/config');
// var VegaController = require('../../controllers/vegaController')
require('../../config');




const redis = require('redis');
const client = redis.createClient({
  host: global.env.APP_VEGA_ROUTER_REDIS_HOST,
  port: global.env.APP_VEGA_ROUTER_REDIS_PORT
});
console.log(`http://${global.env.APP_VEGA_ROUTER_REDIS_HOST}:${global.env.APP_VEGA_ROUTER_REDIS_PORT}`)
client.on('error', err => {
  console.log('Error ' + err);
});

function processResponse(res, cb) {
  if (res && res.data && res.data.length > 0) {
    let quick_replies = []
    let intent = ''
    let resp = res.data.map((item) => {
      if (item.text) {

        if (item.text.split('-----').length > 1) {
          intent = item.text.split('-----')[1]
          item.text = item.text.split('-----')[0]
        }
        if (item.buttons) {
          for (var i = 0; i < (item.buttons).length; i++) {
            item.buttons[0]['content_type'] = 'text';
          }
          quick_replies = item.buttons
        }
        return {
          "quick_replies": quick_replies,
          "intent": intent,
          "text": item.text
        }
      } else if (item.custom) {

        if (item.custom.blocks) {

          type = ''
          entities = []
          confidence = ''
          intent_ranking = []
          if (item.custom.blocks[0] && item.custom.blocks[0].intent) {
            intent = item.custom.blocks[0].intent
          }
          if (item.custom.blocks[0] && item.custom.blocks[0].confidence) {
            confidence = item.custom.blocks[0].confidence.split('confidence')[1]
          }
          if (item.custom.blocks[0] && item.custom.blocks[0].intent_ranking) {
            intent_ranking = item.custom.blocks[0].intent_ranking.split('intent_ranking')[1]
          }
          if (item.custom.blocks[0] && item.custom.blocks[0].type) {
            type = item.custom.blocks[0].type
          }
          if (item.custom.blocks[0] && item.custom.blocks[0].entities) {
            entities = item.custom.blocks[0].entities
          }
          return {
            "text": item.custom.blocks[0].text,
            "intent": intent,
            "confidence": confidence,
            "intent_ranking": intent_ranking,
            "type": type,
            "entities": entities
          }
        }
        else {

          quick_replies = item.custom
          type = ''
          entities = []
          if (item.custom[0].intent) {
            intent = item.custom[0].intent
          }
          if (item.custom[0].type) {
            type = item.custom[0].type
          }
          if (item.custom[0].entities) {
            entities = item.custom[0].entities
          }
          return {
            "text": item.custom[0].text,
            "quick_replies": quick_replies,
            "intent": intent,
            "type": type,
            "entities": entities
          }

        }
      } else {

        if (item.button) {
          quick_replies.push(item.button)
        }
        return {
          "text": '',
          "quick_replies": (item.button ? [] : []),
          "intent": intent
        }
      }
    })
    return cb(null, {
      res: resp
    })
  }
  else if (res && res[0] && res[0].custom && res[0].custom.length > 0) {

    return cb(null, {
      res: [{
        "text": res[0].custom[0].text,
        "intent": res[0].custom[0].intent,
        "type": res[0].custom[0].type,
        "entities": res[0].custom[0].entities
      }]
    })
  }
  else if (res && res.text) {

    return cb(null, {
      res: [{
        "text": res.text
      }]
    })
  }
  else if (res && res.buttons) {

    return cb(null, {
      res: [{
        "text": res.text,
        "buttons": res.buttons
      }]
    })
  }
  return cb(null, {
    res: [{
      "text": res.data.text,
      "quick_replies": [],
      "buttons": res.data.buttons
    }]
  })

}


function getBody(data, clientId) {
  user_data = {
      "wid": data.wid,
      "jwt":data.jwt,
      "uid":data.uid,
      "username":data.username,
      "mdo_id":data.mdo_id
  }
  console.log(user_data)

  return {
      "message": data.text,
      "sender":  user_data
  };
}


function getHeaders() {
  return {
    "Content-Type": "application/json"
  };
}

function getCustomHeaders(timeout) {
  return {
    timeout: timeout
  }
}


function getRasaEndpoint(type) {
  // get the domain details
  var domains = [];
  var url = '';
  if(type === "sandbox")
  {
    url = "http://vega-rasa-nlp-sandbox-service/webhooks/rest/webhook"
  }
  else if(type === "Vega")
  {
    url = "http://vega-rasa-nlp-igot-service/webhooks/rest/webhook"
    //url = "http://localhost:5005/webhooks/rest/webhook"
  }
  else
  {
    // url = "Domain not found"
    //   client.get('domainConfig', (err, reply) => {
    //     if (err) throw err;
    //     domains = reply;
    //     url = getPoint(type, domains)
    //   });
  }

  return url;
}

function getPoint(type, domain)
{
  var domains = []
  domains = domain;
  var url = '';
  var service = type+"-nlp-service";
  if(domains.includes("http://"+service+"/webhooks/rest/webhook"))
  {
    url = "http://"+service+"/webhooks/rest/webhook";
  }
  else {
    // check if the domain is present in admin console
    axios.get("http://vega-console-service/getDomains").then(res => {

      var availableDomains = res.data.payload;
      // if the domain is present in res
      if (availableDomains.includes(type)) {
        url = "http://" + type + "-nlp-service/webhooks/rest/webhook";
        domains.push(url);
        // add the domain details to redis if not present
        redisValue = JSON.stringify(domains)
        client.set('domainConfig', redisValue, (err, reply) => {
          if (err) throw err;
        });
      }
      else {
        url = "Domain not found";
      }
    })
  }
  return url;
}
/* response from api*/

function getApiResponse(res, jwt, wid, uid, dept, username, cb) {
  // VegaController.getCustomResponse(res ,jwt, wid, uid, dept, username,(err, result) => {
  //   if (err) {
  //     LOG.error(err)
  //     cb(err, null)
  //   } else {
  //     // var response = responseHandler(client.split("#")[0], result)
  //     processResponse(result, (err, resp) => {
  //       if (err) { 
  //         LOG.error('error in cal  console.log("------ endpoint")l to bot')
  //         cb(err, null)
  //       } else {
  //         cb(null, resp)
  //       }
  //     })
  //   }
  // })
}


exports.BOTWebHookAPI = function (data, clientId, client, cb) {
  console.log('-----------------------clientId----------------')
  console.log(clientId)
  console.log('-----------------------clientId----------------')
  var url = getRasaEndpoint(data.endpoint)
  if (url === 'Domain not found')
  {
  }
  else {
    axios.create(getCustomHeaders(APP_CONFIG.RASA_API_TIMEOUT))
      .post(url, getBody(data, clientId), getHeaders())
      .then(res => {
        if (res.data && res.data.length > 0) {
          if (res.data[0] && res.data[0].custom && res.data[0].custom.blocks) {

            res.data[0].custom.blocks[0].type = "direct";
            processResponse(res, (err, resp) => {
              if (err) {
                LOG.error('error in cal  console.log("------ endpoint")l to bot')
                cb(err, null)
              } else {
                cb(null, resp)
              }
            })
          }
          else if (res.data[0].text) {
            res['data'] = res.data[0];
            processResponse(res, (err, resp) => {
              if (err) {
                LOG.error('error in cal  console.log("------ endpoint")l to bot')
                cb(err, null)
              } else {
                cb(null, resp)
              }
            })

          }
          else if (res.data[0] && res.data[0].custom[0] && res.data[0].custom[0].text) {
            processResponse(res, (err, resp) => {
              if (err) {
                LOG.error('error in cal  console.log("------ endpoint")l to bot')
                cb(err, null)
              } else {
                cb(null, resp)
              }
            })

          }
          else {
            // getApiResponse(res, data.jwt, data.wid, data.uid, data.dept, data.username, cb)
          }
        }
      })
      .catch(err => {
        cb(err, null);
      });

  }


}

