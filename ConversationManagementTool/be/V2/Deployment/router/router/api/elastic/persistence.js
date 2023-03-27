var client     =     require('./connection')
var LOG        =     require('../../log/logger')



function saveToEDB(data, created_by, session_id, cb){
	var index = "thor_vega_prod";
	//var index = session_id.split("_")[0]
	LOG.info(index);
	//index = "thor_"+index.toLowerCase();
  	client.cluster.health({},function(err,resp,status)
  {  
  	console.log("-- Client Health --",resp.status);
	if(resp.status != 'red'){
           data['session_id'] = session_id
	   data['created_by'] = created_by
	   data['user'] = session_id.split("_")[1]
	   client.index({
		   index : index,
		   type  : 'conversation',
		   body  : data
	   },(err, resp, status)=>{
		   if(err){
		    //   LOG.error(err)
		   }
	   });
	}
	cb(null,resp)
      }); 
}


module.exports.saveToEDB    = saveToEDB;

