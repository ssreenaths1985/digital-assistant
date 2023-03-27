// var PORTFOLIO               = require('../api/sales/domainData')
// var KRONOS_CONTROLLER       = require('../controllers/kronosController')

function callAPI(client, data, session_id, cb){
	// if(data.type){
	// 	switch(data.type){
	// 		case 'project_detail':
	// 			console.log('case project_detail')
    //                             PORTFOLIO.fetchDatabyProjID(data,(err,res)=>{
	// 				if(err){
	// 					cb(err,null)
	// 				}else{
	// 					data['response'] = JSON.parse(res.body)
	// 					data['intent']   = 'action_details'
	// 					data['type']     = 'api_call'
	// 					cb(null, data)
	// 				}
	// 			})
	// 			break;
	// 		case 'user_detail':
    //                             console.log('case user_detail')
    //                             KRONOS_CONTROLLER.getUserData(data,(err,res)=>{
    //                                     if(err){
    //                                             cb(err,null)
    //                                     }else{
    //                                             cb(null,res)
    //                                     }
    //                             })
    //                             break;
	// 		case 'user_detail_name':
    //                             console.log('case user_detail_name')
    //                             KRONOS_CONTROLLER.getUserDataByName(data,(err,res)=>{
    //                                     if(err){
    //                                             cb(err,null)
    //                                     }else{
    //                                             cb(null,res)
    //                                     }
    //                             })
    //                             break;
	// 		default:
	// 			console.log('default case  '+ data.type)
	// 	}
	// }
	// else{}
}

module.exports.callAPI      =  callAPI;
