import { APIS, APP, LANG } from "./../constants";
import { authHeader } from "../helpers/authHeader";
import Axios from "axios";
import { json } from "d3";

export const DatasetService = {
  getDataset,
  createDataset,
  createIntent,
  getIntents,
  getResponses,
  modifyResponses,
  addUtterances,
  train,
  removeDataset,
  removeIntent,
  removeUtterance,
  getDatasetVersions,
  restoreDataset,
  saveDraft,
  getIncompleteIntents,
  getIntentTypes,
  getRemainingUtterances,
  getAllUtterances,
  compilerAddnewFile,
  compilerReadFile,
  compilePY,
  reloadData,
  saveFile,
  compileJS
};

function getDataset(bot) {
  var bot={bot:bot}
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify(bot),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.DATASETS,
      requestOptions
  ).then(handleResponse);
}

function createDataset(data) {

  var bot=data[0]
  var name=data[1]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.CREATE,
      requestOptions
  ).then(handleResponse);
}


function getAllUtterances(data) {

  var bot=data[0]
  var name=data[1]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.GETALL,
      requestOptions
  ).then(handleResponse);
}
function removeDataset(data) {

  var bot=data[0]
  var name=data[1]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.DELETE,
      requestOptions
  ).then(handleResponse);
}

function restoreDataset(data) {

  var bot=data[0]
  var name=data[1]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.RESTORE,
      requestOptions
  ).then(handleResponse);
}

function removeIntent(data) {

  var bot=data[0]
  var name=data[1]
  var intent = data[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name,"intent":intent}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.REMOVEINT,
      requestOptions
  ).then(handleResponse);
}

function removeUtterance(data) {

  var bot=data[0]
  var name=data[1]
  var utterance=data[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name,"utterance":utterance}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.REMOVEUTR,
      requestOptions
  ).then(handleResponse);
}
function getIntents(data) {
  var bot=data[0]
  var name=data[1]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.INTENTS,
      requestOptions
  ).then(handleResponse);
}

function getIncompleteIntents(data) {
  var bot=data[0]
  var dataset = data[1]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"domain":bot, "dataset":dataset}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.INCOMPLETEINTENTS,
      requestOptions
  ).then(handleResponse);
}

function getIntentTypes(data) {
  var bot=data[0]
  var dataset = data[4]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"domain":bot, "dataset":dataset}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.INTENTTYPES,
      requestOptions
  ).then(handleResponse);
}

function getRemainingUtterances(data) {
  var bot = data[0]
  var dataset = data[1]
  var intent = data[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"domain":bot, "intent":intent, "dataset":dataset}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.REMANINGUTTERANCES,
      requestOptions
  ).then(handleResponse);
}

function getResponses(data) {
  var bot=data[0]
  var name=data[1]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.RESPONSES,
      requestOptions
  ).then(handleResponse);
}

function saveDraft(data) {
  var domain = data[0]
  var intent = data[1]
  var utterances = data[2]
  var type = data[3]
  var dataset = data[4]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"domain": domain, "intent":intent, "utterances":utterances, "type": type, "dataset":dataset}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.SAVEDRAFT,
      requestOptions
  ).then(handleResponse);
}

function createIntent(data) {
  var utterances=[]
  var bot=data[0]
  var name=data[1]
  var intentName=data[2]
  var type = data[3]
  utterances=data[4].split(";")
  var answer;
  if(data[5])
  {
    answer=data[5]
  }
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name,"intentName":intentName, "type": type, "utterances":utterances,"answer":answer})
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.CREATEINT,
      requestOptions
  ).then(handleResponse);
}

function addUtterances(data) {
  var list=data[0]
  var name=data[1]
  var bot=data[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"utterancesList":list,"name":name,"bot":bot})
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.UTTERANCES,
      requestOptions
  ).then(handleResponse);
}

function modifyResponses(data)
{
  var bot = data[0]
  var name = data[1]
  var modifiedResponses = data[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name,"modifiedResponses":modifiedResponses})
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.MODIFY,

      requestOptions
  ).then(handleResponse);
}

function getDatasetVersions(data) {
  var bot = data[0]
  var name = data[1]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name})
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.VERSIONS,
      requestOptions
  ).then(handleResponse);
}

function train(data) {
  var bot = data[0];
  var name = data[1];
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"bot":bot,"name":name}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.DATASETS.TRAIN,
      requestOptions
  ).then(handleResponse);
}

function compilerAddnewFile(intent) {
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"intent" : intent}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.COMPILER.ADDNEWFILE,
      requestOptions
  ).then(handleResponse);
}

function compilerReadFile(intent) {
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"intent" : intent}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.COMPILER.READFILE,
      requestOptions
  ).then(handleResponse);
}

function compilePY(file) {
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"file" : file}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.COMPILER.COMPILEPY,
      requestOptions
  ).then(handleResponse);
}

function reloadData() {
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.GET,
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.COMPILER.RELOAD,
      requestOptions
  ).then(handleResponse);
}

function saveFile(file) {
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"file" : file}),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.COMPILER.SAVEFILE,
      requestOptions
  ).then(handleResponse);
}

function compileJS() {
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.GET,
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.COMPILER.COMPILEJS,
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
    const data = response.status
    return data
  }
  else {
    const data = 'Error in api call';
    return data;
  }
  
}
