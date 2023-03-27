import { APIS, APP, LANG } from "./../constants";
import { authHeader } from "../helpers/authHeader";
import Axios from "axios";
import { json } from "d3";

export const ReportService = {
    getConfInts,
    getReports,
    getConfmat,
    getHistogram,

};
function getConfInts(data) {
    var bot=data[0]
    var name=data[1]
    var model = data[2]
    var jwt = localStorage.getItem('jwt');
    const requestOptions = {
      headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
      method: APP.REQUEST.POST,
      body:JSON.stringify({"bot":bot,"name":name,"model":model}),
    };
      return fetch(
        window.env.REACT_APP_VEGA_API_URL + APIS.REPORTS.CONFINTS,
        requestOptions
    ).then(handleResponse);
  }
  function getReports(data) {
    var bot = data[0];
    var name = data[1];
    var model = data[2];
    var jwt = localStorage.getItem('jwt');
    const requestOptions = {
      headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
      method: APP.REQUEST.POST,
      body:JSON.stringify({"bot":bot,"name":name,"model":model}),
    };
      return fetch(
        window.env.REACT_APP_VEGA_API_URL + APIS.REPORTS.REPORTS,
        requestOptions
    ).then(handleResponse);
  }
  function getConfmat(data) {
    var bot = data[0];
    var name = data[1];
    var model = data[2];
    var jwt = localStorage.getItem('jwt');
    const requestOptions = {
      headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
      method: APP.REQUEST.POST,
      body:JSON.stringify({"bot":bot,"name":name,"model":model}),
    };
      return fetch(
        window.env.REACT_APP_VEGA_API_URL + APIS.REPORTS.CONFMAT,
        requestOptions
    ).then(handleResponse);
  }
  function getHistogram(data) {
    var bot = data[0];
    var name = data[1];
    var model = data[2];
    var jwt = localStorage.getItem('jwt');
    const requestOptions = {
      headers:{"content-type": "application/json", "Authorization": "Bearer " + jwt},
      method: APP.REQUEST.POST,
      body:JSON.stringify({"bot":bot,"name":name,"model":model}),
    };
      return fetch(
        window.env.REACT_APP_VEGA_API_URL + APIS.REPORTS.HISTOGRAM,
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
  else
  {
  
    const data = response.status
    return data
  }
  
}