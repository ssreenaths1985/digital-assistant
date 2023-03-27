export const APIS = {
  DASHBOARD: {
    GETCONFIG: "dashboard/getDashboardConfig/Thor/home",
    GETCHART: "dashboard/getChartV2/Thor",
  },
  DASHBOARDTWO: {
    GETCONFIG: "dashboard/getDashboardConfig/Pulz/home",
    GETCHART: "dashboard/getChartV2/Pulz",
  },
  PROFILE: {
    GETPROFILE: "dashboard/getDashboardsForProfile/Kronos",
  },
  MULTIPLEDASHBOARD: {
    GETCONFIG: "dashboard/getDashboardConfig/Kronos/",
    GETCHART: "dashboard/getChartV2/Kronos",
  },
  LOGIN: {
    USERLOGIN: "/api/auth/signin",
    USERSIGNUP:"/api/auth/signup"
  },
  FORM: {
    GET: "forms/getAllForms",
    FIND: "forms/getFormById?id=",
    ADD: "forms/createForm",
    UPDATE: "",
    DELETE: "",
  },

  DATASETS: {
    DATASETS :"/users/data/getDatasets",
    INTENTS: "/users/data/getIntents",
    UTTERANCES: "/users/data/saveUtterances",
    TRAIN:"/users/data/train",
    EVALUATE:"/users/data/get",
    CREATE:"/users/data/createDataset",
    CREATEINT:"/users/data/createNewIntent",
    RESPONSES:"/users/data/getintentresponse",
    MODIFY: "/users/data/modifyResponse",
    DELETE:"/users/data/removeDataset",
    VERSIONS:"/users/data/getDatasetVersions",
    RESTORE:"/users/data/restoreDataset",
    REMOVEINT:"/users/data/removeIntent",
    REMOVEUTR:"/users/data/removeUtterance",
    SAVEDRAFT:"/users/data/saveDraftData",
    INCOMPLETEINTENTS:"/users/data/getIncompleteIntents",
    INTENTTYPES: "/users/data/getIntentTypes",
    REMANINGUTTERANCES: "/users/data/getRemainingUtterances",
    GETALL: "/users/data/getallutterances"
  },

  COMPILER:{
    READFILE : "/users/data/compiler/readfile",
    ADDNEWFILE: "/users/data/compiler/addnewfile",
    COMPILEPY: "/users/data/compiler/compilepy",
    RELOAD: "/users/data/compiler/reload",
    SAVEFILE: "/users/data/compiler/savefile",
    COMPILEJS: "/users/data/compiler/compilejs"
  },

  REPORTS:{
    CONFINTS :"/users/data/confmatInts",
    REPORTS:"/users/data/getReports",
    CONFMAT: "/users/data/getconfmat",
    HISTOGRAM:"/users/data/gethistogram",
  },

  CONVERSATION: {
    GET:"/users/data/convoByDate",
    ADD: "/users/data/addMultipleConvos"
  },

  MODELS: {
    GET:"/users/data/getModels",
    PUT:"/users/data/loadModel",
    PUBLISH:"/users/data/publishModel",
    EVALUATE:"/users/data/evaluate",
    DEPLOY:"/users/data/deployModel",
    GETPUBLISHED:"/users/data/getPublished"
  },

  BOT: {
    GET:"/users/data/getbots",
    DEPLOY:"/users/data/deployNewBot",
    CREATE:"/users/data/createBot",
    GETACTIVE:"/users/data/containerStatus",
    ACTIVATE:"/users/data/activateBot",
    TRAIN:"/users/data/trainBot"
  },

  ROUTER: {
    UPDATE:"/addApi",
    ADD:"/addCaseIntent"
  },

  PODS: {
    RESTART:"/replaceModel"
  }
  
};
