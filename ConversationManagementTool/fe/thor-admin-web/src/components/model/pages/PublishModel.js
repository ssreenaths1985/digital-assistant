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
import CheckIcon from '@material-ui/icons/Check';
import { BotService } from "../../../services/bot.service";
import ChatWidget from "./ChatWidget"


var mheight;
var mwidth;

class PublishModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '', version: '', IntentReports: [], EntityReports: [], confMat: [], intents: [], models: [], misses: [], hits: [], loadedModel: '',cellWidth: '',
      cellHeight: '',prodEnv: false, stagenv: false, show: false, trainingDatasets: [], traindata: '', publishedVersions: [] ,publishedEnvs:[], bot: '', message: true,
      appendModel: '', all: {}, modelsMap: {}, models: [], intAccuracy:'', intF1Score: '', intPrecision:'', EntAccuracy:'', EntF1Score:'', EntPrecision:'',
      showDraft: true, newModel: '', completeReports: false, activeBots: [], allBots: []
    }
  }

  handleClick = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });

  }

  getModels() {
    ModelService.getModels(this.props.match.params.bot).then((response) => {
      if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        this.setState({ all: response.payload });
        this.setState({ models: this.state.all[this.props.match.params.name].reverse() })
      }
      else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  }
  onFormSubmit = (event) => {
    var env = '';
    // { this.state.prodEnv ? (env = 'production') : (env = 'staging') }
    let deployModel = [];
    deployModel.push(this.props.match.params.bot)
    deployModel.push(this.props.match.params.name)
    deployModel.push(this.state.loadedModel)
    deployModel.push("Vega")
    ModelService.loadModel(deployModel).then((response) => {
      if (
        response && response.status && response.status.code &&
        response.status.code === APP.CODE.SUCCESS
      ) {
        Notify.success("Model " + this.state.loadedModel + " published successfully")
      }
      else {
        Notify.error("Error in the api call");
      }
    });
  }
  onSubmit = () => {
    this.props.history.push("/models/publishModel/" + this.props.match.params.bot + "/" + this.state.traindata + "/testModel/" + this.props.match.params.username);
  }
  async initialList() {
    await ModelService.getPublishedModels(this.props.match.params.bot).then((response) => {
      if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        this.setState({ all: response.payload });
        this.setState({ publishedVersions:Object.keys(response.payload)})
        this.setState({ publishedEnvs:Object.values(response.payload)})
      }
      else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
    this.setState({ traindata: this.props.match.params.name });
    this.getModels()
    let data = [];
    data.push(this.props.match.params.bot);
    data.push(this.props.match.params.name);
    await DatasetService.train(data).then((response) => {
      if(response != 'Error in api call')
      {
        if (response && response.status && response.status.code === APP.CODE.SUCCESS)
        {
          this.setState({ showDraft: false }) 
          Notify.success(response.payload);
          ModelService.getModels(this.props.match.params.bot).then((response) => {
            if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
              this.setState({ all: response.payload });
              this.setState({ models: this.state.all[this.props.match.params.name].reverse() })
              if(this.state.show)
              {

              }
              else
              {
                this.loadModel(this.state.models[0])
              }
            }
            else {
              Notify.error(response.payload);
            }
          });
        }
        else
        {
          this.setState({ showDraft: false }) 
          Notify.success(response.payload);
          ModelService.getModels(this.props.match.params.bot).then((response) => {
            if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
              this.setState({ all: response.payload });
              this.setState({ models: this.state.all[this.props.match.params.name].reverse() })
            }
            else {
              Notify.error(response && response.data.statusInfo.errorMessage);
            }
          });
          this.setState({ showDraft: false }) 
        }
      }
      else 
      {
        Notify.error('RASA ERROR! could not create a training model');
        this.getModels()
        this.setState({ showDraft: false })
      }

    });

  }


  componentDidMount() {
    this.initialList()
  }
  loadModel(model) {
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
    loadModel.push(this.props.match.params.name)
    loadModel.push(model)
    loadModel.push("sandbox")
    ModelService.loadModel(loadModel).then((response) => {
      if (
        response && response.status && response.status.code &&
        response.status.code === APP.CODE.SUCCESS
      ) {
        Notify.success("Model " + model + " loaded successfully")
        var modelName = (this.state.loadedModel.length) - 7;
        var index = this.state.loadedModel.substring(0, modelName);
        this.setState({ appendModel: index });
        this.getReports(loadModel);

      }
      else {
        Notify.error("Error in the api call");
      }
    });
  }


  getReports = (model) => {
    ModelService.evaluateModel(model).then((response) => {
      if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        ReportService.getReports(model).then((response) => {
          if (response && response.status.code === APP.CODE.SUCCESS) {
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
                mwidth = this.state.intents.length * 100 + 550;
                if(mwidth <= 1700)
                {
                  var awidth = mwidth - 500
                  this.setState({ cellWidth: awidth / this.state.intents.length })
                }
                else
                {
                  this.setState({ cellWidth: 1000 / this.state.intents.length })
                }
                mheight = this.state.intents.length * 50 + 350;
                if(mheight <= 700)
                {
                  var aheight = mheight - 300
                  this.setState({ cellHeight:  aheight/ this.state.intents.length })
                }
                else
                {
                  this.setState({ cellHeight: 700 / this.state.intents.length })
                }
                this.setState({ showDraft: false }) 
                this.setState({show:true})
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

        // // ReportService.getHistogram(evaluateModel).then((response) => {
        // //   if (
        // //     response &&
        // //     response.status.code === APP.CODE.SUCCESS
        // //   ) {
        // //     this.setState({ hits: Object.values(response.payload.hits) });
        // //     this.setState({ misses: Object.values(response.payload.misses) });

        // //   } else {
        // //     Notify.error(response && response.data.statusInfo.errorMessage);
        // //   }
        // // });
        // // Notify.success("Evaluation reports for model " + model + " ready")

      }
      else {
        Notify.error(response.payload);
      }
    });
  }
  deployBot = (bot) => {
    setTimeout(() => {
      Notify.success("Please wait! The bot is getting published. You will be notified once its done")
    }, 4000)
    var env = '';
    { this.state.prodEnv ? (env = 'production') : (env = 'staging') }
    var data = [];
    data.push(bot);
    data.push(this.state.traindata)
    data.push(this.state.loadedModel);
    data.push(env)
    BotService.deployBot(data).then((response) => {

      if (response && response.code === APP.CODE.SUCCESS) {
        Notify.success(response.payload);
        this.setState({ message: false })
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
  render() {
    return (

      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
        <BrandNavBar bot={this.props.match.params.bot}  username={this.props.match.params.username}/>
          <HeaderNavBar {...this.props} bot={this.props.match.params.bot} username={this.props.match.params.username} />
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-3 admin-left-section" id="leftbar" style={{ maxHeight: "930px", maxWidth: "340px" }}>
                <div className="col-md-12">
                  <h5 className="mt-5 ml-3">Published</h5>
                  <div className="row col-md-12 mt-3 ">
                    {this.state.publishedVersions.map((models, key) => (

                      <div className={`row col-md-12 mt-2 ${this.state.loadedModel === models
                        ? "active"
                        : ""
                        }`} style={{ paddingLeft: "0px", paddingRight: "0px", width: "250px" }}>

                        <label className="roundSquares mt-2 ml-3 buttons" className={`roundSquares mt-2 ml-3 buttons ${this.state.loadedModel === models
                          ? "roundSquaresactive"
                          : ""
                          }`} />
                        <label className="ml-3 mt-1" onClick={
                          () => {
                            if (models)
                              this.loadExistingModel(models);
                            this.setState({ loadedModel: models })

                          }
                        }>{models}</label>
                      </div>



                    ))}
                    <div className=" row col-md-12 mt-2" >
                      <HistoryIcon></HistoryIcon>
                      <label className="ml-3 mt-1">show archives</label>
                    </div>
                  </div>

                </div>
                <div className="col-md-12">
                  <h5 className="mt-5 ml-3">Models</h5>
                  <div className="row col-md-12 mt-3">
                    {this.state.showDraft ? (<div className="row col-md-12 mt-3 ">

                      <div className=" row col-md-12 mt-2 active" style={{ paddingLeft: "0px", paddingRight: "0px", width: "290px" }}>
                        <label className="roundSquaresactiveWhite mt-2 ml-3" />
                        <label className="ml-3 mt-1" onClick={() => {
                          this.setState({ show: false })
                          this.setState({ loadedModel: "Draft" })
                        }}>Draft</label>
                        <label className="pull-right ml-4"><img src="/img/Loading_animation (1).svg" alt="empty activity"></img></label>
                      </div>
                      {this.state.models.map((models, key) => (

                        <div className={`row col-md-12 mt-2 ${this.state.loadedModel === models
                            ? "active"
                            : ""
                          }`} style={{ paddingLeft: "0px", paddingRight: "0px", width: "250px" }}>

                          <label className="roundSquares mt-2 ml-3 buttons" className={`roundSquares mt-2 ml-3 buttons ${this.state.loadedModel === models
                              ? "roundSquaresactiveWhite"
                              : ""
                            }`} />
                          <label className="ml-3 mt-1" onClick={
                            () => {
                              if (models)
                              // this.props.history.push("/models/" + this.props.match.params.bot + "/undefined/" + this.props.match.params.username);
                              this.loadModel(models);
                              this.setState({ loadedModel: models })
  
                            }
                          }>{models}</label>
                        </div>



                      ))}
                    </div>) : (<div>
                      {this.state.models.map((models, key) => (

                        <div className={`row col-md-12 mt-2 ${this.state.loadedModel === models
                            ? "active"
                            : ""
                          }`} style={{ paddingLeft: "0px", paddingRight: "0px", width: "290px" }}>

                          <label className="roundSquares mt-2 ml-3 buttons" className={`roundSquares mt-2 ml-3 buttons ${this.state.loadedModel === models
                              ? "roundSquaresactiveWhite"
                              : ""
                            }`} />
                          <label className="ml-3 mt-1" onClick={
                            () => {
                              if (models)
                              // this.props.history.push("/models/" + this.props.match.params.bot + "/undefined/" + this.props.match.params.username);
                                // this.setState({ show: true })
                                this.loadModel(models);
                                this.setState({ loadedModel: models })
    

                            }
                          }>{models}</label>
                          {key === 0 ? (<label className="pull-right ml-4"><CheckIcon color="white" /></label>) : (null)}
                        </div>



                      ))}
                    </div>)}



                  </div>


                </div>
                <div className="col-md-12 mt-1000 dashboard-item1 push-bottom" style={{ height: "146px" }}>
                  <div className="mt-3">
                    <button className="btn default mt=4" style={{ width: "300px", height: "40px" }} onClick={this.onSubmit} disabled={this.state.loadedModel === '' ? (true) : (false)}>Create a model</button>
                  </div>
                  <button id="publish" className="btn primary mt-3" style={{ width: "300px", height: "40px" }} data-toggle="modal" data-target="#myModal">Publish</button>
                </div>
              </div>
              <div className="col-md-9 admin-right-section" style={{overflow: "auto", maxHeight: "930px" }}>
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
                        <ChatWidget {...this.props} activeBots={this.state.activeBots}></ChatWidget>
                      </div>) : (<div className="mt-5"><div className="vertical-center d-none d-sm-block" id="emptyState">
                        <center>
                          <h3 className="pb-2">THOR is working its magic !</h3>
                          <p className="col-8 pb-2" style={{ color:'rgba(255, 255, 255, 0.7)'}}>
                            The model matrix is being generated. Please wait a few seconds..
                                    </p>
                          <div className="shapeshifter play" style={{ backgroundImage: "url(/img/sprite_30fps.svg)" }}></div>
                        </center>
                      </div></div>)}

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-body" style={{ height: "450px", color: "rgb(53, 52, 61)" }}>
                <h5 className="ml-2 mt-3">Publish models</h5>
                <div className="col-md-12 mt-4" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                  Selected bot
                  <div className="row col-md-12 mt-2 ml-2" style={{ backgroundColor: "rgb(86, 83, 109)", height: "40px" }}>
                    <label className="roundSquares mt-3 ml-3" />
                    <input className="ml-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white",paddingLeft:"10px"}} value={this.props.match.params.bot}>
                    </input>
                  </div>
{/* 
                  {this.state.activeBots.includes(this.props.match.params.bot) ? (null) :
                    (<div>
                        {this.state.message ? (<React.Fragment>
                    <p className="ml-2" style={{ color: '#E83535', fontSize: "14px" }}>
                      New bot found. deploy the bot
                    </p>
                    {/* <div className="col-md-12 ml-1 mt-2" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      {/* Publish to */}
                      {/* <div className="row">
                        <span className={this.state.prodEnv ? ("badge badge-pill badge-secondary ml-2 mt-2 envSelected") :
                          ("badge badge-pill badge-secondary ml-2 mt-2")} onClick={() => this.setState({
                            prodEnv: !this.state.prodEnv,
                            stagEnv: false,
                          })
                          } style={{ height: "25px", width: "100px" }}>Production</span>
                        <span className={this.state.stagEnv ? ("badge badge-pill badge-secondary ml-2 mt-2 envSelected") :
                          ("badge badge-pill badge-secondary ml-2 mt-2")} onClick={() => this.setState({
                            stagEnv: !this.state.stagEnv,
                            prodEnv: false,
                          })} style={{ height: "25px", width: "100px", textAlign: "center", verticalAlign: "center" }}>Staging</span>
                        <button className="btn btn-primary mt-2 ml-2" onClick={() => { this.deployBot(this.props.match.params.bot) }} disabled={!(this.state.stagenv || this.state.prodEnv)}>Activate bot</button>
                      </div>

                    </div>  */}
                  {/* </React.Fragment>) : (
                    null
                  // <p className="ml-2" style={{ color: '#7FFF00', fontSize: "14px" }}>
                  //   Bot is active !
                  // </p>
                  )}
                    </div>)} */}

                </div>
                <div className="col-md-12 mt-3" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                  Selected model
                    <div className="row col-md-12 mt-2 ml-2" style={{ backgroundColor: "rgb(86, 83, 109)", height: "40px" }}>
                    <label className="roundSquaresactiveWhite mt-3 ml-3" />
                    <input className="ml-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", paddingLeft:"10px"}} placeholder='  version x' name="name" id="name" value={this.state.loadedModel}>
                    </input>
                  </div>

                </div>
                <div className="col-md-12 mt-4" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                  Last published
                    <div className=" row col-md-12 mt-2 ml-2" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", height: "40px" }}>
                    <label className="roundSquaresactive mt-3 ml-3" />
                    <label className="ml-3 mt-2" style={{ color: "rgba(255, 255, 255, 0.7)", paddingLeft:"10px"}}>{this.state.publishedVersions[0]}</label>
                  </div>

                </div>
              </div>
              <div className="modal-footer">
              <button type="button" className="btn default" data-dismiss="modal">
                       Cancel
                      </button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.onFormSubmit}>Publish</button>
              </div>

            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default PublishModel;

