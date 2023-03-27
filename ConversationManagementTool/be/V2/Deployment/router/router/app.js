// var cronJob                 = require("./crons/cronJobs");   
var http                    = require('http');
var express                 = require('express');
var helmet                  = require('helmet')
var bodyParser              = require('body-parser');
var methodOverride          = require('method-override');
var RasaCoreController      = require('./controllers/rasaCoreController')
var UUIDV4                  = require('uuid')
var APP_CONFIG              = require('./config/config')
var LOG                     = require('./log/logger')
var ElasticController       = require('./controllers/elasticController')
var APICallController       = require('./controllers/APICallController')
var fs                      = require('fs');
var domains                 = require('./config/domain')
   

process.on('SIGINT',function(){
  LOG.info("stopping the application")
  process.exit(0);    
});

startApp()

function startApp() {
  var app = express();
  app.use(helmet())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(methodOverride());

  app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'userid, application-id, appid, secret-id, token, Content-Type, Authorization, *');
  
      if ('OPTIONS' === req.method) {
          res.sendStatus(200);
      }
      else {
          next();
      };
  });
  
  var router  = express.Router();

  var server  = http.createServer(app);
  // const server = require("http").Server(app)
  const io    = require('socket.io')(server);
  // const io = require("socket.io")({
  //   wsEngine: "eiows",
  //   allowEIO3: true,
  //   path: "/socket.io/",
  //   cors: {
  //     origin: "*",
  //   },
  // });


  const clientNamespace = io.of(/^\/\w+$/);

  // app.get('/getDomains',(req, res)=>{
  //     var propertyList = []
  //     var url = '';
  //     Object.keys(domains).forEach(key=>{
  //       propertyList.push(domains[key])

  //     })

  //     response = {'code' : 200, 'message' : 'success', 'payload' : propertyList}
  //     res.setHeader('Content-Type','application/json')
  //     res.write(JSON.stringify(response))
  //     res.end()
  // })
//   app.post('/trainBot', (req, res) => {

//     body = req.body.data
//     url = ''
//     console.log(domains.domains["RASA_CORE_ENDPOINT_" + req.body.domain])
//     if(domains.domains["RASA_CORE_ENDPOINT_" + req.body.domain]){
//       url = domains.domains["RASA_CORE_ENDPOINT_" + req.body.domain]
//       url = url.replace('/webhooks/rest/webhook','/model/train')
//     }else{
//       throw new Error('domain not found')
//     }

//     var request = require('request');	
//          var options = {
//       'method': 'POST',
//       'url': url,
//       'headers': {
//         'Content-Type': 'application/json'
//       },
//       body: req.body.data
// };
// 	request(options, function (error, response) {
//       if (error) {
//         throw new Error(error)
//       }
//       res.setHeader('Content-Type', 'application/json')
//       res.write(JSON.stringify(response))
//       res.end()
//     });
//   })


// app.post('/registerDomain',(req, res)=>{
//     if(domains[`RASA_CORE_ENDPOINT_' + ${req.body.domainName}`]){
//       response = {'code' : 200, 'message' : 'success', 'payload' : "domain already registered"}
//       res.setHeader('Content-Type','application/json')
//       res.write(JSON.stringify(response))
//       res.end()
//       return
//     }
//     else{
//       var property = '\ndomains.RASA_CORE_ENDPOINT_' + req.body.domainName + '= ' + `'http://localhost:${req.body.domainPort}/webhooks/rest/webhook'`
//     fs.appendFile('./config/domain.js',property,(err, fs_data)=>{
//       if(err){
//         console.log(err)
//       }
//       else{
//         console.log(APP_CONFIG['RASA_CORE_ENDPOINT'])
//         response = {'code' : 200, 'message' : 'success', 'payload' : "registered bot endpoint successfully"}
//         res.setHeader('Content-Type','application/json')
//         res.write(JSON.stringify(response))
//         res.end()
//       }
//     })
//     }
    
//  })

//   app.post('/test',(request, response)=>{
//    data = {'message' : 'hi' , 'endpoint' : request.body.domain }
//    RasaCoreController.processUserData(data, 'test_session', (err, res) => {
//      if (err) {
//        response.send({'domain' : request.body.domain, 'up' : false})
//        response.end()
//      } else {
//        let responses = res.res;
//        for(var i=0; i<responses.length;i++){
//          response.send({'domain' : request.body.domain, 'up' : true})
//          response.end()
//        }
//      }
//    })
//  })

// Router config changes

   app.post('/addApi',(req, res)=>{
    const fs = require('fs')
    fs.readFile("config/config.js", function (err, data) {
      if (err) throw err;
      if(data.includes('config.VEGA_ENDPOINT_'+ req.body.intent.toUpperCase() + " = '"+req.body.endpoint+"'")){
      console.log("config.VEGA_ENDPOINT_"+ req.body.intent.toUpperCase())
       response = {'code' : 204, 'message' : 'success', 'payload' : "intent-api mapping already present"}
          res.setHeader('Content-Type','application/json')
          res.write(JSON.stringify(response))
          res.end()
      }
      else if(data.includes(req.body.endpoint))
      {
      var key = Object.keys(APP_CONFIG).find(key => APP_CONFIG[key] === req.body.endpoint);
       response = {'code' : 204, 'message' : 'success', 'payload' : "Endpoint present", 'key':"config."+key}
          res.setHeader('Content-Type','application/json')
          res.write(JSON.stringify(response))
          res.end()
      }
      else if (data.includes('config.VEGA_ENDPOINT_'+ req.body.intent.toUpperCase()))
      {
        var ep = "VEGA_ENDPOINT_"+req.body.intent.toUpperCase();
        var line = "config.VEGA_ENDPOINT_"+ req.body.intent.toUpperCase()+ " = '"+APP_CONFIG[ep]+"'"
        fs.readFile("config/config.js", 'utf8', function (err,data) {
        var formatted = data.replace(line, '\nconfig.VEGA_ENDPOINT_'+ req.body.intent.toUpperCase() + " = '"+req.body.endpoint+"'");
        fs.writeFile("config/config.js", formatted, 'utf8', function (err) {
          if(err){
            console.log(err)
          }
          else{
            response = {'code' : 200, 'message' : 'success', 'payload' : "Endpoint updated"}
            res.setHeader('Content-Type','application/json')
            res.write(JSON.stringify(response))
            res.end()
          }
         });
        });
      }
      else{
        var property = '\nconfig.VEGA_ENDPOINT_'+ req.body.intent.toUpperCase() + " = '"+req.body.endpoint+"'";
      fs.appendFile('./config/config.js',property,(err, fs_data)=>{
        if(err){
          console.log(err)
        }
        else{
          response = {'code' : 200, 'message' : 'success', 'payload' : "Endpoint added"}
          res.setHeader('Content-Type','application/json')
          res.write(JSON.stringify(response))
          res.end()
        }
      })
      }
    });
  });

     app.post('/addCaseIntent', (req, res) => {
       const fs = require('fs')
       var lines = [];
       var text =[];
       var intent = req.body.intent;
       intent = 'get'+intent;
       var number = 0;
       lines = fs.readFileSync('api/vega/vegaData.js').toString().split('\n');
       if(lines.includes("case '"+req.body.intent+"':"))
       {
        response = {'code' : 200, 'message' : 'success', 'payload' : "Intent case already present"}
        res.setHeader('Content-Type','application/json')
        res.write(JSON.stringify(response))
        res.end()
       }
       else
       {
        lines.splice(0, 0, "var "+req.body.intent+" = require('../vega/"+intent+"');");
        text = lines.join("\n");
        number = lines.indexOf("function getApiEndpoint(res) {");
        if(req.body.key !=='')
        {
          lines.splice(number+3, 0, "    case '"+req.body.intent+"':");
          lines.splice(number+4, 0, "      url = "+req.body.key);
          lines.splice(number+5, 0, "      method  = '"+intent+"'");
          lines.splice(number+6, 0, "      break;");
          text = lines.join("\n");
        }
        else
        {
          lines.splice(number+3, 0, "    case '"+req.body.intent+"':");
          lines.splice(number+4, 0, "      url = config.VEGA_ENDPOINT_"+ req.body.intent.toUpperCase());
          lines.splice(number+5, 0, "      method  = '"+intent+"'");  
          lines.splice(number+6, 0, "      break;");
          text = lines.join("\n");
        }
        fs.writeFile('api/vega/vegaData.js', text, function (err, data) {
          if (err) {
           // throw err;
           res.send(err)
         }
         else
         {
           response = {'code' : 200, 'message' : 'success', 'payload' : "added intent case successfully"}
           res.setHeader('Content-Type','application/json')
           res.write(JSON.stringify(response))
           res.end()
         }
       });
       }

 });
 app.post('/commitFile',(req, res)=> {
  const fs = require('fs');
  let intent = req.body.intent;
  intent = "get"+intent+".js";
  fs.copyFile("api.js", "api/vega/"+intent, (err) => {
    if (err) {
      response = {'code' : 500, 'message' : 'failure','payload':'could not commit the file'}
      res.setHeader('Content-Type','application/json')
      res.write(JSON.stringify(response))
      res.end()
     }
    else
    {

      response = {'code' : 200, 'message' : 'success'}
      res.setHeader('Content-Type','application/json')
      res.write(JSON.stringify(response))
      res.end()
    }
  });
})

    clientNamespace.on('connection', client => {
    LOG.info(`client with connection id: ${client.id} connected`)
    //client['session_id']  = UUIDV4()
    client['session_id']  = client.id
    LOG.info(`session id for this session is ${client['session_id']}`)
    client.on('disconnect', () => {
      LOG.info(`client with connection id: ${client.id} disconnected`)
      if (client.sessionInfo) {
        LOG.info(`closing sessior clientId ${client.id} with AACC credentails ${JSON.stringify(client.sessionInfo)}`)
      }
      
    });
  
    client.on('session_request', (data) => {
      //client['session_id']  = UUIDV4()
      data['session_id']    = client['session_id']
      client.emit("session_confirm", data['session_id'], (data) => {
        LOG.info(`client with connection id: ${client.id} is confirmed`)
      })
    });

    /**
     * Receiving and processing the data in respective controller.
     * The channel 'user_uttered' passes message to RASA CORE
     */
    var message='';
    client.on('user_uttered', (data) => {
      var id = data.endpoint+"_"+data.mail
      var message = data.message
      if(data.mail)
      {
	      client['session_id'] = id
      }
      LOG.info(data.mail)
      LOG.info(`client session: ${client.session_id}`)
      ElasticController.sendToElastic(data, 'user_uttered', client.session_id, (err,res)=>{
        if(err){
          LOG.error(err)
        }
      });
      RasaCoreController.processUserData(data, client['session_id'], client.id, (err, res) => {
        if (err) {
          RasaCoreController.sendCustomTextToUser(client, 500, () => {})
        } else {
          let responses = res.res;
          for(var i=0; i<responses.length;i++){
            RasaCoreController.sendDataToUser(message, client, responses[i], (err,res) => {
              if(err){
                LOG.error(err)
              }
            })
          }
        }
      })
    })
    
    client.on('api_call', (data) => {
      LOG.info(`client session: ${client.session_id}`)
      data["message"] = message
      ElasticController.sendToElastic(data, 'api_call', client.session_id, (err,res)=>{
        if(err){
          LOG.error(err)
        }
      });
      APICallController.callAPI(client, data, client['session_id'], (err, res) => {
        if (err) {
          RasaCoreController.sendCustomTextToUser(client, 500, () => {})
        } else {
          let responses = res;
	  if(responses.length){
          for(var i=0; i<responses.length;i++){
            RasaCoreController.sendDataToUser(client, responses[i], (err,res) => {
              if(err){
                console.log(err)
              }
	      else{
	      }
            })
          }
	  }else{
		  RasaCoreController.sendDataToUser(client, responses, (err,res) => {
              		if(err){
                		console.log(err)
              		}
              		else{
                      		console.log('data sent')
              		}
            })
	  }
        }
      })
    })
  });
  LOG.info(APP_CONFIG)
  server.listen(APP_CONFIG.PORT, function() {
    LOG.info("starting the application at "+ APP_CONFIG.PORT)
  });
}
