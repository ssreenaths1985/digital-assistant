import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../../common/components/BrandNavBar";
import HeaderNavBar from "../../../common/components/HeaderNavBar";
import SidebarComponent from "../../common/components/SidebarComponent";
import LocalizedStrings from "react-localization";
import axios from 'axios';
import { translations } from "../../../../translations.js";
import { DatasetService } from "../../../../services/dataset.service"
import TextareaAutosize from 'react-textarea-autosize';
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import AddIcon from '@material-ui/icons/Add';
import raw from '../../../../../src/actions.py';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/javascript"
import { CallToActionSharp, CropLandscapeOutlined } from "@material-ui/icons";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { notify } from "jquery";
import { remove } from "lodash";
import { RouterService } from "../../../../services/router.service";
import { PodService } from "../../../../services/pod.service";
import { getDateMonthAndYear } from "@datepicker-react/hooks";
import actions from "../../../../actions.py";
let strings = new LocalizedStrings(translations);
var intent = '';
var lines ='';
var jslines = '';
var intentType = ''

class DataSetDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.initialState = { utr: '' }
    this.state = {
      language: "en", name: this.props.match.params.name, all: [], Intents: [], Utterances: [], utList: [], active: false, isPresent: false, showRestore: false, disabled: false,
      int: '', act: '', res: '', directutrlist: '', customutrlist: '', utr: '', modalheight: "150px", modalWidth:"600px", length: 4, selectedIntent: '', showForm: false, selectedResponse: '', direct: '', custom: '', buttonStatus: true, responses: [], showRes: false, response: '',
      actResponse: 'Custom response', datasetVersions: [], version: '',showType:true, blah:'', blah1:'', endpoint:'', fileContents:'', jsfileContents:'', incompleteIntents:{},
      JSbuttonTitle:"Open JS editor", buttonTitle:"Open editor", disableCommit:true, disableJSCommit:true, selectedIntentType:'', intentTypes:{}, modifiedResponses:{},
      utterancesList:
      {
        text: '',
        intent: '',
        entities: [
          {
            name: null,
            start: 0,
            end: 0
          }]
      }

    }
  }

  onDeleteIntent =(intent) => {
    let data = [];
    data.push(this.props.match.params.bot);
    data.push(this.props.match.params.name);
    data.push(intent);
    DatasetService.removeIntent(data).then((response) => {
      if (response && response !== 'Error in the api call') {
        if (response && response === 403) {
          Notify.error('Access Denied !');

        } else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
          Notify.success("Deleted intent successfully");
          this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/training/" + this.props.match.params.username);

        }
      }
      else {
        Notify.error('Error in the api call');
      }
    });
  }


  onDeleteUtterance = (utterance) => {
    let data = [];
    data.push(this.props.match.params.bot);
    data.push(this.props.match.params.name);
    data.push(utterance);
    DatasetService.removeUtterance(data).then((response) => {
      if (response && response !== 'Error in the api call') {
        if (response && response === 403) {
          Notify.error('Access Denied !')

        }
        else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
          Notify.success("Utterance deleted successfully");
          this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/training/" + this.props.match.params.username);
        }
      }
      else {
        Notify.error('Error in the api call');
      }
    });
  }

  handleClick = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
   if (this.state.direct === 'direct' && this.state.int.length && this.state.res && this.state.directutrlist)
   {
      this.setState({ buttonStatus: false })
    }
    else if (this.state.custom === 'custom' && this.state.int.length && this.state.customutrlist.length && this.state.disableCommit === false && this.state.endpoint.length) {
     
      this.setState({ buttonStatus: false })
     
    }
    else {
      this.setState({buttonStatus: true})
    }
  }

  directUtteranceClick = e => {
    this.setState({directutrlist : e.target.value});
    if (this.state.direct === 'direct' && this.state.int && this.state.res && this.state.directutrlist)
    {
      this.setState({ buttonStatus: false })
    }
    else if (this.state.custom === 'custom' && this.state.int && this.state.customutrlist)
    {
     
      this.setState({ buttonStatus: false })
    }
    else
    {
     
      this.setState({buttonStatus: true})
    }
  }


  customUtteranceClick  = e => {
    this.setState({customutrlist : e.target.value});
    if (this.state.direct === 'direct' && this.state.int && this.state.res && this.state.directutrlist)
   {
      this.setState({ buttonStatus: false })
    }
    else if (this.state.custom === 'custom' && this.state.int && this.state.customutrlist && this.state.disableCommit === false && this.state.endpoint.length > 0) {
      this.setState({ buttonStatus: false })
    }
    else
    {
      this.setState({buttonStatus: true})
    }
    
  }

  getIntents(dataset)
  {
    this.setState({all:[]})
    this.setState({utList : []})
    this.setState({ Intents: []});
    this.setState({ selectedIntent:'' })
    this.setState({incompleteIntents : {}})
    let data = [];
    data.push(this.props.match.params.bot)
    data.push(dataset)
    DatasetService.getIntents(data).then((response) => {
      if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        this.setState({ all: response.payload });
        this.setState({ utList: Object.values(response.payload) });
        this.setState({ Intents: Object.keys(response.payload) });
        this.setState({ selectedIntent: this.state.Intents[0] })
        DatasetService.getIncompleteIntents(data).then((response) => {
          if (response && response === 403) {
            Notify.error('Access Denied !');
          }
          else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
            this.setState({incompleteIntents : response.payload})
             let arr2 = Object.assign(this.state.all, this. state.incompleteIntents)
             this.setState({all : arr2})
            let icIntents =  Object.keys(response.payload)
            for(var i =0 ; i< icIntents.length ; i ++)
            {
                this.state.Intents.push(icIntents[i])
            }
            let icUtList = Object.values(response.payload)
            for(var i =0 ; i< icUtList.length ; i ++)
            {
                this.state.utList.push(icUtList[i])
            }
            DatasetService.getIntentTypes(data).then((response) =>
            {
              if (response && response === 403) {
                Notify.error('Access Denied !');
              }
              else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
              {
                this.setState({intentTypes : response.payload})
              }
            });
          }

   
          else {
            Notify.error("Error in api call");
          }

        });
        DatasetService.getResponses(data).then((response) => {
          if (response && response === 403) {
            Notify.error('Access Denied !');
          } else if (response && response.status && response.status.code &&
            response.status.code === APP.CODE.SUCCESS) {
            this.setState({ responses: response.payload });
            intent = this.state.selectedIntent;
            var inte = new Map();
            inte = this.state.all;
            var res = new Map();
            res = this.state.responses;
            this.setState({ Utterances: inte[intent] })
            this.setState({ length: this.state.utList[0].length })
            this.setState({actResponse : this.state.responses[this.state.selectedIntent]})
          }
        });
      }
      else {
        Notify.error(response);
      }
    });
  }

  activateDataset(dataset) {
    var data = [];
    data.push(this.props.match.params.bot)
    data.push(dataset);
    DatasetService.restoreDataset(data).then((response) => {
      if (response && response === 403) {
        Notify.error('Access Denied !');
      }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        Notify.success('Data set ' + dataset + ' activated');
        this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/training/" + this.props.match.params.username);
        intent = '';
      } else {
        Notify.error(response.payload)
      }
    });
  }
  onSave = event => {
    this.setState({ showRes: false })
    if (this.state.actResponse === this.state.response) {
      Notify.success("Response saved successfully")
      this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/" + this.state.name + "/details/" + this.props.match.params.username);
    }
    else {
      this.state.modifiedResponses[intent] = this.state.actResponse;
    }
  }

  modifyDataset = event =>
  {
    var data = [];
    data.push(this.props.match.params.bot)
    data.push(this.state.name);
    data.push(this.state.modifiedResponses);
    DatasetService.modifyResponses(data).then((response) => {
      if (response && response === 403) {
        Notify.error('Access Denied !');
      }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        Notify.success(response.payload);
        this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/training/" + this.props.match.params.username);
        intent = '';
      } else {
        Notify.error(response.payload)
      }
    });
  }
  async onFormClick() {
    if(this.state.int in this.state.incompleteIntents)
    {
      var type = this.state.intentTypes[this.state.int]
      var data = [];
      data.push(this.props.match.params.bot)
      data.push(this.state.name);
      data.push(this.state.int);
     
      data.push("direct")
      await DatasetService.getRemainingUtterances(data).then((response) => {
        if (response && response === 403) {
          Notify.error('Access Denied !');
        }
        else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
          if(type === "direct")
      {
        var totalutterances = response.payload + this.state.directutrlist;
        data.push(totalutterances);
        data.push(this.state.res);
      }
      else
      {
        var totalutterances = response.payload + this.state.customutrlist;
        data.push(totalutterances);
        data.push(this.state.endpoint)
      }
         
        } else {
          Notify.error(response.payload)
        }
      });
   
    }
    else
    {
      var data = [];
      data.push(this.props.match.params.bot)
      data.push(this.state.name);
      data.push(this.state.int);
      if(this.state.direct === "direct")
      {
        data.push(this.state.direct)
        data.push(this.state.directutrlist);
        data.push(this.state.res);
      }
      else
      {
        data.push(this.state.custom)
        data.push(this.state.customutrlist)
        data.push(this.state.endpoint)
      }

    }
    await DatasetService.createIntent(data).then((response) => {
      if (response && response === 403) {
        Notify.error('Access Denied !');
      }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {


        Notify.success(response.payload)
        this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/training/" + this.props.match.params.username);

      } else {
        Notify.error(response.payload)
      }
    });
    if(this.state.endpoint)
    {
      await RouterService.updateConfigs(data).then((response)=>{
        if (response && response === 403) {
          Notify.error('Access Denied !');
        }
        else if (response.status === APP.CODE.SUCCESS) {
          if(response.key)
          {
            data.push(response.key);
          }
          // Notify.success(response.payload);
          RouterService.addCaseIntent(data).then((response)=>{
            if (response && response === 403) {
              Notify.error('Access Denied !');
            }
            else if (response.status === APP.CODE.SUCCESS) {
              axios.post(window.env.REACT_APP_VEGA_ROUTER_URL+'/commitFile',{"intent":this.state.int}).then(response => {
                if (response.data.code === APP.CODE.SUCCESS)
                {
                  // Notify.error("Error creatimg intent : Router config error")
                }
                else {
                  Notify.error("Error creatimg intent : Router config error")
                }
              })
            } 
            
            else {
              // Notify.error(response.data.payload)
            }
      
          })
        } else {
          Notify.error(response.payload)
        }
  
      })
       // restart the router
      var data = [];
      data.push(this.props.match.params.bot);
      data.push(this.props.match.params.name);
      data.push("router-service");
      data.push("router");
      data.push("router");
      data.push("null");
      PodService.restartService(data).then(response =>{
        Notify.success("updating router service shortly")
        if(response.code === APP.SUCCESS.CODE)
        {
          Notify.success("Router Service updated successfully")
        }
      });

    }

  }

  onSaveDraft = (event) => {
    this.setState({ int: '' });
    this.setState({ customutrlist: '' });
    let data = []
    data.push(this.props.match.params.bot)
    data.push(this.state.int);
    if(this.state.direct === 'direct')
    {
      data.push(this.state.directutrlist)
      data.push(this.state.direct)
    }
    else
    {
      data.push(this.state.customutrlist)
      data.push(this.state.custom)
    }
    data.push(this.props.match.params.name)
    DatasetService.saveDraft(data).then((response) => {
      if (response && response === 403) {
        Notify.error('Access Denied !');
      }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        Notify.success(response.payload);
        DatasetService.getIncompleteIntents(data).then((response) => {
          if (response && response === 403) {
            Notify.error('Access Denied !');
          }
          else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
            this.setState({incompleteIntents : response.payload})
             let arr2 = Object.assign(this.state.all, this. state.incompleteIntents)
             this.setState({all : arr2})
            let icIntents =  Object.keys(response.payload)
            for(var i =0 ; i< icIntents.length ; i ++)
            {
                this.state.Intents.push(icIntents[i])
            }
            let icUtList = Object.values(response.payload)
            for(var i =0 ; i< icUtList.length ; i ++)
            {
                this.state.utList.push(icUtList[i])
            }
            DatasetService.getIntentTypes(data).then((response) =>
            {
              if (response && response === 403) {
                Notify.error('Access Denied !');
              }
              else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
              {
                this.setState({intentTypes : response.payload})
              }
            });
          }

   
          else {
            Notify.error("Error in api call");
          }

        });
      } else {
        Notify.success("Error in the api call")
      }
    });
  }

  onChange(newValue) {
    lines = newValue
  }

  onChange1(newValue) {
    jslines = newValue
  }

  onFormSubmit = (event) => {
    event.preventDefault();
    this.setState({
      utterancesList: {
        ...this.state.utterancesList,
        text: this.state.utr,
        intent: intent
      }
    }, () => {

      let utterancesList = [];
      if (this.state.utterancesList.text == '' || this.state.utterancesList.text == null) {
        Notify.error("Cannot add an empty utterance")
      }
      else {
        utterancesList.push(this.state.utterancesList)
        let data = [];
        data.push(utterancesList);
        data.push(this.state.name)
        data.push(this.props.match.params.bot)
        this.handleSubmit(data)
      }
    })


    this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/" + this.state.name + "/details/" + this.props.match.params.username);
    this.setState(this.initialState);
  }

  async handleSubmit(data) {
    await DatasetService.addUtterances(data).then((response) => {
      if (response && response === 403) {
        Notify.error('Access Denied !');
      }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS && response.payload === "Utterance already present.") {
        Notify.success("Utterance already present.");


      } else {
        Notify.success(response.payload)
        this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/training/" + this.props.match.params.username);
      }
    });
  }

  train = () => {
    this.props.history.push("/models/publishModel/" + this.props.match.params.bot + "/" + this.props.match.params.name + "/publish/" + this.props.match.params.username);
  }
  async componentDidMount() {
    intent = '';
    let data = [];
    data.push(this.props.match.params.bot);
    data.push(this.props.match.params.name)
    DatasetService.getDatasetVersions(data).then((response) => {
      if (response && response === 403) {
        Notify.error('Access Denied !');
      }
      else if (
        response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS
      ) {
        this.setState({ datasetVersions: Object.keys(response.payload.response) });
        this.setState({ version: this.props.match.params.name });
      } else {
        Notify.error('Error in api call');
      }
    });

    await this.getIntents(this.props.match.params.name);
  }


  getData()
  {
    axios({
      method: 'get',
      baseURL: 'https://git.idc.tarento.com/api/v4/',
      url: 'projects/754/repository/files/TrainingModels%2F'+this.props.match.params.bot+'%2F'+this.props.match.params.name+'%2Fbot%2Factions.py/raw?ref=storage',
      headers: 
      {
        'Authorization': 'Bearer '+window.env.REACT_APP_GIT_ACCESS_TOKEN
      }
    }).then(response => {
     this.setState({blah:response.data})
    })
    .catch(error => {
      Notify.error('Error in api call. Could not fetch the file');
    });
    var x = document.querySelectorAll("[class='ace_line']");
    const arr = ["ace_completion-highlight","ace_completion-meta"]
    const removeElements = (elms) => elms.forEach(el => el.remove());
    arr.map((i,j)=>{
      removeElements(document.querySelectorAll(`[class=${i}]`))
    })
    for (var i=0;i<x.length-1;i++)
    {
      lines += x[i].innerText + "\n";
    }
  }
 

  onEdit()
  {
    this.setState({int : this.state.selectedIntent})
    if(intentType === 'direct')
    {
      this.setState({modalheight:"370px"})
    }
    else
    {
      this.setState({modalheight:"540px"})
    }
  }

  createJsFile()
  {
    DatasetService.compilerAddnewFile(this.state.int).then((response) => {
    // axios.post(window.env.REACT_APP_VEGA_COMPILER_URL+"/addnewFile", {"intent": this.state.int}).then(response => {
      if (response && response === 403) {
        Notify.error('Access Denied !');
      }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS && response.payload && response.payload === "success"){
        // axios.post(window.env.REACT_APP_VEGA_COMPILER_URL+"/readFile", {"intent": this.state.int }).then(response => {
          DatasetService.compilerReadFile(this.state.int).then((response) => {
          if (response && response === 403) {
              Notify.error('Access Denied !');
          }
          else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
          {
            this.setState({blah1:response.payload})
          }
          else {
            Notify.error("Error loading the file")
          }
        })
      }
      else {
        Notify.error("Error creating file")
      }
    })
  }

  commitJSFile()
  {

    // add the updated router code to git
    //replace router pod with new image
    var intent_file = "get"+this.state.int;
    this.setState({JSbuttonTitle:"get"+this.state.int})
    axios({
      method: 'post',
      baseURL: 'https://git.idc.tarento.com/api/v4/',
      url: 'projects/754/repository/commits',
      headers: {
        'Authorization': 'Bearer '+window.env.REACT_APP_GIT_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      data:{
        "branch": "storage",
        "commit_message": "router contents updated",
        "actions": [
          {
            "action": "update",
            "file_path": "thor-assistant/ConversationManagementTool/router/api/vega/"+intent_file+".js",
            "content": this.state.jsfileContents
          }
        ]
      }
    }).then(response => {
     Notify.success('file commit successfull')
     var data = [];
     data.push(this.props.match.params.bot);
     data.push(this.props.match.params.name);
     data.push("vega-router-service");
     data.push("vega-router");
     data.push("router");
     data.push("router")
     PodService.restartService(data).then(response =>{
      Notify.success("Router service will be updated shortly")
       if(response.code === APP.SUCCESS.CODE)
       {
         Notify.success("Router service updated successfully")
       }
     });
    })
    .catch(error => {
      Notify.error('Error in api call. Commit unsuccessfull');
    });
  
    
  }

 getValue(data)
 {
 }
 async compilePY()
 {
     this.setState({fileContents:lines});
     DatasetService.compilePY(lines).then((response) => {
      if (response && response === 403) {
        Notify.error('Access Denied !');
      }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS && response.payload && response.payload.startsWith('Command failed:'))
      {
        document.getElementById('editor-console').innerHTML = response.payload;
        this.setState({disableCommit:true});
        DatasetService.reloadData().then((res) => {
          if (res && res === 403) {
            Notify.error('Access Denied !');
          }
          else if (res && res.status && res.status.code && res.status.code === APP.CODE.SUCCESS)
          {
            this.setState({blah:lines})
          }
          else
          {
            Notify.error("Error loading the file")
          }
        })
      }
        else
        {
          document.getElementById('editor-console').innerHTML = "Compilation successful";
          this.setState({disableCommit:false});
          DatasetService.reloadData().then((res) => {
            if (res && res === 403) {
              Notify.error('Access Denied !');
            }

            else if (res && res.status && res.status.code && res.status.code === APP.CODE.SUCCESS)
            {
              this.setState({blah:res.payload})
            }
            else
            {
              Notify.error("Error loading the file")
            }
          })
        }
   })
 }

 commitPYFile()
 {
   // add the updated action code to git
   //replace action service pod with new image
   this.setState({buttonTitle:"action_"+this.state.int})
   axios({
     method: 'post',
     baseURL: 'https://git.idc.tarento.com/api/v4/',
     url: 'projects/754/repository/commits',
     headers: {
       'Authorization': 'Bearer '+window.env.REACT_APP_GIT_ACCESS_TOKEN,
       'Content-Type': 'application/json'
     },
     data:{
       "branch": "storage",
       "commit_message": "actions file updated",
       "actions": [
         {
           "action": "update",
           "file_path": "thor-assistant/ConversationManagementTool/TrainingModels/"
           +this.props.match.params.bot+"/"+this.props.match.params.name+"/"+"bot/actions.py",
           "content": this.state.fileContents
         }
       ]
     }
   }).then(response => {
    Notify.success('file commit successfull');
   })
   .catch(error => {
     Notify.error('Error in api call. Commit unsuccessfull');
   });
   //api to replace the action-service
   var data = [];
   data.push(this.props.match.params.bot);
   data.push(this.props.match.params.name);
   data.push("vega-rasa-action-sandbox-service");
   data.push("vega-rasa-action-sandbox-server");
   data.push("sandbox");
   data.push("action")
   PodService.restartService(data).then(response =>{
    Notify.success("Sandbox action service will be updated shortly")
     if(response.code === APP.SUCCESS.CODE)
     {
       Notify.success("Sandbox action service updated successfully")
     }
   });
   var data1 = [];
   data1.push(this.props.match.params.bot);
   data1.push(this.props.match.params.name);
   data1.push("vega-rasa-action-igot-service");
   data1.push("vega-rasa-action-igot-server");
   data1.push("Vega");
   data1.push("action")
   PodService.restartService(data1).then(response =>{
    Notify.success("Veg action service will be updated shortly")
     if(response.code === APP.SUCCESS.CODE)
     {
       Notify.success("Vega action service updated successfully")
     }
   });
 }
 
 async compileJS()
 {
     this.setState({jsfileContents:lines});
     await DatasetService.saveFile(jslines).then((response) => {
    //  await axios.post(window.env.REACT_APP_VEGA_COMPILER_URL+"/saveFile", {"file":jslines}).then(response => {
      if (response && response === 403) {
        Notify.error('Access Denied !');
      }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS && response.payload && response.payload === "success")
      {
        DatasetService.compileJS().then((response) => {
          if (response && response === 403) {
            Notify.error('Access Denied !');
          }
          else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS && response.payload && response.payload.startsWith('Command failed:'))
          {
            document.getElementById('jseditor-console').innerHTML = response.payload;
            this.setState({disableJSCommit:true});
          }
         else
         {
          document.getElementById('jseditor-console').innerHTML = response.payload;
          document.getElementById('jseditor-console').innerHTML+="Compilation successful";
          this.setState({disableJSCommit:false});
          this.setState({buttonStatus: false})
         }
    })
      }
     else
     {
      Notify.error("could not edit file")
     }
})
// await axios.post(window.env.REACT_APP_VEGA_COMPILER_URL+"/readFile", {"file":jslines, "intent":this.state.int}).then(response => {
    DatasetService.compilerReadFile(this.state.int).then((response) => {
    if (response && response === 403) {
        Notify.error('Access Denied !');
        }
    else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
  {
    this.setState({blah1 : response.payload})
  }
 else
 {
  Notify.error("could not read the file")
 }
})
    
 }
  showForm() {
    if (this.state.type) {
      this.setState({ showForm: true })
    }
  }
  cancelModal() {
    this.setState({ buttonStatus: false });
    this.setState({ int: '' });
    this.setState({ res: '' });
    this.setState({ directutrlist: '' });
    this.setState({ customutrlist: '' });
    this.setState({showForm : false})
    this.setState({showType: true});
    this.setState({modalheight: "150px"})
    this.setState({modalWidth: "600px"})
    if(document.getElementById("response"))
    {
      document.getElementById("response").checked = false;
    }
   
  }
  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
          <BrandNavBar bot={this.props.match.params.bot} username={this.props.match.params.username} />
          <HeaderNavBar {...this.props} manageBot={this.manageBot} bot={this.props.match.params.bot} username={this.props.match.params.username} />
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-2 admin-left-section" style={{ maxHeight: "930px", maxWidth: "340px" }}>
                <SidebarComponent {...this.props} />
              </div>
              <div className="col-md-10 admin-right-section" style={{ overflow: "auto", height: "", maxHeight: "930px" }}>
                <div className="row col-md-12 mt-5 ">
                  <div className="col-md-6">
                    <div className="dropdown mr-5 mt-1 d-none d-md-flex d-lg-flex langDropdown">
                      <Link
                        to={"/conversations/data-sets/" + this.props.match.params.bot + "/training/" + this.props.match.params.username}
                        className="formAnchor white-70"
                      >
                        DATA SETS
                      </Link>{" "}
                      <i className="material-icons white-70 ml-2 mr-2">
                        arrow_forward_ios
                      </i>
                      <div className="panel-body dropdown mb-3 d-none d-md-flex d-lg-flex langDropdown" style={{ width: "250px" }}>
                        <span
                          className="mr-5"
                          href="#"
                          role="button"
                          data-toggle="dropdown"
                          id="dropdownRoleLink"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {this.state.version}
                          <i className="fa fa-caret-down pull-right ml-4 mt-1" style={{ fontSize: '15px' }} aria-hidden="true" />
                        </span>

                        <div className="dropdown-menu mr-9 cursorStyleOne smallDDMenu pull-right" aria-labelledby="dropdownRoleLink">
                          <p className="dropdown-item dateFilterTextColor" style={{ width: "300px" }} onClick={() => {
                            this.setState({ version: this.props.match.params.name })
                            this.getIntents(this.state.version)
                            this.setState({ showRestore: false })
                            this.setState({ selectedIntent: '' })
                            this.setState({ actResponse: '' })
                            this.setState({ Utterances: [] })
                            this.setState({ length: 3 })
                            intent = '';
                            this.setState({ utList: [] })


                          }}>
                            {this.props.match.params.name} <small className="ml-3" style={{ color: "grey" }}>4h ago</small> <span className="ml-5">Active</span>
                          </p>
                          {this.state.datasetVersions.map((datasets, key) => (
                            <p className="dropdown-item dateFilterTextColor" style={{ width: "280px" }} onClick={() => {
                              this.setState({ version: datasets })
                              this.getIntents(datasets)
                              this.setState({ showRestore: true })
                              this.setState({ selectedIntent: '' })
                              this.setState({ actResponse: '' })
                              this.setState({ Utterances: [] })
                              this.setState({ length: 3 })
                              intent = '';
                            }}>
                              {datasets}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">

                    <div className="pull-right">
                      {this.state.showRestore ? (<button type="button" className="btn default" onClick={() => { this.activateDataset(this.state.version) }}>
                        Make Active
                      </button>) : (null)}
                      {/* <button type="button" className="btn default">
                        Import Data
                      </button> */}
                      <button type="button" className="btn default" onClick={this.modifyDataset}>
                          Update
                      </button>
                      <button type="button" className="btn default" style={{ background: '#007bff', width: '116px' }} onClick={this.train}>
                        Train
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-4">
                    <h5>Intents</h5>
                    <button type="button" className="btn default mt-3" data-toggle="modal" data-target="#myModal" style={{ textAlign: "center" }}>
                      <AddIcon />   New Intent
                      </button>
                    <div className="form-group has-search">
                      <i className="material-icons form-control-feedback">
                        search
                      </i>
                      <div className="row col-md-10 mt-4">
                        <input
                          type="text"
                          className="form-control"
                          id="search-roles"
                          placeholder="Search for an intent"
                          autoComplete="off"
                          onKeyUp={(event) =>
                            this.props.searchIntentItems(event)
                          }
                        />
                      </div>
                    </div>
                    <div id="data">
                      <p className="white-70 mt-4">{this.state.Intents.length} Intents</p>
                      {this.state.Intents.map((intents, key) => (

                        <div className={`row col-md-9 ml-1 mt-4 intent default ${this.state.selectedIntent === intents
                          ? "active"
                          : ""
                          }`} onClick={
                            () => {
                              intent = intents;
                              var inte = new Map();
                              inte = this.state.all;
                              var res = new Map();
                              res = this.state.responses;
                              this.setState({ Utterances: inte[intent] })
                              this.setState({ selectedIntent: intents })
                              this.setState({ length: this.state.utList[key].length })
                              intentType = this.state.intentTypes[intent];
                              if(res[intent])
                              {
                                this.setState({ response: res[intent] })
                                this.setState({ actResponse: res[intent] })
                              }
                              else
                              {
                                  this.setState({ response: "Custom response"})
                                  this.setState({ actResponse: "Custom response"})
                              }
                            }
                          } key={key}>
                          {this.state.selectedIntent === intents ? (<React.Fragment>
                            {intents in this.state.incompleteIntents ? (<React.Fragment>
                              <div className="col-6">

                                <p id="td" className="title mt-2">{intents}</p>

                              </div>
                              {/* <div className="col-3">
                                <p className="white-70 mt-2" style={{ color: "red" }}> Incomplete
                              </p>
                              </div> */}
                              <div className="col-3">
                                <p className="white-70 pull-right mt-2">{this.state.utList[key].length}
                                </p>
                              </div>
                              <div class="col-3 dropdown pull-right mt-2">
                                <label
                                  className="pull-right"
                                  role="button"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <p className="pull-right" style={{ cursor: "pointer" }}><i className="fa fa-ellipsis-v pull-right"></i></p>
                                </label>
                                <div className="dropdown-menu mr-9 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink">
                                  <p className="dropdown-item dateFilterTextColor" value="Intent"
                                    onClick={() => {
                                      this.setState({ selectedIntent: intents })
                                      this.onDeleteIntent(intents)
                                    }}>
                                    Delete
                        </p>
                                  <p className="dropdown-item dateFilterTextColor" value="Intent" data-toggle="modal" data-target="#edit-details"
                                    onClick={() => { this.setState({ selectedIntent: intents}); this.onEdit()}}>Edit </p>
                                </div>
                              </div>
                            </React.Fragment>) :
                              (<React.Fragment>
                                <div className="col-6">

                                  <p id="td" className="title mt-2">{intents}</p>

                                </div>
                                <div className="col-3">
                                  <p className="white-70 pull-right mt-2">{this.state.utList[key].length}
                                  </p>
                                </div>
                                <div class="col-3 dropdown pull-right mt-2">
                                  <label
                                    className="pull-right"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    <p className="pull-right" style={{ cursor: "pointer" }}><i className="fa fa-ellipsis-v pull-right"></i></p>
                                  </label>
                                  <div className="dropdown-menu mr-9 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink">
                                    <p className="dropdown-item dateFilterTextColor" value="Intent"
                                      onClick={() => {
                                        this.setState({ selectedIntent: intents })
                                        this.onDeleteIntent(intents)
                                      }}>
                                      Delete
                                    </p>
                                  </div>
                                </div>
                              </React.Fragment>)}</React.Fragment>) : (<React.Fragment>
                                {intents in this.state.incompleteIntents ? (<React.Fragment><div className="col-6">

                                  <p id="td" className="title mt-2">{intents}</p>

                                </div>
                                  <div className="col-6">
                                  <span class="badge badge-pill badge-warning mt-2" style ={{height : "20px", width : "95px", display: "block", backgroundColor : "feff78"}}>Incomplete</span>
                                 
                                  </div></React.Fragment>) :
                                  (<React.Fragment><div className="col-6">

                                    <p id="td" className="title mt-2">{intents}</p>

                                  </div>
                                    <div className="col-6">
                                      <p className="white-70 pull-right mt-2">{this.state.utList[key] ? this.state.utList[key].length : 0}
                                      </p>
                                    </div></React.Fragment>)}</React.Fragment>)}

                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <h5>{intent}</h5>
                    <p className="white-70 mt-4">Response</p>
                    <input type="text" className="admin-table-bg col-md-12 mt-2 mr-5"
                      style={this.state.actResponse === 'Custom response' ? {
                        border: 'grey', height: '80px', backgroundColor: 'rgba(0, 0, 0, 0.4)', width: "765px"} : {
                          border: 'grey', height: '80px', cursor: 'pointer',
                          backgroundColor: 'rgba(0, 0, 0, 0.4)', width: "765px"}}
                      name="actResponse"
                      id="actResponse"
                      value={this.state.actResponse}
                      onClick={() => { this.setState({ showRes: !this.state.showRes }) }}
                      onChange={this.handleClick}
                      disabled={this.state.selectedIntent === '' ? (true) : (false)}
                      contentEditable='true'
                      autoComplete="off"
                      disabled = {this.state.actResponse === 'Custom response' ? true : false} />
                    {this.state.showRes ? (
                      <div className="col-md-12 mt-3 buttn">
                        <button type="button" className="btn default" onClick={() => { this.setState({ actResponse: this.state.response }) }}>
                          Discard Changes
                      </button>
                        <button type="button" className="btn primary butn"
                          onClick={this.onSave}>
                          Save
                      </button>
                      </div>) : (null)}
                    <form className="mt-4">
                      <div classNam="form-group">
                        <p className="white-70 mt-6">Utterances</p>
                        <div className="row" >
                          <div className="col-md-8">
                            <input
                              type="text"
                              name="utr"
                              id="utr"
                              value={this.state.utr}
                              onChange={this.handleClick}
                              className="form-control admin-table-bg no-radius"
                              placeholder="Add an utterence"
                              autoComplete="off"
                              disabled={this.state.selectedIntent === '' ? (true) : (false)}
                            />
                          </div>
                          <div className="col-md-2 associated-btn">
                            <span
                              type="submit"
                              className="btn theme no-radius associated-span"
                              onClick={this.onFormSubmit}
                            >
                              Add
                            </span>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div style={{ display: 'flex' }}>
                      <div className="row col-md-4 mt-4">
                        <div className="form-group has-search">
                          <i className="material-icons form-control-feedback">
                            search
                      </i>
                          <input
                            type="text"
                            className="form-control"
                            id="search-roles"
                            placeholder="Search for an utterance"
                            autoComplete="off"
                            onKeyUp={(event) =>
                              this.props.searchUtterenceItems(event)
                            }
                          />
                        </div>
                      </div>
                      <div className="row col mt-4 ml-6">
                      </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div className="row col-md-12 mt-2">
                        {this.state.length < 3 ? (<p style={{ color: 'red' }}>Add atleast 5 utterances to make training effective</p>) : (null)}
                        {this.state.Utterances.map((utterances, key) => (
                          <div className={`row col-md-12 utterence ${this.state.selectedUtterance === utterances
                            ? "active"
                            : ""
                            }`} onClick={
                              () => {
                                this.setState({ selectedUtterance: utterances })
                              }
                            } key={key}
                          >
                            {this.state.selectedUtterance === utterances ? (
                              <React.Fragment>
                                <div className="col-8 title">
                                  <p className="white-70 mt-3"> {utterances}</p>
                                </div>
                                <div className="col-3" style={{ cursor: "pointer" }} onClick={() => { this.onDeleteUtterance(utterances) }}>
                                  <p className="white-80 hov pull-right mt-3 subText">Delete</p>
                                </div>
                              </React.Fragment>) : (<React.Fragment>
                                <div className="col-12 default title">
                                  <p className="white-70 mt-3">
                                    {utterances}
                                  </p>
                                </div></React.Fragment>)}
                          </div>
                        ))}
                      </div>
                      <div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog" style={{ height: this.state.modalheight, width: this.state.modalWidth}}>
            <div className="modal-content modals" style={{ height: this.state.modalheight, width: this.state.modalWidth}}>
              <form onSubmit={this.onFormClick}>
                <div className="modal-body modals" style={{ height: this.state.modalheight, width: this.state.modalWidth }}>
                  <h5 className="ml-2 mt-3">Create intent</h5>
                  {this.state.showType ? (<div className="col-md-12 mt-4">
                    Type
                    <div className="row col-md-12 mt-3" style={{ height: "40px" }}>
                      <input type="radio" id="response" name="response" value="direct" onChange={() => {
                        this.setState({ disabled: false }); this.setState({direct: "direct"}); this.setState({ custom:''}); this.setState({showType : false})
                        this.setState({ modalheight: "450px" }); this.setState({modalWidth:"600px"}); this.setState({ showForm: true }) ; this.setState({buttonStatus: true})
                      }} />
                      <label for="Direct response" style={{ marginLeft: "10px" }}>Direct response</label>
                      <input type="radio" id="response" name="response" value="custom" onChange={() => {
                        this.setState({ disabled: true }); this.setState({buttonStatus: true}); this.setState({showType : false}); this.getData();
                        this.setState({ modalheight: "620px" }); this.setState({modalWidth:"600px"}); this.setState({ showForm: true }) ; this.setState({direct: ''}); this.setState({ custom:'custom'})
                      }}
                        style={{ marginLeft: "20px" }} />
                      <label for="Custom response" style={{ marginLeft: "10px" }}>Custom response</label>
                    </div>
                  </div>) : (null)}
                  {this.state.showForm ? (this.state.disabled ? (<React.Fragment>
                    <div className="col-md-12">
                      Intent
                      <div className="row col-md-12 mt-2" style={{ height: "40px" }}>
                        <input
                          type="text"
                          name="int"
                          id="int"
                          value={this.state.int}
                          onChange={this.handleClick}
                          className="form-control admin-table-bg no-radius"
                          placeholder="Add an Intent"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-12 mt-2">
                      Utterances
                    
                        <TextareaAutosize
                          className="form-control admin-table-bg no-radius"
                          style={{whiteSpace:"pre-wrap", height:"40px", marginTop:"10px", width:"96%"}}
                          placeholder="Add an utterence"
                          autoComplete="off"
                          minRows={5}
                          maxRows={7}
                          placeholder="enter the utterances with a ';' in between. Ex. who are you? ; are you a bot?"
                          onChange={ (e) => this.customUtteranceClick(e)}
                        />
                    </div>
                    <div className="col-md-12 mt-2">
                      Custom action
                      <div className="row col-md-12 mt-2">
                      <button type="button" className="btn default" data-toggle="modal" data-target="#editor" style={{ marginRight:0, width:"100%"}} disabled = {!this.state.int} onClick={()=>{lines = this.state.blah}}>{this.state.buttonTitle}</button>
                      </div>
                    </div>
                    <div className="col-md-12 mt-2">
                    Endpoint
                      <div className="row col-md-12 mt-2" style={{ height: "40px" }}>
                        <input
                          type="text"
                          name="endpoint"
                          id="endpoint"
                          value={this.state.endpoint}
                          onChange={this.handleClick}
                          className="form-control admin-table-bg no-radius"
                          placeholder="Add an api endpoint"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                      <div className="col-md-12 mt-2">
                        Response format
                      <div className="row col-md-12 mt-2">
                      <button type="button" className="btn default" data-toggle="modal" data-target="#js-editor" style={{ marginRight:0, width:"100%"}} disabled = {!this.state.endpoint} onClick = {() =>{this.createJsFile()}}>{this.state.JSbuttonTitle}</button>
                      </div>
                    </div>
                    <div className="pull-right mt-4">
                      <button type="submit" className="btn default" data-dismiss="modal" onClick={() => { this.cancelModal() }}>Cancel</button>
                      <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal"  onClick={() => { this.onSaveDraft()}} disabled = {!this.state.int}>Save draft</button>
                      <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal" onClick={() => { this.onFormClick()}} disabled={this.state.buttonStatus}>Create</button>
                    </div>
                  </React.Fragment>) : (<React.Fragment>
                    <div className="col-md-12">
                      Intent
                      <div className="row col-md-12 mt-2" style={{ height: "40px" }}>
                        <input
                          type="text"
                          name="int"
                          id="int"
                          value={this.state.int}
                          onChange={this.handleClick}
                          className="form-control admin-table-bg no-radius"
                          placeholder="Add an Intent"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-12 mt-2">
                      Utterances
                    
                        <TextareaAutosize
                          className="form-control admin-table-bg no-radius"
                          style={{whiteSpace:"pre-wrap", height:"40px", marginTop:"10px", width:"95%"}}
                          placeholder="Add an utterence"
                          autoComplete="off"
                          minRows={5}
                          maxRows={7}
                          placeholder="enter the utterances with a ';' in between. Ex. who are you?;are you a bot?"
                          onChange={ (e) => this.directUtteranceClick(e)}
                        />
                    
                    </div>
                    <div className="col-md-12 mt-2" >
                      Response
                        <div className="row col-md-12 mt-2" style={{ height: "40px" }}>
                        <input
                          type="text"
                          name="res"
                          id="res"
                          value={this.state.res}
                          onChange={this.handleClick}
                          className="form-control admin-table-bg no-radius"
                          placeholder="Add a response"
                          autoComplete="off"
                          required
                          disabled={this.state.disabled}
                        />
                      </div>
                    </div>
                    <div className="pull-right mt-4">
                      <button type="submit" className="btn default" data-dismiss="modal" onClick={() => { this.cancelModal() }}>Cancel</button>
                      <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal"  onClick={() => { this.onSaveDraft()}} disabled = {!this.state.int}>Save draft</button>
                      <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal" onClick={()=>{this.onFormClick()}} disabled={this.state.buttonStatus}>Create</button>
                    </div>
                  </React.Fragment>)) : (null)}



                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal fade" id="myDeleteIntent" role="dialog">
          <div className="modal-dialog" style={{ height: "250px", width: "600px" }}>
            <div className="modal-content modals" style={{ height: "250px", width: "600px" }}>
              <div className="modal-body modals" style={{ height: "250px", width: "600px" }}>
                <div className="col-9">
                  <p className="ml-1 mt-2 one-line">
                    <span className="title" >Delete this intent?</span> <br />
                  </p>
                  <span className="recordCount">The selected intent {this.state.selectedIntent} will be deleted and the dataset will be updated to a new version. You can revert back to this version anytime to restore the intent.</span>
                </div>
              </div>
              {/* <div className="modal-footer" style={{height:"150px", width:"600px"}}>
            <button type="button" className="btn default" data-dismiss="modal">
                       Cancel
                      </button>
                      <button type="button" className="btn default danger" data-dismiss="modal" onClick={this.onDeleteIntent(this.state.selectedIntent)}> 
                        yes, Delete
                      </button>
            </div> */}
            </div>
          </div>
        </div>
        <div className="modal fade" id= "edit-details" role="dialog">
          <div className="modal-dialog" style={{ height: this.state.modalheight, width: this.state.modalWidth}}>
            <div className="modal-content modals" style={{ height: this.state.modalheight, width: this.state.modalWidth}}>
              <form onSubmit={this.onFormClick}>
                <div className="modal-body modals" style={{ height: this.state.modalheight, width: this.state.modalWidth }}>
                  <h5 className="ml-2 mt-3"> {this.state.selectedIntent}</h5>
                  {intentType === 'custom'? (<React.Fragment>
                    <div className="col-md-12 mt-2">
                      Utterances
                    
                        <TextareaAutosize
                          className="form-control admin-table-bg no-radius"
                          style={{whiteSpace:"pre-wrap", height:"40px", marginTop:"10px", width:"96%"}}
                          autoComplete="off"
                          minRows={5}
                          maxRows={7}
                          placeholder="enter the utterances with a ';' in between. Ex. who are you? ; are you a bot?"
                          onChange={ (e) => this.customUtteranceClick(e)}
                        />
                    </div>
                    <div className="col-md-12 mt-2">
                      Custom action
                      <div className="row col-md-12 mt-2">
                      <button type="button" className="btn default" data-toggle="modal" data-target="#editor" style={{ marginRight:0, width:"100%"}} disabled = {!this.state.int}>{this.state.buttonTitle}</button>
                      </div>
                    </div>
                    <div className="col-md-12 mt-2">
                    Endpoint
                      <div className="row col-md-12 mt-2" style={{ height: "40px" }}>
                        <input
                          type="text"
                          name="endpoint"
                          id="endpoint"
                          value={this.state.endpoint}
                          onChange={this.handleClick}
                          className="form-control admin-table-bg no-radius"
                          placeholder="Add an api endpoint"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                      <div className="col-md-12 mt-2">
                        Response format
                      <div className="row col-md-12 mt-2">
                      <button type="button" className="btn default" data-toggle="modal" data-target="#js-editor" style={{ marginRight:0, width:"100%"}} disabled = {!this.state.endpoint} onClick = {() =>{this.createJsFile()}}>{this.state.JSbuttonTitle}</button>
                      </div>
                    </div>
                    <div className="pull-right mt-4">
                      <button type="submit" className="btn default" data-dismiss="modal" onClick={() => { this.cancelModal() }}>Cancel</button>
                      <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal"  onClick={() => { this.onSaveDraft()}} disabled = {!this.state.customutrlist}>Save draft</button>
                      <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal" onClick={() => { this.onFormClick() }} disabled = {true}>Create</button>
                    </div>
                  </React.Fragment>) : (<React.Fragment>
                    <div className="col-md-12 mt-2">
                      Utterances
                        <TextareaAutosize
                          className="form-control admin-table-bg no-radius"
                          style={{whiteSpace:"pre-wrap", height:"40px", marginTop:"10px", width:"95%"}}
                          autoComplete="off"
                          minRows={5}
                          maxRows={7}
                          placeholder="enter the utterances with a ';' in between. Ex. who are you?;are you a bot?"
                          onChange={ (e) => this.directUtteranceClick(e)}
                        />
                    </div>
                    <div className="col-md-12 mt-2" >
                      Response

                        <div className="row col-md-12 mt-2" style={{ height: "40px" }}>
                        <input
                          type="text"
                          name="res"
                          id="res"
                          value={this.state.res}
                          onChange={this.handleClick}
                          className="form-control admin-table-bg no-radius"
                          placeholder="Add a response"
                          autoComplete="off"
                          required
                          disabled={this.state.disabled}
                        />
                      </div>
                    </div>
                    <div className="pull-right mt-4">
                      <button type="submit" className="btn default" data-dismiss="modal" onClick={() => { this.cancelModal() }}>Cancel</button>
                      <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal"  onClick={() => { this.onSaveDraft()}} disabled = {!this.state.directutrlist}>Save draft</button>
                      <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal" onClick={ ()=>{ this.setState({int:this.state.selectedIntent}); this.onFormClick()}} disabled={!(this.state.directutrlist && this.state.res)}>Create</button>
                    </div>
                  </React.Fragment>)}



                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal fade" id="js-editor" role="dialog">
          <div className="modal-dialog" style={{ height: "700px", width: "1000px" }}>
            <div className="modal-content modals" style={{ height: "700px", width: "1000px"}}>
              <div className="modal-body modals" style={{ height: "700px", width: "1000px" }}>
                <p className="ml-4 mt-3" style={{fontSize:25}}>Editor</p>
                <div className="ml-4" style={{ display: "flex", flexDirection: "row" }}>
                  <div className="row col-md-7 mt-1" style={{ height: "550px", width: "680px" }}>
                    <AceEditor
                      style={{ height: "550px", width: "610px" }}
                      placeholder="Define the api call here"
                      mode="javascript"
                      theme="monokai"
                      name="blah1"
                      id="blah1"
                      value={this.state.blah1}
                      onChange={this.onChange1}
                      navigateToFileEnd={true}
                      onLoad={this.onLoad}
                      fontSize={14}
                      showPrintMargin={true}
                      showGutter={true}
                      scrollMargin={[0, 0, 0, 0]}
                      highlightActiveLine={true}
                      enableBasicAutocompletion={true}
                      enableLiveAutocompletion={true}
                      enableSnippets={true} />
                      <div className="pull-right mt-3">
                      <button type="button" className="btn default" style={{width:"530px"}} onClick={()=>{this.compileJS();document.getElementById('jseditor-console').innerHTML = "Console ..."}}> Run <PlayArrowIcon fontSize="small"></PlayArrowIcon></button>
                    </div>
                  </div>
                  <div className="row col-md-5 mt-1 ml-1" id ="jseditor-console" style={{
                    height: "550px", width: "300px", borderColor: "black", color: "whitesmoke",
                    backgroundColor: "black",
                    borderStyle: "solid"
                  }}>
                      Console ...
                  </div>
                </div> 
                <div className="pull-right mt-3">
                          <button type="submit" className="btn default" data-dismiss="modal" onClick={() => {document.getElementById('jseditor-console').innerHTML = "Console ..."}}>
                          
                            Cancel</button>
                          <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal" 
                          onClick={()=>{this.commitJSFile();document.getElementById('jseditor-console').innerHTML = "Console ..."}}
                          disabled={this.state.disableJSCommit}>Commit</button>
                      </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="editor" role="dialog">
          <div className="modal-dialog" style={{ height: "700px", width: "1000px" }}>
            <div className="modal-content modals" style={{ height: "700px", width: "1000px"}}>
              <div className="modal-body modals" style={{ height: "700px", width: "1000px" }}>
                <p className="ml-4 mt-3" style={{fontSize:25}}>Editor</p>
                <div className="ml-4" style={{ display: "flex", flexDirection: "row" }}>
                  <div className="row col-md-7 mt-1" style={{ height: "550px", width: "680px" }}>
                    <AceEditor
                      style={{ height: "550px", width: "610px" }}
                      placeholder="Define the custom class here"
                      mode="python"
                      theme="monokai"
                      name="blah"
                      id="blah"
                      value={this.state.blah}
                      onChange={this.onChange}
                      navigateToFileEnd={true}
                      onLoad={this.onLoad}
                      fontSize={14}
                      showPrintMargin={true}
                      showGutter={true}
                      scrollMargin={[0, 0, 0, 0]}
                      highlightActiveLine={true}
                      enableBasicAutocompletion={true}
                      enableLiveAutocompletion={true}
                      enableSnippets={true} />
                      <div className="pull-right mt-3">
                      <button type="button" className="btn default" style={{width:"530px"}} onClick={()=>{this.compilePY();document.getElementById('editor-console').innerHTML = "Console ..."}}> Run <PlayArrowIcon fontSize="small"></PlayArrowIcon></button>
                    </div>
                  </div>
                  <div className="row col-md-5 mt-1 ml-1" id ="editor-console" style={{
                    height: "550px", width: "300px", borderColor: "black", color: "whitesmoke",
                    backgroundColor: "black",
                    borderStyle: "solid"
                  }}>
                      Console ...
                  </div>
                </div> 
                <div className="pull-right mt-3">
                          <button type="submit" className="btn default" data-dismiss="modal" onClick={() => {document.getElementById('editor-console').innerHTML = "Console ..."}}>
                          
                            Cancel</button>
                          <button type="submit" className="btn btn-primary pull-right" data-dismiss="modal" 
                          onClick={()=>{this.commitPYFile(); document.getElementById('editor-console').innerHTML = "Console ..."}}
                          disabled={this.state.disableCommit}>Commit</button>
                      </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataSetDetailsPage;
