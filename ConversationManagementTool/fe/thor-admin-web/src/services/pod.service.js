import { APIS, APP, LANG } from "./../constants";
import { authHeader } from "../helpers/authHeader";
import Axios from "axios";
import { json } from "d3";

export const PodService = {
restartService
};

function restartService(data) {
     var domainName = data[0]
     var dataset = data[1]
     var svcName = data[2]
     var deploymentName = data[3]
     var env = data[4]
     var type = data[5]
     var port = 80
     var targetPort = 4000
     var serviceType = "ClusterIP"
     var modelName = ""
//   var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json"},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"domainName": domainName, "dataset": dataset, "svcName":svcName, "deploymentName":deploymentName, "port":port,
    "targetPort" : targetPort, "serviceType":serviceType, "modelName":modelName, "env" : env, "type": type}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.PODS.RESTART,
      requestOptions
  ).then(handleResponse);
}
function handleResponse(response) {
 
  if(response.status === 200)
  {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        const error = LANG.APIERROR || (data && data.message) || response.statusText;
        return Promise.reject(new Error(error));
      }
      return data;
    });
  }
  else if(response.status === 403)
  {
    const data = response.message
    return data
  }
  else {
    const data = 'Error in the api call';
    return data;
  }
  
}