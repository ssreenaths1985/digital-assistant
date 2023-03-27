import { APIS, APP, LANG } from "./../constants";
import { authHeader } from "../helpers/authHeader";
import Axios from "axios";
import { json } from "d3";

export const ConversationService = {
  getConvos,
  addConvos
};

function getConvos(data) {
  var domain ={domain:data}
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify(domain),
  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.CONVERSATION.GET,
      requestOptions
  ).then(handleResponse);
}


function addConvos(data) {
  var list=data[0]
  var name=data[1]
  var bot=data[2]
  var jwt = localStorage.getItem('jwt');
  const requestOptions = {
    headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
    method: APP.REQUEST.POST,
    body:JSON.stringify({"convoList":list, "name":name,"bot":bot})

  };
    return fetch(
      window.env.REACT_APP_VEGA_API_URL + APIS.CONVERSATION.ADD,
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
