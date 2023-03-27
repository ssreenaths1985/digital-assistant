import { APIS, APP, LANG } from "./../constants";
import { authHeader } from "../helpers/authHeader";
import Axios from "axios";
import { json } from "d3";

export const BotService = {
 createBot,
 deployBot,
 activateBot,
 getBots,
 getActiveBots,
 train
 
};

function createBot(bot) {
  var name={name:bot}
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify(name),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.BOT.CREATE,
      requestOptions
  ).then(handleResponse);
}

function deployBot(bot) {
  var domainName = bot[0]
  var dataset = bot[1]
  var modelName = bot[2]
  var env = bot[3]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"domainName":domainName,"dataset":dataset,"modelName":modelName,"env":env})
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.BOT.DEPLOY,
      requestOptions
  ).then(handleResponse);
}

function train(bot) {
  var domain = bot[0]
  var dataset = bot[1]
  var env = bot[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"domain":domain,"dataset":dataset,"env":env})
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.BOT.TRAIN,
      requestOptions
  ).then(handleResponse);
}

function activateBot(bot) {
  var domainName = bot[0]
  var dataset = bot[1]
  var modelName = bot[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"domainName":domainName,"dataset":dataset,"modelName":modelName})
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.BOT.ACTIVATE,
      requestOptions
  ).then(handleResponse);
}

function getBots() {
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.GET,
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.BOT.GET,
      requestOptions
  ).then(handleResponse);
}

function getActiveBots() {
  const requestOptions = {
    method: APP.REQUEST.GET,
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.BOT.GETACTIVE,
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