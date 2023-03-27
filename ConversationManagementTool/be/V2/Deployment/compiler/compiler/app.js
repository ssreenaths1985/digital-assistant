var http                    = require('http');
var express                 = require('express');
var helmet                  = require('helmet')
var bodyParser              = require('body-parser');
var methodOverride          = require('method-override');
var APP_CONFIG              = require('./config/config')
var vega                    = require('./controllers/vegaController')
var LOG                     = require('./log/logger')
var configs                 = require('./config/config')
process.on('SIGINT',function(){
  LOG.info("stopping the application")
  process.exit(0);    
});
startApp()
const fs = require('fs');
const { fileURLToPath } = require('url');
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
  
  var server  = http.createServer(app);
  const io    = require('socket.io')(server, {
    path: '/socket.io'
  });
// python code compiler api

  app.post('/compilePY', (req, res) => {
    const fs = require('fs');
    let file = req.body.file;
    console.log(file)
    fs.writeFile('script.py', file, (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;
      // success case, the file was saved
      console.log('file saved!');
  });
  const { exec } = require("child_process");
  exec("python script.py", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          res.send(error.message)
        
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          res.send(stderr)
      }
      else
      {
        console.log(`stdout: ${stdout}`);
        res.send(stdout)
      }
      
  });
   })


app.get('/reloadData',(req,res)=>
{
  var path = 'script.py';
  if (fs.existsSync(path)) {
    var lines = fs.readFileSync(path).toString();
    response = { 'code': 200, 'message': 'success', 'payload': lines }
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(response))
    res.end()
  }
  else {
    response = { 'code': 500, 'message': 'failure' }
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(response))
    res.end()
  }
});

app.post('/addnewFile', (req, res) =>
{
  var intent = req.body.intent;
  intent = 'get'+intent;
  var data = 'function '+intent+'(res, url, cb){\n }\n module.exports.'+intent+' = '+intent+'\n';
  fs.writeFile('api.js', data, (err) => {
   // throws an error, you could also catch it here
   if (err){
     console.log(err)
    response = {'code' : 500, 'message' : 'failure','payload':'Could not create a file'}
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
   // success case, the file was saved
   console.log('file saved!');
});
});

  app.post('/readFile', (req, res) => {
    console.log(req.body)
    var path = 'api.js';
    if (fs.existsSync(path)) {
      var lines = fs.readFileSync(path).toString();
      console.log(lines)
      response = { 'code': 200, 'message': 'success', 'payload': lines }
      res.setHeader('Content-Type', 'application/json')
      res.write(JSON.stringify(response))
      res.end()
    }
    else {
      response = { 'code': 500, 'message': 'failure' }
      res.setHeader('Content-Type', 'application/json')
      res.write(JSON.stringify(response))
      res.end()
    }
  });

// javascript code compiler api
app.post('/commitFile',(req, res)=> {
  const fs = require('fs');
  let intent = req.body.intent;
  intent = "get"+intent+".js";

  console.log("commitFile")
  fs.copyFile("api.js", "api/vega/"+intent, (err) => {
    if (err) {
      response = {'code' : 500, 'message' : 'failure','payload':'could not commit the file'}
      res.setHeader('Content-Type','application/json')
      res.write(JSON.stringify(response))
      res.end()
     }
    else
    {

      console.log("all done")
      response = {'code' : 200, 'message' : 'success'}
      res.setHeader('Content-Type','application/json')
      res.write(JSON.stringify(response))
      res.end()
    }
  });
})

app.post('/saveFile',(req, res)=> {
  const fs = require('fs');
  let file = req.body.file;
  fs.writeFile('api.js', file, (err) => {
    // throws an error, you could also catch it here
    if (err)
    {
      console.log(err)
      response = {'code' : 500, 'message' : 'failure','payload':'Could not create a file'}
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
app.get('/compileJS', (req, res) => {
const { exec } = require("child_process");
exec("node  api.js", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        res.send(error.message)
      
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        res.send(stderr)
    }
    else
    {
      console.log(`stdout: ${stdout}`);
      res.send(stdout)
    }
    
});
 })
  LOG.info(APP_CONFIG)
  server.listen(APP_CONFIG.PORT, function() {
    LOG.info("starting the application at "+ APP_CONFIG.PORT)
  });
}