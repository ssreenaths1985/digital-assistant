var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: [
    'http://'+global.env.APP_VEGA_ROUTER_ES_USERNAME+':'+global.env.APP_VEGA_ROUTER_ES_PASSWORD+'@'+global.env.APP_VEGA_ROUTER_ES_HOST
  ]
});

console.log('http://'+global.env.APP_VEGA_ROUTER_ES_USERNAME+':'+global.env.APP_VEGA_ROUTER_ES_PASSWORD+'@'+global.env.APP_VEGA_ROUTER_ES_HOST)
module.exports = client;
