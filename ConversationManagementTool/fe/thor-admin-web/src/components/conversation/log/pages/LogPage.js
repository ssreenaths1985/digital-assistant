import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../../common/components/BrandNavBar";
import HeaderNavBar from "../../../common/components/HeaderNavBar";
import SidebarComponent from "../../common/components/SidebarComponent";
import LocalizedStrings from "react-localization";
import { translations } from "../../../../translations.js";
import { color } from "d3";
import FilterListIcon from '@material-ui/icons/FilterList';
import { DatasetService } from "../../../../services/dataset.service"
import { ConversationService } from "../../../../services/conversation.service"
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import { event } from "jquery";


let strings = new LocalizedStrings(translations);
var utterance;

class LogPage extends Component {
  constructor(props) {
    super(props);
    this.searchConversationItems = this.props.searchConversationItems;
    this.state = {
      language: "en", showHide1: false, showHide2: false, showHide3: false, fromDate: '2019-11-01', toDate: '2020-12-31', page: 2, pageSize: 100, allData:{},
      intentFilter: 'greet', answerFilter: 'Answer', confidenceFilter: 'Confidence', intent1: '', conf1: 0, intent2: '', conf2: 0, int: '', act: '', res: '', utrlist: '',
      convos:[], dataset1: 'choose a dataset', dataset2: 'choose a dataset', dataset3: 'choose a dataset', int1: 'choose an intent', int2: 'choose an intent',
      disabled: true, datasets: [], intents: [], rankings: [], size: 0, index:[] ,convoIntents: [], date:"Sort by date", conversations : [], convoList:{}, displayConvos: [],
      allutterances:[], notAdded : [], added: [], allIntents:{}, title : true, selectedConvos:[], inputStyle:{}, disableRows:false, selectedIntents:[], updatedConvos : [],
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
    };

    this.manageData = this.manageData.bind(this)
  }



  componentDidMount()
  {
    if(this.props.match.params.bot !== "Choose a bot"){
      DatasetService.getDataset(this.props.match.params.bot).then((response) => {
        if (response && response === 403
       
          ) {
            Notify.error('Access Denied !');
    
          }
        else if (
          response && response.status && response.status.code &&
          response.status.code === APP.CODE.SUCCESS
        ) {
          this.setState({ datasets: Object.keys(response.payload.response) })
          this.setState({ records: Object.values(response.payload.response) })
        } else {
          Notify.error('Error in the api call');
        }
      });
      this.manageData(this.props.match.params.bot)
      
    }
    
  //   let data = []
  //   data.push(this.props.match.params.bot)
  //   data.push(dataset)
  //   DatasetService.getAllUtterances(data).then((response) => {
  //     if (response && response === 403
       
  //       ) {
  //         Notify.error('Access Denied !');
  
  //       }
  //     else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {

  //       this.setState({allUtterances: Object.keys(response.payload) });
 
  //     }
  //     else {
  //       Notify.error('Error in the api call');
  //     }
  //   });
    
  }
  showCol()
  {
    this.setState({displayConvos : this.state.convos}); 
    this.setState({title : true})
    var tbl  = document.getElementById('myTable');
    var rows = tbl.getElementsByTagName('tr');
    for (var row=0; row<rows.length;row++)
    {
      var cels = rows[row].getElementsByTagName('td')[2];
      // var celss = rows[row].getElementsByTagName('td')[3];

      cels.style.display= "Block";
      // celss.style.display= "Block";
      
    }
  }

  hideCol()
  {
    this.setState({displayConvos : this.state.selectedConvos})
    this.setState({title : false})
    var tbl  = document.getElementById('myTable');
    var rows = tbl.getElementsByTagName('tr');
    for (var row=0; row<rows.length;row++)
    {
      // var cels = rows[row].getElementsByTagName('td')[2];
      var celss = rows[row].getElementsByTagName('td')[2];

      // cels.style.display= "None";
      celss.style.display= "None";
      
    }

  }
  getIntents(dataset) {

    let data = [];
    data.push(this.props.match.params.bot)
    data.push(dataset)
    DatasetService.getIntents(data).then((response) => {
      if (response && response === 403
       
        ) {
          Notify.error('Access Denied !');
  
        }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
      {
        this.setState({allIntents : response.payload});
        this.setState({intents: Object.keys(response.payload) });
        this.setState({allutterances : Object.values(response.payload)})
        this.setState({allutterances : [].concat.apply([], this.state.allutterances)})
      }
      else {
        Notify.error('Error in the api call');
      }
    });
  }


  getDatatsets() {

    DatasetService.getDataset(this.props.match.params.bot).then((response) => {
      if (response && response === 403
       
        ) {
          Notify.error('Access Denied !');
  
        }
      else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS
      ) {
        this.setState({ datasets: Object.keys(response.payload.response) })
      } else {
        Notify.error('Error in the api call');
      }
    });
  }

  onChangeConvo = (e, id) =>
  {
    document.getElementById("addconvo"+id).value = e.target.value
  }

  onEditUtterances = (event) => 
  {
    event.preventDefault();

    for(var i =0; i< this.state.conversations.length ; i++)
    {
      var index = this.state.conversations.indexOf(document.getElementById("addconvo"+i).defaultValue);
      this.state.conversations[index] = document.getElementById("addconvo"+i).value;
    }
  }

  addUtterance = (event) => {
    event.preventDefault();
    var intent = document.getElementById('Cintent').value;
    this.state.convoList[intent] =  this.state.conversations ;
    this.setState({index: []});
    var length = this.state.selectedConvos.length - this.state.conversations.length;
    for (var i = this.state.selectedConvos.length - 1; i >= length; i--)
    {
        this.state.selectedConvos[i].intent = intent;
    }
    console.log(this.state.conversations.length);
    this.setState({conversations: []})
    console.log(this.state.conversations.length);
    utterance = '';
  }

  addMultipleUtterance = (event) => {
    Notify.success("Adding utterances to the dataset")
    event.preventDefault();
      console.log(this.state.convoList)
      let data = [];
      data.push(this.state.convoList);
      data.push(this.state.dataset2)
      data.push(this.props.match.params.bot)
      ConversationService.addConvos(data).then((response) => {
          if (response && response === 403
         
            ) {
              Notify.error('Access Denied !');
      
            }
          else if (response && response.status && response.status.code && 
            response.status.code === APP.CODE.SUCCESS && response.payload === "Utterance already present.") {
            
            Notify.success("Utterance already present.");
  
          } else if(response && response.status && response.status.code && 
            response.status.code === APP.CODE.SUCCESS && response.payload === "Added conversations to dataset"){
            Notify.success(response.payload)
            this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/training/" + this.props.match.params.username);
            // this.getDatatsets();
            var pushConvos = Object.values(this.state.convoList);
            pushConvos = [].concat.apply([], pushConvos);
            for(var i = 0; i<this.state.convos.length ; i++)
            {
              if(this.state.convos[i].text === pushConvos[i])
              {
                this.state.added.push(this.state.convos[i]);
                this.state.notAdded.splice(this.state.notAdded.indexOf(this.state.convos[i]), 1);
              }
              
            }
            
            this.setState({convoList : {}});
          }
          else
          {
            Notify.success('Error in the api call')
          }
      })


  }


  manageData(bot)
  {
    this.props.history.push("/conversations/"+bot+"/logs/" + this.props.match.params.username);
    DatasetService.getDataset(bot).then((response) => {
      if (response && response === 403
       
        ) {
          Notify.error('Access Denied !');
  
        }
      else if (
        response && response.status && response.status.code &&
        response.status.code === APP.CODE.SUCCESS
      ) {
        this.setState({ datasets: Object.keys(response.payload.response) })
        this.getIntents(this.state.datasets[0])
        ConversationService.getConvos(bot).then((response) => {
          if (response && response === 403)
          {
              Notify.error('Access Denied !');
          }
          else if(response != 'Error in the api call')
          {
            if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
            {
              this.setState({allData:response.payload});
              this.setState({convos:Object.values(response.payload)})
              for(var i =0; i<this.state.convos.length; i++)
              {
                if(this.state.allutterances.includes(this.state.convos[i].text))
                {
                  this.state.added.push(this.state.convos[i]);
                  // var values = Object.values(this.state.allIntents)
                  // for(var j =0; j<values.length; j++)
                  // {
                  //   if(values[j].includes(this.state.convos[i].text))
                  //   {
                  //     this.state.added.intent = this.state.allIntents[values[j]];
                  //   }
                  // }
                }
                else
                {
                  this.state.notAdded.push(this.state.convos[i]);
                }
              }
              this.setState({displayConvos : this.state.convos})
              for(var i =0 ; i<this.state.convos.length ; i++)
              {
                this.state.convoIntents.push(this.state.convos[i].intent);
                const uniqueSet = new Set(this.state.convoIntents);
                const backToArray = [...uniqueSet];
                this.setState({convoIntents : backToArray})
              }
            }
            else
            {
              Notify.error('Error in the api call');
            }
          }
          else
          {
            Notify.error("ELASTICSEARCH ERROR!! Could not load the conversations");
          }
      
    });
      } else {
        Notify.error(response && response.payload.response);
      }
    });
  }
  onFormClick = (event) => {

    var data = [];
    var list = [];
    list.push(utterance)
    data.push(this.props.match.params.bot)
    data.push(this.state.dataset3);
    data.push(this.state.int);
    data.push(list);
    data.push(this.state.act);
    data.push(this.state.res);

    DatasetService.createIntent(data).then((response) => {

      if (response && response === 403
       
        ) {
          Notify.error('Access Denied !');
  
        }
      else if (response && response.status && response.status.code && 
        response.status.code === APP.CODE.SUCCESS) {
        Notify.success(response.payload);
        this.props.history.push("/conversations/"+this.props.match.params.bot+"/logs/" + this.props.match.params.username);

      } else {
        Notify.error(response.payload)
      }
    });
  }

  handleClick = event => {
    this.setState({
      [event.target.name]: event.target.value
    })

  }

  addActionsAD = () =>{
    // var table = document.getElementById('myTable');
    // var rows = table.getElementsByTagName('tr');
    // var cells = rows[this.state.index +1].getElementsByTagName('td');
    // cells[1].innerHTML = '<span>AD</span>';
  }


  addActionsNI = () =>{
    // var table = document.getElementById('myTable');
    // var rows = table.getElementsByTagName('tr');
    // var cells = rows[this.state.index+1].getElementsByTagName('td');
    // cells[1].innerHTML = '<span>NI</span>';
  }


  render() {

    function myFunction() {
      var intent, intCaps, answer, ansCaps, conf, conCaps, table, tr, tdInt, tdAns, tdConf, i;

      intent = document.getElementById("intent");
      if (intent) {
        intCaps = intent.value.toUpperCase();
      }


      answer = document.getElementById("answer");
      if (answer) {
        ansCaps = answer.value.toUpperCase();
      }

      conf = document.getElementById("conf");
      if (conf) {
        conCaps = conf.value.toUpperCase();
      }

      table = document.getElementById("myTable");
      tr = table.tBodies[0].getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        tdInt = tr[i].getElementsByTagName("td")[1];
        tdAns = tr[i].getElementsByTagName("td")[2].innerHTML;
        // tdConf = tr[i].getElementsByTagName("td")[3];
        if(intCaps && ansCaps)
        {
          if (tdInt.textContent.toUpperCase().indexOf(intCaps) > -1 && tdAns.toUpperCase().indexOf(ansCaps) > -1) {
            tr[i].style.display = "";
          } 
          else {
            tr[i].style.display = "none";
          }
        }
        else
        {
          if (tdInt.textContent.toUpperCase().indexOf(intCaps) > -1 || tdAns.toUpperCase().indexOf(ansCaps) > -1) {
            tr[i].style.display = "";
          } 
          else {
            tr[i].style.display = "none";
          }
        }
        
      }
    }

    function sortTable() {
      var table, i, x, y;
      table = document.getElementById("myTable");
      var switching = true;

      // Run loop until no switching is needed
      while (switching) {
          switching = false;
          var rows = table.rows;

          // Loop to go through all rows
          for (i = 1; i < (rows.length - 1); i++) {
              var Switch = false;

              // Fetch 2 elements that need to be compared
              x = rows[i].getElementsByTagName("td")[3];
              y = rows[i + 1].getElementsByTagName("td")[3];
              var dateStringx = x.id;
              var dateStringy = y.id;
              // var datePartsx = dateStringx.split("/");
              // var dateObjectx = new Date(+datePartsx[2], datePartsx[1] - 1, +datePartsx[0]); 
              // var datePartsy = dateStringy.split("/");
              // var dateObjecty = new Date(+datePartsy[2], datePartsy[1] - 1, +datePartsy[0]); 
              // Check if 2 rows need to be switched
              if (dateStringx > dateStringy)
              {

                  // If yes, mark Switch as needed and break loop
                  Switch = true;
                  break;
              }
          }
          if (Switch) {
              // Function to switch rows and mark switch as completed
              rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
              switching = true;
          }
      }
  }

  function sortTabledesc() {
    var table, i, x, y;
    table = document.getElementById("myTable");
    var switching = true;

    // Run loop until no switching is needed
    while (switching) {
        switching = false;
        var rows = table.rows;

        // Loop to go through all rows
        for (i = 1; i < (rows.length - 1); i++) {
            var Switch = false;

            // Fetch 2 elements that need to be compared
            x = rows[i].getElementsByTagName("td")[3];
            y = rows[i + 1].getElementsByTagName("td")[3];
            var dateStringx = x.id;
            var dateStringy = y.id;
            // var datePartsx = dateStringx.split("/");
            // var dateObjectx = new Date(+datePartsx[2], datePartsx[1] - 1, +datePartsx[0]); 
            // var datePartsy = dateStringy.split("/");
            // var dateObjecty = new Date(+datePartsy[2], datePartsy[1] - 1, +datePartsy[0]); 
            // Check if 2 rows need to be switched
            if (dateStringx < dateStringy)
            {

                // If yes, mark Switch as needed and break loop
                Switch = true;
                break;
            }
        }
        if (Switch) {
            // Function to switch rows and mark switch as completed
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
    // function addActionsIM() {
    //   var table = document.getElementById('myTable');
    //   var rows = table.getElementsByTagName('tr');
    //   var cells = rows[selectedIndex].getElementsByTagName('td');
    //   cells[1].innerHTML = '<span>IM</span>';
    // }
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
        <BrandNavBar bot={this.props.match.params.bot}  username={this.props.match.params.username}/>
          <HeaderNavBar {...this.props} manageData={this.manageData} bot={this.props.match.params.bot} username={this.props.match.params.username} />
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-2 admin-left-section" style={{ maxHeight: "930px" }}>
                <SidebarComponent {...this.props} bot={this.props.match.params.bot} />
              </div>
              <div className="col-md-8 admin-right-section" style={{maxHeight: "930px" }}>
                <div className="row col-md-12 mt-5">
                  <div className="row col-md-12">
                    <div className="col-md-4">
                      <div className="dropdown mt-1 d-none d-md-flex d-lg-flex langDropdown">
                        <span
                          className="dropdown-toggle mr-5"
                          href="#"
                          role="button"
                          id="dropdownRoleLink"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {this.state.date}{" "}
                        </span>
                        <div className="dropdown-menu mr-5 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink">
                        <p className="dropdown-item dateFilterTextColor" href="#" value="Latest"
                          onClick={() => { this.setState({ date: "Latest" })
                          sortTabledesc();}}>
                            Latest
                        </p>
                        <p className="dropdown-item dateFilterTextColor" href="#" value="Oldest"
                          onClick={() => { this.setState({ date: "Oldest" })
                          sortTable();}}>
                            Oldest
                        </p>
                        
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      {/* <div className="dateFilterTextColor pull-right" href="#" value="Answer:blank" aria-labelledby="dropdownRoleLink">
                        {this.state.showHide3 ? (<div className="dropdown mt-1 d-none d-md-flex d-lg-flex langDropdown">
                          <select id="sort" onClick={myFunction} class='form-control'>
                            <option>ASC</option>
                            <option>DSC</option>

                          </select>


                        </div>) : (null)}
                      </div> */}
                    </div>
                    <div className="col-md-2">
                      <div className="dateFilterTextColor pull-right" href="#" value="Answer:blank" aria-labelledby="dropdownRoleLink">
                        {this.state.showHide2 ? (<div className="dropdown mt-1 d-none d-md-flex d-lg-flex langDropdown">
                          <select id="answer" onClick={myFunction} className='dropDown-control' style={{width:"150px"}}>
                            <option value="" disabled selected>Select a status</option>
                            <option value = "ANS">Answered</option>
                            <option value = "NOT">Not answered</option>
                          </select>
                        </div>) : (null)}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="dateFilterTextColor pull-right" href="#" value="Answer:blank" aria-labelledby="dropdownRoleLink">
                        {this.state.showHide1 ? (<div className="dropdown mt-1 d-none d-md-flex d-lg-flex langDropdown">
                          <select id="intent" onClick={myFunction} className='dropDown-control' style={{width:"150px"}}>
                          <option value="" disabled selected>Select an intent</option>
                          {this.state.convoIntents.map((intents, key) => (
                          <option>{intents}</option>
                          ))}
                          </select>

                        </div>) : (null)}
                      </div>
                    </div>
                    <div class="col-md-2 dropdown pull-right" style = {{cursor:"pointer"}}>
                      <label
                        className="pull-right"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <p className="pull-right" style = {{cursor:"pointer"}}><FilterListIcon className="mr-3"></FilterListIcon>Filters</p>
                      </label>
                      <div className="dropdown-menu mr-9 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink">
                        <p className="dropdown-item dateFilterTextColor" value="Intent"
                          onClick={() => { this.setState({ showHide1: !this.state.showHide1 })}}>
                          <div className="row ml-1">
                            <div>{this.state.showHide1 ? (<CheckBoxIcon className="pull-right" style={{ color: "rgb(0, 146, 255)" }} />) : (null)}</div>
                            <div className="ml-2">Intent</div>
                          
                          </div>
                           
                        </p>

                        <p className="dropdown-item dateFilterTextColor" href="#" value="Answer status"
                          onClick={() => { this.setState({ showHide2: !this.state.showHide2 })}}>
                            <div className="row ml-1">
                            <div>{this.state.showHide2 ? (<CheckBoxIcon className="pull-right" style={{ color: "rgb(0, 146, 255)" }} />) : (null)}</div>
                            <div className="ml-2">Answer Status</div>
                          
                          </div>
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="row col-md-12">
                    <div className="col-md-4">
                      <div className="form-group has-search">
                        <i className="material-icons form-control-feedback">
                          search for conversation
                        </i>
                        <div className="row col-md-10 mt-4">
                          <input
                            type="text"
                            className="form-control"
                            id="search-roles"
                            placeholder="Search for a conversation"
                            autoComplete="off"
                            onKeyUp={(event) =>
                              this.props.searchConversationItems(event)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row col-md-12 mt-4" >
                    <label className="pull-right" style={{marginLeft: "890px"}}>
                        <input type="checkbox" value="Remove already added queries" onChange={()=>{this.setState({disableRows : !this.state.disableRows})}}  style={{marginRight:"15px"}}/>
                      Remove already added Queries
                    </label>

                    <div className="col-12 convonav" id="convonav">
                      <div className ="col-12" style={{fontSize: "30px !important", fontWeight:"bold"}}>
                      <nav aria-label="...">
                          <ul class="pagination">
                            <li class="page-item" className={this.state.title? "active": "" }
                            onClick = {()=> {this.showCol();}} style= {{marginLeft:"20px", height:"50px", 
                            width:"100px", justifyContent:"center", textAlign:"center",paddingTop:"15px", cursor : "pointer"}} >All queries</li>
                            <li class="page-item" className={this.state.title
                        ? ""
                        : "active" }
                        onClick = {()=> {this.hideCol();}} style= {{marginLeft:"20px", height:"50px", 
                            width:"150px", justifyContent:"center", textAlign:"center",paddingTop:"15px", cursor : "pointer"}}>Selected queries</li>
                          </ul>
                        </nav>
                        {/* <div className="col-10">
                            <p style={{fontSize: "30 px !important", fontWeight:"bold", marginTop:"10px", marginLeft: "10px"}}>{this.state.title}</p>
                        </div> */}
                        {/* <div className = "col-2 pull-right">
                            <p style={{fontSize: "30 px !important", fontWeight:"bold",  marginTop:"10px", marginLeft: "40px"}}> {this.state.displayConvos.length} Conversations</p>
                        </div> */}
                      </div>
                      <div className = "col-12 convotable" id="convotable">
                      <table className="table borderless conversation-list" id="myTable">
                        <tr style={{ borderBottom: '0.1 em thin rgba(255, 255, 255,)' }}>
                          <td className="white-70">User Queries</td>
                          {/* <td className="white-70">Actions</td> */}
                          <td className="white-70">Intent</td>
                          {/* <td className="white-70">Confidence</td> */}
                          <td className="white-70">Answer Status</td>
                          <td className="white-70">Date</td>
                        </tr>
                        <tbody style= {{overflow: "scroll"}}>
                        {this.state.displayConvos.map((convo, key) => (
                            <tr className={`${this.state.disableRows ? this.state.allutterances.includes(convo.text) ? "disabled-row" : "" : "" } ${this.state.index.includes(key)
                              ? "active"
                              : ""
                            }`}  
                            // style={this.state.added.includes(convo.text) ? {backgroundColor: "#252530", pointerEvents: "none", color:"rgba(255, 255, 255, 0.2)", opacity: "20%"} : {}}
                             onClick={()=>{
                              if(this.state.index.includes(key))
                              {
                                this.state.index.splice(this.state.index.indexOf(key), 1);
                                this.state.conversations.splice(this.state.conversations.indexOf(convo.text), 1);
                                this.state.selectedConvos.splice(this.state.selectedConvos.indexOf(convo), 1);
                              }
                              else
                              {
                                this.state.index.push(key)
                                this.state.selectedConvos.push(convo)
                                this.state.conversations.push(convo.text)
                              }
                              if(this.state.index.length > 0)
                              {
                                this.setState({show:true})
                              }
                             
                              // utterance = convo.text;
                              // this.setState({rankings:convo.intent_ranking})
                              }} style={{cursor : "pointer"}}>
                                <td>{convo.text}</td>
                                {/* <td></td> */}
                                <td>{convo.intent}</td>
                                {/* <td>{convo.confidence}</td> */}
                                <td>{convo.intent==='low_confidence' ? (<i class="fa fa-times ml-4" aria-hidden="true" value="NOT"></i>) : (<i class="fa fa-check ml-4" aria-hidden="true" value = "ANS"></i>)}</td>
                                <td id = {convo.date}>{new Date(convo.date * 1000).toLocaleDateString()}</td>
                              </tr>))}
                        </tbody>

                      </table>

                      </div>
                      <div id="footernav">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2 admin-left-section" style={{ maxHeight: "930px" }}>
                {this.state.show ? (
                  <div>
                    {this.state.rankings == null ? (<React.Fragment></React.Fragment>) : (<React.Fragment>
                      {this.state.rankings.map((ranks, key) => (
                      <div className="box">
                        <div className="col-md-6 mt-3 bottom" >
                          <p style={{ marginBottom: "3px", borderBottom: "1px thick white" }}>{ranks.intent}</p></div>
                        <div className={ranks.confidence >= 0.70 ? ("col-md-6 success pull-right") : ("col-md-6 danger pull-right")} style={key === this.state.size - 1 ? ({ borderBottom: "1px thick white" }) : ({})}><p style={{ textAlign: "center", verticalAlign: "center" }}>{ranks.confidence}</p></div>
                      </div>

                    ))}
                    </React.Fragment>)}
                    <div className="panel panel-default col-md-12 mt-4 bottom">
                      <div className="panel-heading">
                        <p data-toggle="collapse" href="#collapse2">Add to dataset <i className="fa fa-plus pull-right" style={{ color: "rgba(192,192,192,0.5)" }} 
                        onClick={()=>{this.addActionsAD()}}></i></p>
                      </div>

                      <div id="collapse2" className="panel-collapse collapse" style={{cursor : "pointer"}}>
                        <div>
                          <div className="panel-body dropdown mt-4 langDropdown" id="logDetails" style={{ width: "150px"}}>
                            <span
                              style={{ width: "150px"}}
                              className="dropdown-toggle pull-center"
                              href="#"
                              role="button"
                              id="dropdownRoleLink"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              {this.state.dataset2}{" "}
                            </span>
                            <div className="dropdown-menu mr-5 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink" style={{ width: "150px"}}>
                              {this.state.datasets.map((datasets, key) => (

                                <p className="dropdown-item dateFilterTextColor" style={{ width: "150px"}} onClick={() => {
                                  this.setState({ dataset2: datasets })
                                  this.getIntents(datasets);

                                }}>
                                  {datasets}
                                </p>))}
                            </div>
                          </div>
                          <div className=" panel-body dropdown mt-4 mb-3 d-none d-md-flex d-lg-flex langDropdown" style={{width:"150px"}}>
                            {/* <span
                              className="dropdown-toggle pull-right"
                              href="#"
                              role="button"
                              id="dropdownRoleLink"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                              disabled="true"

                            >
                              {this.state.int2}{" "}
                            </span> */}
                            <div
                              className="dropdown mt-1 d-none d-md-flex d-lg-flex langDropdown" style={{width:"150px"}}>
                                <select id="Cintent" className='dropDown-control' style={{width:"150px"}}>
                                  <option value = "choose an intent" disabled selected style={{paddingTop:"20px"}}>Choose an intent</option>
                                {this.state.intents.map((intent, key) => (
                                <option value={intent} style={{paddingTop:"20px"}}> {intent} </option>
                          ))}
                          </select>

                            </div>
                          </div>
                        </div>
                        <button className="btn default mb-2" style={{ width: "285px", height: "43px"}}  data-toggle="modal" data-target="#editConvo">Edit</button>
                        <button className="btn default mb-2" style={{ width: "285px", height: "43px"}} onClick={this.addUtterance}>Add {this.state.conversations.length}</button>
                      </div></div>
                    {/* <div className="panel panel-default col-md-12 mt-4 bottom">
                      <div className="panel-heading">
                        <p data-toggle="collapse" href="#collapse3">New Intent required<i className="fa fa-plus pull-right" style={{ color: "rgba(192,192,192,0.5)" }} onClick={()=>{this.addActionsNI()}}></i></p>
                      </div>
                      <div id="collapse3" className="panel-collapse collapse">
                        <div className=" panel-body dropdown mt-4 mb-3 d-none d-md-flex d-lg-flex langDropdown">
                          <span
                            className="dropdown-toggle mr-5"
                            href="#"
                            role="button"
                            id="dropdownRoleLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {this.state.dataset3}{" "}
                          </span>
                          <div className="dropdown-menu mr-5 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink">
                            {this.state.datasets.map((datasets, key) => (

                              <p className="dropdown-item dateFilterTextColor" onClick={() => {
                                this.setState({ dataset3: datasets })

                              }}>
                                {datasets}
                              </p>))}
                          </div>

                          <div><button type="submit" className="btn btn-primary mt-4" data-toggle="modal" data-target="#myModal">Create</button></div>
                        </div>
                      </div></div> */}
                  </div>
                ) : (null)}
                <div className="col-md-12 mt-1000 dashboard-item1 push-bottom" style={{ height: "80px" }}>
                  <div className="mt-3">
                    <button className="btn primary mt=4" style={{ width: "285px", height: "43px", marginBottom: "30px" }} onClick={this.addMultipleUtterance} >Add to dataset</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="editConvo" role="dialog">
          <div className="modal-dialog" style={{ height: "250px", width: "600px" }}>
            <div className="modal-content" style={{ height: "250px", width: "600px" }}>
              <form onSubmit={this.onFormClick}>
                <div className="modal-body" style={{ height: "250px", width: "600px" }}>
                  <h5 className="ml-2 mt-3">Edit utterances</h5>
                  {this.state.conversations.map((convos, key) => (
                    <input
                    style= {{marginTop: "20px"}}
                    type="text"
                    id={"addconvo"+key}
                    onChange = {(event)=> {this.onChangeConvo(event,key)}}
                    className="form-control admin-table-bg no-radius"
                    placeholder="Add an Intent"
                    defaultValue={convos}
                    autoComplete="off"
                  />))}
                    <div className="col-md-12"><button type="submit" className="btn btn-primary mt-3 pull-right" data-dismiss="modal" style={{marginLeft:"200px"}} onClick={this.onEditUtterances}>Save</button></div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog" style={{ height: "480px", width: "600px" }}>
            <div className="modal-content" style={{ height: "480px", width: "600px" }}>
              <form onSubmit={this.onFormClick}>
                <div className="modal-body" style={{ height: "480px", width: "600px" }}>
                  <h5 className="ml-2 mt-3">Create intent</h5>
                  <div className="col-md-12 mt-4">
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
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    Response
                    <div className="row col-md-12 mt-2" style={{ height: "40px" }}>
                      <input
                        type="text"
                        name="res"
                        id="res"
                        value={this.state.res}
                        onChange={this.handleClick}
                        className="form-control admin-table-bg no-radius"
                        placeholder="Add a Response"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    Utterance
                    <div className="row col-md-12 mt-2" style={{ height: "40px" }}>
                      <input
                        type="text"
                        name="utrlist"
                        id="utrlist"
                        value={utterance}
                        className="form-control admin-table-bg no-radius"
                        placeholder="Add an utterence"
                        contentEditable="true"
                      />
                    </div>
                  </div>

                  <div className="row col-md-12">
                    <div className="col-md-6"><button type="submit" className="btn default mt-3" data-dismiss="modal">Cancel</button></div>
                    <div className="col-md-6"><button type="submit" className="btn btn-primary mt-3 pull-right" data-dismiss="modal" onClick={this.onFormClick}>Create</button></div>


                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LogPage;
