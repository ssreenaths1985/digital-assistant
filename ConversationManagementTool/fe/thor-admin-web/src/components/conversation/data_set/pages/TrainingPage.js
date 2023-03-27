import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../../common/components/BrandNavBar";
import HeaderNavBar from "../../../common/components/HeaderNavBar";
import SidebarComponent from "../../common/components/SidebarComponent";
import LocalizedStrings from "react-localization";
import { translations } from "../../../../translations.js";
import { DatasetService } from "../../../../services/dataset.service";
import { BotService } from "../../../../services/bot.service"
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import { Hidden } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";


let strings = new LocalizedStrings(translations);

class TrainingPage extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en", name: '', datasets: [], intents: [], records: [], value: '', showInput: false, bots: [], selectedDataset: '', dataset: '', desc: '', show: false};
    this.manageData = this.manageData.bind(this)
  }

  onFormClick = (event) => {
    var data = [];
    data.push(this.props.match.params.bot)
    data.push(this.state.dataset);

    DatasetService.createDataset(data).then((response) => {

      if (response && response === 403) {
        Notify.error('Access Denied !');
       
      } 
      else if(response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
      {
        Notify.success(response.payload);

        this.props.history.push("/conversations/data-sets/" + this.props.match.params.bot + "/training/" +this.props.match.params.username);
        this.manageData(this.props.match.params.bot)
        this.setState({dataset:''})

      }
      else {
        Notify.error('Error in the api call');
      }
    });
  }

  manageData(bot) {
    DatasetService.getDataset(bot).then((response) => {
      if (response && response === 403
       
      ) {
        Notify.error('Access Denied !');

      }
      else if(response && response.status && response.status.code &&
        response.status.code === APP.CODE.SUCCESS)
      {
        this.props.history.push("/conversations/data-sets/" + bot + "/training/"+this.props.match.params.username);
        this.setState({ datasets: Object.keys(response.payload.response) })
        this.setState({ records: Object.values(response.payload.response) })
      }
      else {
        Notify.error('Error in the api call');
      }
    });
  }

  deleteDataset= (dataset)=> {
    var data = [];
    data.push(this.props.match.params.bot)
    data.push(dataset)
    DatasetService.removeDataset(data).then((response) => {
      if (response && response === 403
       
      ) {
        Notify.error('Access Denied !');

      } else if(response && response.status && response.status.code &&
        response.status.code === APP.CODE.SUCCESS)
      {
        Notify.success("Dataset deleted successfully");
        this.manageData(this.props.match.params.bot)
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

  }

  componentDidMount() {
    if (this.props.match.params.bot === 'choose a bot') {

    }
    else {
      DatasetService.getDataset(this.props.match.params.bot).then((response) => {
        if (response && response === 403)
        {
          Notify.error('Access Denied !');
        }
        else if(response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
        {
          this.setState({ datasets: Object.keys(response.payload.response) })
          this.setState({ records: Object.values(response.payload.response) })
        }
        else
        {
          Notify.error('Error in the api call');
        }
      });
    }
  }

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin" style={{overflow:'hidden'}}>
        <div className="row">
        <BrandNavBar bot={this.props.match.params.bot}  username={this.props.match.params.username}/>
          <HeaderNavBar {...this.props} manageData={this.manageData} bot={this.props.match.params.bot} username={this.props.match.params.username}/>
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-2 admin-left-section">
                <SidebarComponent {...this.props} />
              </div>
              <div className="col-md-10 admin-right-section">
                <div className="row col-md-12">
                  {this.props.match.params.bot !== 'Choose a bot' ? (<React.Fragment><div className="row col-md-12">
                  {/* <div className="col-md-12 mt-5">
                    <Link
                      to={"/conversations/data-sets/Choose a bot/training"}
                      className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${this.props.location.pathname.match(
                        "/conversations/data-sets/training"
                      )
                          ? "selected"
                          : "grey-text"
                        }`}
                    >
                      Training
                    </Link>
                    <Link
                      to={"/conversations/data-sets/testing"}
                      className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${this.props.location.pathname.match("/conversations/data-sets/testing")
                          ? "selected"
                          : "grey-text"
                        }`}
                    >
                      Testing
                    </Link>
                  </div> */}
                </div>
                <div className="row col-md-12 mt-5">
                  <div className="col-md-12">
                    <button type="button" className="btn theme" data-toggle="modal" data-target="#myModal">
                      Create a dataset
                    </button>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-3">
                    <div className="form-group has-search">
                      <i className="material-icons form-control-feedback">
                        search
                      </i>
                      <input
                        type="text"
                        className="form-control"
                        id="search-roles"
                        placeholder="Search for an item"
                        autoComplete="off"
                        onKeyUp={(event) =>
                          this.props.searchTrainingItems(event)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">

                  {this.state.datasets.map((dataset, key) => (
                    <div className="col-md-3">
                     
                        <div className="dashboard-item bordered">
                          <div className="row col-12 datasets" >
                          <Link to={{ pathname: '/conversations/data-sets/' + this.props.match.params.bot + '/' + dataset + '/details/'+this.props.match.params.username }}>
                            <div className="row col-12 datasets ml-1"style={{backgroundColor:grey}}>
                            <div className="col-2">
                              <span className="ml-3 profileCircle textColor text-uppercase">
                                DS1
                              </span>
                            </div>
                            <div className="col-8">
                              <p className="p-3 one-line ml-2">
                                <span className="title ml-4">{dataset}</span> <br />
                                <span className="recordCount ml-4">{this.state.records[key]} records</span>
                              </p>
                            </div>
                            </div>
                            </Link>
                            <div className=" col-md-2 pull right dropdown datasets" style ={{cursor : "pointer"}}>
                              <span
                                className="mr-5"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                <i className="fa fa-ellipsis-v pull-right"></i>
                              </span>
                              <div className="dropdown-menu mr-5 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink">
                                <p className="dropdown-item dateFilterTextColor" value="Delete"  data-toggle="modal" data-target="#deleteModal"
                                onClick={()=>{this.setState({selectedDataset : dataset})}}
                                >
                          Delete
                        </p>
                              </div>
                            </div>

                          </div>
                        </div>
                     
                    </div>
                  ))}
                </div></React.Fragment>) : (<div className="mt-5">
                        <div className="vertical-center d-none d-sm-block" id="emptyState">
                          <center>
                            <h3 className="pb-2">No bot selected</h3>
                            <p className="col-7 pb-2 subText">
                              Please select a bot from the top nav bar to see its details here
                                    </p>

                            <div className="mt-5"><img src="/img/Model.svg" alt="empty activity"></img> </div>
                          </center>
                        </div></div>)}
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog" style={{ height: "300px", width: "400px"}}>
            <div className="modal-content modals" style={{ height: "300px", width: "400px" }}>
              <form onSubmit={this.onFormClick}>
                <div className="modal-body modals" style={{ height: "300px", width: "400px"}}>
                  <h5 className="ml-2 mt-3">Create a Dataset</h5>
                  <div className="col-md-12 mt-4">
                    Name
                    <div className="row col-md-12 mt-2" style={{ height: "40px", color: 'white' }}>
                      <input
                        required
                        type="text"
                        name="dataset"
                        id="dataset"
                        maxLength="15"
                        value={this.state.dataset}
                        onChange={this.handleClick}
                        className="form-control admin-table-bg no-radius"
                        placeholder="Dataset name with versions e.g Tarento_Bot-V1"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    Description
                    <div className="row col-md-12 mt-2" style={{ height: "40px", color: 'white' }}>
                      <input
                        type="text"
                        name="desc"
                        id="desc"
                        value={this.state.desc}
                        onChange={this.handleClick}
                        className="form-control admin-table-bg no-radius"
                        placeholder="Description (Optional)"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="pull-right">
                    <button type="submit" className="btn default mt-3" data-dismiss="modal" onClick ={ () => {this.setState({dataset : ''});
                    this.setState({desc : ''})}}>Cancel</button>
                    <button type="submit" className="btn btn-primary mt-3 pull-right" disabled={!this.state.dataset && this.state.dataset.length<12} data-dismiss="modal" onClick={this.onFormClick}>Create</button>


                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal fade" id="deleteModal" role="dialog">
          <div className="modal-dialog mt-10" style={{height: "200px", width: "400px"}}>
            <div className="modal-content modals" style={{ height: "200px", width: "400px" }}>

              <div className="modal-body modals" style={{ height: "200px", width: "400px" }}>
              <h5 className="ml-3 mt-3">Delete a Dataset</h5>
                    <p className = "ml-3" style={{color:'rgba(255, 255, 255, 0.7)', fontSize:"15px"}}>
                    The selected dataset {this.state.selectedDataset} will be deleted and a latest version of the same dataset will be activated.
                    </p>
              </div>
              <div className="modal-footer" style={{height: "100px", width: "400px", paddingRight : "2px"}}>
              <button type="button" className="btn default" data-dismiss="modal">
                       Cancel
                      </button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" 
                style={{marginRight: "10px", marginLeft:"15px"}} onClick={(e) => {this.deleteDataset(this.state.selectedDataset)}}>Delete</button>
              </div>

            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default TrainingPage;
