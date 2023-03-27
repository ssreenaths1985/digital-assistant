import { Component } from "react";
import React from 'react';
import BrandNavBar from "../../common/components/BrandNavBar";
import HeaderNavBar from "../../common/components/HeaderNavBar";
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import { APP } from "../../../constants"
import Notify from "../../../helpers/notify";
import { DatasetService } from "../../../services/dataset.service";
import { ModelService } from "../../../services/model.service";
import { ReportService } from "../../../services/reports.service";
import HistoryIcon from '@material-ui/icons/History';
import { BotService } from "../../../services/bot.service";
import ChatWidget from "./ChatWidget"

var mheight;
var mwidth;
class ModelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '', version: '', IntentReports: [], EntityReports: [], confMat: [], intents: [], models: [], misses: [], hits: [], loadedModel: '', cellWidth: '',
      cellHeight: '', prodEnv: false, stagenv: false, show: false, intAccuracy: '', intF1Score: '', intPrecision: '', EntAccuracy: '', EntF1Score: '', EntPrecision: '',
      trainingDatasets: [], traindata: '', publishedVersions: [], bot: '', allBots: [], activeBots: [], appendModel: '', modelsMap: {}, messsage: true,
      publishedEnvs: []
    }
    this.manageData = this.manageData.bind(this);
  }


  handleClick = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });

  }


  manageData(bot) {
    this.setState({ show: false })
    ModelService.getModels(bot).then((response) => {
      let mods = [];
      this.props.history.push("/models/" + bot + "/undefined/" + this.props.match.params.username);
      if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        let datasets = Object.entries(response.payload);
        for (let i = 0; i < datasets.length; i++) {
          let entry = datasets[i];
          let mod = entry[1];
          for (let i = 0; i < mod.length; i++) {
            mods.push(mod[i])
          }
        }
        this.setState({ models: mods })
      }
      else {
        Notify.error(response && response.payload);
      }
    });
  }
  onFormSubmit = (event) => {
    var env = '';
    { this.state.prodEnv ? (env = 'production') : (env = 'staging') }
    let deployModel = [];
    deployModel.push(this.props.match.params.bot)
    deployModel.push(this.state.traindata)
    deployModel.push(this.state.loadedModel)
    deployModel.push("Vega")
    ModelService.loadModel(deployModel).then((response) => {
      if (
        response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS
      ) {
        Notify.success("Model " + this.state.loadedModel + " published successfully")
        // var modelName = (this.state.loadedModel.length) - 7;
        // var index = this.state.loadedModel.substring(0, modelName);
        // this.setState({ appendModel: index });

      }
      else {
        Notify.error("Couldn't load model");
      }
    });
  }

  onSubmit = () => {
    this.props.history.push("/models/publishModel/" + this.props.match.params.bot + "/" + this.state.traindata + "/testModel/" + this.props.match.params.username);
  }
  async initialList() {
    ModelService.getModels(this.props.match.params.bot).then((response) => {
      let mods = [];
      if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {

        this.setState({ modelsMap: response.payload });
        let datasets = Object.entries(this.state.modelsMap);
        for (let i = 0; i < datasets.length; i++) {
          let entry = datasets[i];
          let mod = entry[1];
          for (let i = 0; i < mod.length; i++) {
            mods.push(mod[i])
          }
        }
        this.setState({ models: mods });
      }
      else {
        Notify.error(response && response.payload);
      }
    });

    BotService.getActiveBots().then((response) => {
      if (response && response.code === APP.CODE.SUCCESS) {
        var bots = []
        bots = response.payload;

        for (var i = 0; i < bots.length; i++) {
          var map = bots[i]
          if (map.up === true) {
            this.state.activeBots.push(map.domain);
          }
          this.state.allBots.push(map.domain)
        }
      }
      else {
        Notify.error(response && response.payload);
      }
    });
    ModelService.getPublishedModels(this.props.match.params.bot).then((response) => {
      if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        this.setState({ publishedVersions: Object.keys(response.payload) })
        this.setState({ publishedEnvs: Object.values(response.payload) })
      }
      else {
        Notify.error(response && response.payload);
      }
    });
  }
  componentDidMount() {
    if (this.props.match.params.bot === 'Choose a bot') {

    }
    else {
      this.initialList()
    }

  }

  deployBot = (bot) => {
    var env = '';
    { this.state.prodEnv ? (env = 'production') : (env = 'staging') }
    var data = [];
    data.push(bot);
    data.push(this.state.traindata)
    data.push(this.state.loadedModel);
    data.push(env)
    BotService.deployBot(data).then((response) => {

      if (response && response.code === APP.CODE.SUCCESS) {
        setTimeout(() => { Notify.success(response.payload); }, 1000000);

        this.setState({ messsage: false })
      }
      else {
        Notify.error(response.payload)
      }

    });

  }

  activateBot = (bot) => {
    var data = [];
    data.push(bot);
    data.push(this.state.loadedModel);
    data.push(this.state.traindata)
    BotService.activateBot(data).then((response) => {

      if (response && response.code === APP.CODE.SUCCESS) {
        Notify.success(response.payload)
        this.setState({ messsage: false })
      }
      else {
        Notify.error(response.payload)
      }

    });

  }
  loadModel = (model) => {
    var dataset = '';
    this.setState({ loadModel: model });
    let datasets = Object.entries(this.state.modelsMap);
    for (let i = 0; i < datasets.length; i++) {
      let entry = datasets[i];
      let mods = entry[1];
      if (mods.includes(model)) {
        dataset = entry[0];
        this.setState({ traindata: dataset })
      }
    }
    let loadModel = [];
    loadModel.push(this.props.match.params.bot)
    loadModel.push(dataset)
    loadModel.push(model)
    loadModel.push("sandbox")
    ModelService.loadModel(loadModel).then((response) => {
      if (
        response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS
      ) {
        Notify.success("Model " + model + " loaded successfully")
        // var modelName = (this.state.loadedModel.length) - 7;
        // var index = this.state.loadedModel.substring(0, modelName);
        // this.setState({ appendModel: index });
        this.getReports(loadModel);

      }
      else {
        Notify.error("Couldn't load model");
      }
    });
  }

  getReports = (model) => {
    ModelService.evaluateModel(model).then((response) => {
      if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        ReportService.getReports(model).then((response) => {
          if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
            this.setState({ IntentReports: response.payload.IntentClassification });
            this.setState({ intAccuracy: (Math.round(this.state.IntentReports.recall * 100) / 100).toFixed(3) })
            this.setState({ intF1Score: (Math.round(this.state.IntentReports.f1Score * 100) / 100).toFixed(3) })
            this.setState({ intPrecision: (Math.round(this.state.IntentReports.precision * 100) / 100).toFixed(3) })
            this.setState({ EntityReports: response.payload.EntityClassification });
            this.setState({ entAccuracy: (Math.round(this.state.EntityReports.recall * 100) / 100).toFixed(3) })
            this.setState({ entF1Score: (Math.round(this.state.EntityReports.f1Score * 100) / 100).toFixed(3) })
            this.setState({ entPrecision: (Math.round(this.state.EntityReports.precision * 100) / 100).toFixed(3) })
            ReportService.getConfInts(model).then((response) => {
              if (
                response && response.status && response.status.code && 
                response.status.code === APP.CODE.SUCCESS
              ) {
                this.setState({ intents: response.payload });
                mwidth = this.state.intents.length * 100 + 650;
                if(mwidth <= 2200)
                {
                  var awidth = mwidth - 500
                  this.setState({ cellWidth: awidth / this.state.intents.length })
                }
                else
                {
                  this.setState({ cellWidth: 1000 / this.state.intents.length })
                }
                mheight = this.state.intents.length * 50 + 450;
                if(mheight <= 700)
                {
                  var aheight = mheight - 300
                  this.setState({ cellHeight:  aheight/ this.state.intents.length })
                }
                else
                {
                  this.setState({ cellHeight: 700 / this.state.intents.length })
                }
              } else {
                Notify.error(response && response.payload);
              }
            });

          } else {
            Notify.error(response && response.payload);
          }
        });
        ReportService.getConfmat(model).then((response) => {
          if (
            response && response.status && response.status.code &&
            response.status.code === APP.CODE.SUCCESS
          ) {
            this.setState({
              confMat: response.payload
            });
            this.setState({ show: true })
          } else {
            Notify.error(response && response.payload);
          }
        });

        // ReportService.getHistogram(evaluateModel).then((response) => {
        //   if (
        //     response &&
        //     response.status.code === APP.CODE.SUCCESS
        //   ) {
        //     this.setState({ hits: Object.values(response.payload.hits) });
        //     this.setState({ misses: Object.values(response.payload.misses) });

        //   } else {
        //     Notify.error(response && response.data.statusInfo.errorMessage);
        //   }
        // });
        // Notify.success("Evaluation reports for model " + model + " ready")

      }
      else {
        Notify.error(response.payload);
      }
    });
  }
  render() {
    if (document.getElementById("myTable")) {
      var table = document.getElementById("myTable");
      for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        row.cells[i].style.backgroundColor = '#4448aa';
      }
      //   var table = document.getElementById("myTable");
      //   for (var i = 1; i < table.rows.length; i++)
      //   {
      //     var objCells = table.rows[i].cells;
      //     for (var j = 0; j < objCells.length; j++) {
      //       if(i==j)
      //       {
      //         var span = objCells[j].innerHTML;
      //       }


      //     }
      // }
    }

    return (

      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
          <BrandNavBar bot={this.props.match.params.bot} username={this.props.match.params.username} />
          <HeaderNavBar {...this.props} manageData={this.manageData} bot={this.props.match.params.bot} username={this.props.match.params.username} />
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-3 admin-left-section" id="leftbar" style={{ maxHeight: "900px", maxWidth: "340px" }}>
                <div className="col-md-12">
                  <h5 className="mt-5 ml-3">Published</h5>
                  <div className="row col-md-12 mt-3 ">
                    {this.state.publishedVersions.map((models, key) => (

                      <div className={`row col-md-12 mt-2 ${this.state.loadedModel === models
                        ? "active"
                        : ""
                        }`} style={{ paddingLeft: "0px", paddingRight: "0px", width: "250px" }}>

                        <label className="roundSquares mt-2 ml-3 buttons" style={{ cursor: "pointer" }} className={`roundSquares mt-2 ml-3 buttons ${this.state.loadedModel === models
                          ? "roundSquaresactive"
                          : ""
                          }`} />
                        <label className="ml-3 mt-1" style={{ cursor: "pointer" }} onClick={
                          () => {
                            if (models)
                              this.loadExistingModel(models);
                            this.setState({ loadedModel: models })

                          }
                        }>{models} 
                        {/* <span class="badge badge-pill badge-secondary ml-3">{this.state.publishedEnvs[key]}</span> */}
                        </label>
                      </div>



                    ))}
                    <div className=" row col-md-12 mt-2" >
                      {/* <HistoryIcon></HistoryIcon>
                      <label className="ml-3 mt-1">show archives</label> */}
                    </div>
                  </div>

                </div>
                <div className="col-md-12">
                  <h5 className="mt-5 ml-3">Models</h5>
                  <div className="row col-md-12 mt-3" style={{ cursor: "pointer" }}>

                    {this.state.models.map((models, key) => (

                      <div className={`row col-md-12 mt-2 ${this.state.loadedModel === models
                        ? "active"
                        : ""
                        }`} style={{cursor:"pointer"}}>

                        <label className="roundSquares mt-2 ml-3 buttons" className={`roundSquares mt-2 ml-3 buttons ${this.state.loadedModel === models
                          ? "roundSquaresactiveWhite"
                          : ""
                          }`} style={{cursor:"pointer"}}/>
                        <label className="ml-3 mt-1" onClick={
                          () => {
                            if (models)
                              this.loadModel(models);
                            this.setState({ loadedModel: models })

                          }
                        } style={{cursor:"pointer"}}>{models}</label>
                      </div>



                    ))}

                  </div>
               
                </div>
                <div className="col-md-12 mt-1000 dashboard-item1 push-bottom" style={{ height: "146px" }}>
                  <div className="mt-3">
                    <button className="btn default mt=4" style={{ width: "300px", height: "40px" }} onClick={this.onSubmit} disabled={this.state.loadedModel === '' ? (true) : (false)}>Create a model</button>
                  </div>
                  <button id="publish" className="btn primary mt-3" style={{ width: "300px", height: "40px" }} data-toggle="modal" disabled={this.state.loadedModel === '' ? (true) : (false)} data-target="#myModal">Publish</button>
                </div>
              </div>
              <div className="col-md-9 admin-right-section" style={{ overflow: "auto", maxHeight: "900px" }}>
                <div className="col-md-12 mt-4">
                  <div className="row col-md-12">
                    {this.state.show ? (

                      <div style={{ overflow: "hidden" }}>
                        <div className="row col-md-3">
                          Training
                     <div className=" panel-body dropdown mt-4 mb-3 d-none d-md-flex d-lg-flex langDropdown" style={{ width: "320px" }}>
                            <span
                              className="mr-5" style={{ width: "320px", backgroundColor: "#656569" }}
                              href="#"
                              role="button"
                              id="dropdownRoleLink"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              {this.state.traindata}{" "}
                            </span>
                          </div>

                        </div>
                        <div className="row col-md-12">
                        </div>
                        <div className="row col-md-12 mt-3">
                          <div className="mt-4 ml-2 mr-3 dashboard-item bordered" style={{ height: "115px", width: "292px" }}>
                            <h6 className="mt-2 ml-3" style={{ fontStyle: "bold" }}>Entity evaluation</h6>
                            <div className="row col-md-12">
                              <div className="mt-1 col-md-4">Accuracy</div>
                              <div className="mt-1 col-md-4">f1-score</div>
                              <div className="mt-1 col-md-4">Precision</div>
                            </div>
                            <div className="row col-md-12">
                              <h4 className="mt-1 col-md-4">{this.state.entAccuracy}</h4>
                              <h4 className="mt-1 col-md-4">{this.state.entF1Score}</h4>
                              <h4 className="mt-1 col-md-4">{this.state.entPrecision}</h4>
                            </div>

                          </div>
                          <div className="mt-4 ml-2 mr-3 dashboard-item bordered" style={{ height: "115px", width: "292px" }}>
                            <h6 className="mt-2 ml-3">Intent evaluation</h6>
                            <div className="row col-md-12">
                              <div className="mt-1 col-md-4">Accuracy</div>
                              <div className="mt-1 col-md-4">f1-score</div>
                              <div className="mt-1 col-md-4">Precision</div>
                            </div>
                            <div className="row col-md-12">
                              <h4 className="mt-1 col-md-4">{this.state.intAccuracy}</h4>
                              <h4 className="mt-1 col-md-4">{this.state.intF1Score}</h4>
                              <h4 className="mt-1 col-md-4">{this.state.intPrecision}</h4>
                            </div>

                          </div>

                        </div>
                        <div className="row col-md-5 mt-3">
                          Notes
                     <input type="text" placeholder="type something. . ." className="col-md-12 mt-4 mr-5" style={{ border: 'grey', height: "80px", backgroundColor: 'rgba(0, 0, 0, 0.4)', width: "200px" }}>
                          </input>

                        </div>
                        {/* {this.state.intents.length > 10 ? ( */}
                          <div style={{ overflow: "hidden" }}>
                            <div className="col-md-1q mt-5 dashboard-item bordered ml-2 mr-4" style={{minHeight: "400px", minWidth:"700px", maxheight: "900px", maxWidth:"2200px" }}>
                              <i className="fa fa-ellipsis-v pull-right mr-4 mt-2" style={{ color: "grey" }}></i>
                              <div className="mt-1 ml-4" style={{ fontSize: "20px" }}>Confusion Matrix</div>
                              <table id="myTable" className="table-responsive{-sm}" style={{ marginTop: "10px", marginLeft: "30px" , marginRight:"35px", marginBottom:"50px"}}>
                                {this.state.confMat.map((rows, keys) => {
                                  var row = rows.map((cell, key) =>
                                    <td style={{}}><span className={cell == 0 ? ("Intent") : ("wrongIntent")} style={cell == 0 ? ({ width: this.state.cellWidth, height: this.state.cellHeight }) :
                                      ({ width: this.state.cellWidth, height: this.state.cellHeight, opacity: (cell * 10) + "%" })}
                                      aria-haspopup="false">{ }<span className="Tooltip" style={{opacity:"100%"}}>{cell+ " - X:" + this.state.intents[keys] + " Y:"+ this.state.intents[key]} </span></span></td>);
                                  return <tr>

                                    {row}
                                  </tr>;
                                })}
                              </table>
                            </div>
                          </div>
                        {/* <div style={{ overflow: "hidden" }}>
                          <div className="col-md-1q mt-5 dashboard-item bordered ml-2 mr-4" style={{ height: "348px", width: "1300px", overflow: "auto" }}>
                            <i className="fa fa-ellipsis-v pull-right mr-4 mt-2" style={{ color: "grey" }}></i>
                            <div className="mt-3 ml-4">Intent prediction confidence distribution</div>
                            <Bar

                              data={{

                                labels: [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00],
                                datasets: [
                                  {
                                    label: "hits",
                                    backgroundColor: '#4eb50d',
                                    data: this.state.hits
                                  },
                                  {
                                    label: "misses",
                                    backgroundColor: '#ea6361',
                                    data: this.state.misses
                                  }]
                              }
                              }
                              options={{
                                legend: {
                                  display: true,
                                  position: 'top'
                                },
                                scales: {
                                  yAxes: [{
                                    ticks: {
                                      fontColor: "white",
                                      display: true,
                                      min: 0,
                                      stepSize: 10,
                                      max: 100
                                    },
                                    scaleLabel: {
                                      fontColor: "white",
                                      display: true,
                                      labelString: 'No of samples'
                                    }

                                  }],
                                  xAxes: [{
                                    ticks: {
                                      fontColor: "white",
                                      display: true,
                                      min: 0.10,
                                      stepSize: 0.05,
                                      max: 1.00
                                    },
                                    scaleLabel: {
                                      fontColor: "white",
                                      display: true,
                                      labelString: 'Confidence'
                                    }

                                  }]
                                },
                                barValueSpacing: 20
                              }}
                            />
                          </div>
                        </div> */}
                        <ChatWidget {...this.props} bot={this.props.match.params.bot}></ChatWidget>
                      </div>) : (<div className="mt-5">
                        <div className="vertical-center d-none d-sm-block" id="emptyState">
                          <center>
                            <h3 className="pb-2">No model selected</h3>
                            <p className="col-7 pb-2 subText">
                              Please select a model from the left side to see its details here
                                    </p>

                            <div className="mt-5"><img src="/img/Model.svg" alt="empty activity"></img> </div>
                          </center>
                        </div></div>)}
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog" style={{ height: "442px", width: "836px" }}>
            <div className="modal-content" style={{ height: "442px", width: "836px" }}>

              <div className="modal-body" style={{ height: "442px", width: "836px", color: "rgb(53, 52, 61)" }}>
                <div className="ml-2 mt-3">
                  <p className="ml-2 mt-2" style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "24px" }}>Publish Models</p>
                </div>

                <div className="col-md-12 mt-4" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                  {/* Selected bot
                  <div className="row col-md-12 mt-2 ml-2" style={{ backgroundColor: "rgb(86, 83, 109)", height: "40px" }}>
                    <label className="roundSquares mt-3 ml-3" />
                    <input className="ml-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white" }} value={this.props.match.params.bot}>
                    </input>
                  </div> */}

                  {this.state.activeBots.includes(this.props.match.params.bot) ? (null) :
                    (<div>
                      {this.state.message ? (<React.Fragment>
                        <p className="ml-2" style={{ color: '#E83535', fontSize: "14px" }}>
                          New bot found. Please deploy it
                    </p>
                        {/* <div className="col-md-12 ml-2 mt-2" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                          <p className="ml-2 mt-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>Publish to</p>
                          <div className="row">
                            <span className={this.state.prodEnv ? ("badge badge-pill badge-secondary ml-2 mt-2 envSelected") :
                              ("badge badge-pill badge-secondary ml-3")} onClick={() => this.setState({
                                prodEnv: !this.state.prodEnv,
                                stagEnv: false,
                              })
                              } style={{ height: "25px", width: "100px", textAlign: "center" }}>Production</span>
                            <span className={this.state.stagEnv ? ("badge badge-pill badge-secondary ml-2 mt-2 envSelected") :
                              ("badge badge-pill badge-secondary ml-3")} onClick={() => this.setState({
                                stagEnv: !this.state.stagEnv,
                                prodEnv: false,
                              })} style={{ height: "25px", width: "100px", textAlign: "center", verticalAlign: "center" }}>Staging</span>
                            {/* <button className="btn btn-primary mt-2 ml-2" onClick={() => { this.deployBot(this.props.match.params.bot) }} disabled={!(this.state.stagenv || this.state.prodEnv)}>Activate bot</button> */}
                          {/* </div> */}

                        {/* </div> */}
                      </React.Fragment>) : (<React.Fragment>
                        {/* <p className="ml-2 mt-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>Publish to</p>
                        <div className="row">
                          <span className={this.state.prodEnv ? ("badge badge-pill badge-secondary ml-2 mt-2 envSelected") :
                            ("badge badge-pill badge-secondary ml-3")} onClick={() => this.setState({
                              prodEnv: !this.state.prodEnv,
                              stagEnv: false,
                            })
                            } style={{ height: "25px", width: "100px" }}>Production</span>
                          <span className={this.state.stagEnv ? ("badge badge-pill badge-secondary ml-2 mt-2 envSelected") :
                            ("badge badge-pill badge-secondary ml-3")} onClick={() => this.setState({
                              stagEnv: !this.state.stagEnv,
                              prodEnv: false,
                            })} style={{ height: "25px", width: "100px", textAlign: "center", verticalAlign: "center" }}>Staging</span>
                          {/* <button className="btn btn-primary mt-2 ml-2" onClick={() => { this.deployBot(this.props.match.params.bot) }} disabled={!(this.state.stagenv || this.state.prodEnv)}>Activate bot</button> */}
                        {/* </div> */}
                        </React.Fragment> 
                        )}
                    </div>)}
                </div>
                <div className="col-md-12 mt-3" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                <p className="ml-2 mt-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>Selected bot</p>
                  <div className="row col-md-12 mt-2 ml-2" style={{ backgroundColor: "rgb(86, 83, 109)", height: "40px",  width: "773px"}}>
                    <label className="roundSquares mt-3 ml-3" />
                    <input className="ml-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", paddingLeft:"10px" }} value={this.props.match.params.bot}>
                    </input>
                  </div>

                  <p className="ml-2 mt-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>Selected model</p>
                  <div className="row col-md-12 mt-2 ml-2" style={{ backgroundColor: "rgb(86, 83, 109)", height: "40px", width: "773px" }}>
                    <label className="roundSquaresactiveWhite mt-3 ml-3" />
                    <input className="ml-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", height: "40px", width: "265px", paddingLeft:"10px" }}
                      placeholder='version x' name="name" id="name" value={this.state.loadedModel} contentEditable="true" />
                    <div className="pull-right">
                      {/* <label className="pull-right" style={{color:"rgba(255, 255, 255, 0.4)"}}>uploaded 2m ago</label> */}
                    </div>
                  </div>

                {/* </div>
                <div className="col-md-12 mt-4" style={{ color: "rgba(255, 255, 255, 0.4)" }}> */}
                  <p className="ml-2 mt-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>Last published</p>
                  <div className=" row col-md-12 mt-2 ml-2" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", height: "40px", width: "773px" }}>
                    <label className="roundSquaresactive mt-3 ml-3" />
                    <label className="ml-3 mt-2" style={{ color: "rgba(255, 255, 255, 0.7)", paddingLeft:"10px" }}>{this.state.publishedVersions[0]}</label>
                    {/* <label className="col-md-4 pull-right" style={{color:"rgba(255, 255, 255, 0.4)"}}>Published on date</label> */}
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ height: "88px", width: "836px" }}>
                <button type="button" className="btn default" data-dismiss="modal">
                  Cancel
                      </button>
                <button type="button" className="ml-3 btn btn-primary" data-dismiss="modal" style={{ backgroundColor: "rgb(68, 72, 170)" }} onClick={this.onFormSubmit} 
                // disabled={false ? (true) : (false)}
                >Publish</button>
              </div>

            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default ModelPage;