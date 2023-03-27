import { APIS, APP, LANG } from "./../constants";
import { authHeader } from "../helpers/authHeader";
import Axios from "axios";
import { json } from "d3";

export const ModelService = {
 getModels,
 loadModel,
 publishModel,
 evaluateModel,
 deployModel,
 getPublishedModels

};
function getModels(data) {
  var bot={bot:data}
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify(bot),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.MODELS.GET,
      requestOptions
  ).then(handleResponse);
}
function loadModel(data) {
    var bot=data[0]
    var name=data[1]
    var model=data[2]
    var env = data[3]
    var jwt = localStorage.getItem('jwt');
    const requestOptions = {
      headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
      method: APP.REQUEST.POST,
      body:JSON.stringify({"bot":bot,"name":name,"model":model, "env":env})
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.MODELS.PUT,
      requestOptions
  ).then(handleResponse);
}
function publishModel(data) {
    var bot=data[0]
    var name=data[1]
    var model=data[2]
    var jwt = localStorage.getItem('jwt');
    const requestOptions = {
      headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
      method: APP.REQUEST.POST,
      body:JSON.stringify({"bot":bot,"name":name,"model":model})
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.MODELS.PUBLISH,
      requestOptions
  ).then(handleResponse);
}

function getPublishedModels(data) {
  var bot={bot:data}
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify(bot),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.MODELS.GETPUBLISHED,
      requestOptions
  ).then(handleResponse);
}
function evaluateModel(data) {
  var bot=data[0]
  var name=data[1]
  var model=data[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name,"model":model})
};
  return fetch(
    window.env.REACT_APP_VEGA_API_URL + APIS.MODELS.EVALUATE,
    requestOptions
).then(handleResponse);
}
function deployModel(data) {
  var name=data[0]
  var model=data[1]
  var env= data[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"name":name,"model":model,"env":env})
};
  return fetch(
    window.env.REACT_APP_VEGA_API_URL + APIS.MODELS.DEPLOY,
    requestOptions
).then(handleResponse);
}


function handleResponse(response) {
  if(response.status === 200){
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

  else
  {
    const data  = 'Error in the api call' ;
    return data
  }
  
}