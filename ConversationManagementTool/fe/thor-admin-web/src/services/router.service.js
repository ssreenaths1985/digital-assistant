import { APIS, APP, LANG } from "./../constants";
import { authHeader } from "../helpers/authHeader";
import Axios from "axios";
import { json } from "d3";

export const RouterService = {
    updateConfigs,
    addCaseIntent,

};
function updateConfigs(data) {
    var intent=data[2]
    var endpoint;
    if(data[3] === 'custom')
    {
       endpoint = data[5]
    }
    var jwt = localStorage.getItem('jwt');
    const requestOptions = {
      headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
      method: APP.REQUEST.POST,
      body:JSON.stringify({"intent":intent,"endpoint":endpoint})
    };
      return fetch(
        window.env.REACT_APP_VEGA_ROUTER_URL + APIS.ROUTER.UPDATE,
        requestOptions
    ).then(handleResponse);
  }

  function addCaseIntent(data) {
    var intent=data[2]
    var endpoint='';
    var key='';
    if(data[3] === 'custom')
    {
       endpoint = data[5]
    }
    if(data[6])
    {
        key = data[6]
    }
    var jwt = localStorage.getItem('jwt');
    const requestOptions = {
      headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
      method: APP.REQUEST.POST,
      body:JSON.stringify({"intent":intent,"endpoint":endpoint, "key":key})
    };
      return fetch(
        window.env.REACT_APP_VEGA_ROUTER_URL + APIS.ROUTER.ADD,
        requestOptions
    ).then(handleResponse);
  }
function handleResponse(response) {
  if(response.code === 200)
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
  else
  {
  
    const data = response
    return data
  }
  
}