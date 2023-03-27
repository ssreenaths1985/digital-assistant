import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../../common/components/BrandNavBar";
import HeaderNavBar from "../../../common/components/HeaderNavBar";
import SidebarComponent from "../../common/components/SidebarComponent";
import LocalizedStrings from "react-localization";
import { translations } from "../../../../translations.js";
import FilterListIcon from '@material-ui/icons/FilterList';
import { color, active, axisBottom } from "d3";
import $ from 'jquery';
let strings = new LocalizedStrings(translations);
let intents = [
  { key: '101', value: 'Intent 1' },
  { key: '102', value: 'Intent 2' },
  { key: '103', value: 'Intent 3' },
  { key: '104', value: 'Intent 4' },
  { key: '105', value: 'Intent 5' }];

let answers = [
  { key: '201', value: 'Blank' },
  {
    key: '202', value: 'Low confidence'

  }];

let confidence = [{}]

class ActionPage extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en", NoAnswerFilter: '', LeastConfidenceFilter: '', show: false, Filter: [{}], intent1: '', conf1: 0, intent2: '', conf2: 0 };
  }
  render() {

    var rows = document.querySelectorAll("#myTable tr");
    for (var i = 0; i < rows.length; i++) {
      rows[i].addEventListener('click', function () {
        [].forEach.call(rows, function (el) {
          el.classList.remove('active');
        }
        );
        this.className += 'active';
      }, false);
    }
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
          <BrandNavBar />
          <HeaderNavBar {...this.props} bot={this.props.match.params.bot} />
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-2 admin-left-section" id="leftbar" style={{ maxHeight: "980px" }}>
                <SidebarComponent {...this.props} />
              </div>
              <div className="col-md-8 admin-right-section" style={{ overflow: "auto", height: "", maxHeight: "930px" }}>
                <div className="row col-md-1q mt-5 dashboard-item bordered ml-2 mr-4">
                  <div className="row col-md-12">
                    <div className="col-md-10 mt-3">
                      <h4>No answers</h4>
                    </div>
                    <div className="col-md-2 mt-1 pull right">
                      <i className="fa fa-ellipsis-v pull-right"></i>
                    </div>
                  </div>
                  <div className=" row col-md-12 mt-3 dateFilterTextColor">
                    <div className=" col-md-7 mt-1 dateFilterTextColor">
                      <span
                        className="mr-5 dateFilterTextColor"
                        href="#"
                        // role="button"
                        id="dropdownRoleLink"
                        // data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {"Answer :Blank"}{" "}
                      </span>
                      <div className="dropdown-menu mr-9 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink">
                        {/* // onClick={this.handleLanguageChange} */}
                        <p className="dropdown-item dateFilterTextColor" href="#" value="Most Recent">
                          Most Recent
                        </p>
                      </div>
                    </div>
                    <div className=" col-md-3 mt-1 dateFilterTextColor">
                      {/* <span
                        className="mr-5 dateFilterTextColor"
                        href="#"
                        // role="button"
                        id="dropdownRoleLink"
                        // data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {"Answer :Blank"}{" "}
                      </span> */}
                    </div>
                    <div className="col-md-2">
                      <label
                        className="pull-right"
                        // role="button"
                        // data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <p className="pull-right"><FilterListIcon className="mr-3"></FilterListIcon> Add  Filters</p>
                      </label>
                      {/* <div className="dropdown-menu mr-9 cursorStyleOne smallDDMenu"aria-labelledby="dropdownRoleLink"> */}
                      {/* // onClick={this.handleLanguageChange} */}
                      {/* <p className="dropdown-item dateFilterTextColor" value="Intent" onClick={()=>{
                          this.setState({NoAnswerFilter:"Intent"})
                          this.setState({Filter:intents})
                        }}>
                         Intent
                        </p>
                        <p className="dropdown-item dateFilterTextColor" href="#" value="Answer status" onClick={()=>{
                          this.setState({NoAnswerFilter:"Answer status"})
                          this.setState({Filter:answers})
                        }}>
                        Answer status
                        </p>
                        <p className="dropdown-item dateFilterTextColor" href="#" value="Confidence"
                        onClick={()=>{
                          this.setState({NoAnswerFilter:"Confidence"})
                          this.setState({Filter:confidence})
                        }}>
                          Confidence
                        </p> */}
                      {/* </div> */}
                    </div>
                  </div>
                  <div className="row col-md-12 mt-4">
                    <div className="col-12">
                      <table className="table borderless conversation-list" id="myTable" style={{ color: '0.8px solid  rgba(255, 255, 255, 0.3)' }}>
                        <tbody>
                          <tr className="bottom">
                            <td className="white-70">Conversations</td>
                            <td className="white-70">Markings</td>
                            <td className="white-70">Intent</td>
                            <td className="white-70">Confidence</td>
                            <td className="white-70">Comment</td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "bot_challenge" })
                            this.setState({ intent2: "contact" })
                            this.setState({ conf1: 0.439 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>Who is Mahatma Gandhi?</td>
                            <td></td>
                            <td>bot_challenge</td>
                            <td><p className="ml-4">43 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "potato_founder" })
                            this.setState({ intent2: "sad" })
                            this.setState({ conf1: 0.188 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>Competence</td>
                            <td></td>
                            <td>potato_founder</td>
                            <td><p className="ml-4">18 %</p></td>
                            <td></td>
                          </tr>
                          {/* <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Get contact of Devendra</td>
                            <td>
                              <span className="profileCircle textColor text-uppercase" height="1px" width="1px">
                                IM
                              </span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Call Ajay</td>
                            <td>
                              <span className="profileCircle textColor text-uppercase" height="1px" width="1px">
                                AT
                              </span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Find the details  of archita</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Email id of raghav</td>
                            <td> 
                              <i className="fa fa-check"></i>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Find the details of Amit</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row col-md-1q mt-5 dashboard-item bordered ml-2 mr-4">
                  <div className="row col-md-12">
                    <div className="col-md-10 mt-3">
                      <h4>Least Confidence</h4>
                    </div>
                    <div className="col-md-2 mt-1 pull right">
                      <i className="fa fa-ellipsis-v pull-right"></i>
                    </div>
                  </div>
                  <div className=" row col-md-12 mt-3 dateFilterTextColor">
                    <div className=" col-md-8 mt-1 dateFilterTextColor">
                      <span
                        className="mr-5 dateFilterTextColor"
                        href="#"

                        id="dropdownRoleLink"

                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {"Confidence-low to high"}{" "}
                      </span>
                      <div className="dropdown-menu mr-9 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink">
                        {/* // onClick={this.handleLanguageChange} */}
                        <p className="dropdown-item dateFilterTextColor" href="#" value="Confidence-low to high">
                          Confidence-low to high
                        </p>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="pull-right" href="#" value="Answer:blank" aria-labelledby="dropdownRoleLink">
                        <span
                          className="pull-right"
                          role="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {this.state.LeastConfidenceFilter}{" "}
                        </span>
                        <div className="dropdown-menu mr-9 cursorStyleOne smallDDMenu pull-right" aria-labelledby="dropdownRoleLink">

                          {this.state.Filter.map(function (data, key) {
                            return (
                              <p className="dropdown-item dateFilterTextColor" href="#" value="Answer status" key={key} value={data.key}>{data.value}</p>)
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <label
                        className="pull-right"
                        // role="button"
                        // data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <p className="pull-right"><FilterListIcon className="mr-3"></FilterListIcon> Add   Filters</p>
                      </label>
                    </div>
                  </div>
                  <div className="row col-md-12 mt-4">
                    <div className="col-12">
                      <table className="table borderless conversation-list">
                        <tbody>
                          <tr className="bottom">
                            <td className="white-70">Conversations</td>
                            <td className="white-70">Markings</td>
                            <td className="white-70">Intent</td>
                            <td className="white-70">Confidence</td>
                            <td className="white-70">Comment</td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "potato_founder" })
                            this.setState({ intent2: "sad" })
                            this.setState({ conf1: 0.188 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>Competence</td>
                            <td></td>
                            <td>potato_founder</td>
                            <td><p className="ml-4">18 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "bot_challenge" })
                            this.setState({ intent2: "contact" })
                            this.setState({ conf1: 0.439 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>Who is Mahatma Gandhi?</td>
                            <td></td>
                            <td>bot_challenge</td>
                            <td><p className="ml-4">43 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "how_you" })
                            this.setState({ intent2: "sad" })
                            this.setState({ conf1: 0.518 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>what all do you know</td>
                            <td></td>
                            <td>how_you</td>
                            <td><p className="ml-4">51 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "bench" })
                            this.setState({ intent2: "how_you" })
                            this.setState({ conf1: 0.522 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>Bench</td>
                            <td></td>
                            <td>bench</td>
                            <td><p className="ml-4">52 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "how_you" })
                            this.setState({ intent2: "sad" })
                            this.setState({ conf1: 0.775 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>how can you help me</td>
                            <td></td>
                            <td>how_you</td>
                            <td><p className="ml-4">77 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "Project_management" })
                            this.setState({ intent2: "skills" })
                            this.setState({ conf1: 0.831 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>Key projects</td>
                            <td></td>
                            <td>Project_management</td>
                            <td><p className="ml-4">83 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "Project_management" })
                            this.setState({ intent2: "skills" })
                            this.setState({ conf1: 0.831 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>Key projects</td>
                            <td></td>
                            <td>Project_management</td>
                            <td><p className="ml-4">83 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "Project_management" })
                            this.setState({ intent2: "skills" })
                            this.setState({ conf1: 0.831 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>Key projects</td>
                            <td></td>
                            <td>skills</td>
                            <td><p className="ml-4">83 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "greet" })
                            this.setState({ intent2: "how_you" })
                            this.setState({ conf1: 0.984 })
                            this.setState({ conf2: 0.783 })

                          }}>
                            <td>hi</td>
                            <td></td>
                            <td>greet</td>
                            <td><p className="ml-4">98 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "contact" })
                            this.setState({ intent2: "clients" })
                            this.setState({ conf1: 0.984 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>show mw the contact details of vijay</td>
                            <td></td>
                            <td>contact</td>
                            <td><p className="ml-4">98 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "contact" })
                            this.setState({ intent2: "clients" })
                            this.setState({ conf1: 0.984 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>show mw the contact details of vijay</td>
                            <td></td>
                            <td>contact</td>
                            <td><p className="ml-4">98 %</p></td>
                            <td></td>
                          </tr>
                          <tr onClick={() => {
                            this.setState({ show: true })
                            this.setState({ intent1: "clients" })
                            this.setState({ intent2: "contact" })
                            this.setState({ conf1: 1.00 })
                            this.setState({ conf2: 0.234 })


                          }}>
                            <td>/clients</td>
                            <td></td>
                            <td>clients</td>
                            <td><p className="ml-4">100 %</p></td>
                            <td></td>
                          </tr>
                          {/* <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Show mw the correct details of the Ajay</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr >
                          <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Get contact of Devendra</td>
                            <td>
                              <span className="profileCircle textColor text-uppercase" height="1px" width="1px">
                                IM
                              </span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Call Ajay</td>
                            <td>
                              <span className="profileCircle textColor text-uppercase" height="1px" width="1px">
                                AT
                              </span>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Find the details  of archita</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Email id of raghav</td>
                            <td> 
                              <i className="fa fa-check"></i>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr onClick={()=>{
                          this.setState({show:true})
                        }}>
                            <td>Find the details of Amit</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-md-2 admin-left-section" id="leftbar" style={{ borderLeft: "0.8px solid  rgba(255, 255, 255, 0.1)", maxHeight: "980px" }}>
                {this.state.show ? (
                  <div>

                    <div className="box">
                      <div className="col-md-6 mt-3 " >
                        <p style={{ marginBottom: "3px" }}>{this.state.intent1}</p></div>
                      <div className={this.state.conf1 >= 0.50 ? ("col-md-6 success pull-right") : ("col-md-6 danger pull-right")} >{this.state.conf1}</div>
                    </div>
                    <div className="box">
                      <div className="col-md-6 mt-3 mb-1 bottom">
                        <p style={{ marginBottom: "3px" }}>{this.state.intent2}</p></div>
                      <div className={this.state.conf2 >= 0.50 ? ("col-md-6 success pull-right  mb-1 bottom") : ("col-md-6 danger pull-right  mb-1 bottom")}>{this.state.conf2}</div>
                    </div>
                    <div className="panel panel-default col-md-12 mt-4 bottom">
                      <div className="panel-heading">
                        <p data-toggle="collapse" href="#collapse1">Intent Mismatch <i className="fa fa-plus pull-right" style={{ color: "rgba(192,192,192,0.5)" }}></i></p>
                      </div>
                      <div id="collapse1" className="panel-collapse collapse">
                        <div className=" panel-body dropdown mt-4 mb-3 d-none d-md-flex d-lg-flex langDropdown" style={{ width: "320px" }}>
                          <span
                            className="dropdown-toggle mr-5" style={{ width: "320px" }}
                            href="#"
                            role="button"
                            id="dropdownRoleLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {"Intent1"}{" "}
                          </span>
                          <div className="dropdown-menu mr-5 cursorStyleOne smallDDMenu pull-right" aria-labelledby="dropdownRoleLink" style={{ width: "250px" }}>
                            <p className="dropdown-item dateFilterTextColor" href="#" value="Intent1" style={{ width: "320px" }}>
                              Intent1
                          </p>
                          </div>
                        </div></div></div>
                    <div className="panel panel-default col-md-12 mt-4 bottom">
                      <div className="panel-heading">
                        <p data-toggle="collapse" href="#collapse2">Add to dataset <i className="fa fa-plus pull-right" style={{ color: "rgba(192,192,192,0.5)" }} ></i></p>



                      </div>
                      <div id="collapse2" className="panel-collapse collapse">
                        <div className=" panel-body dropdown mt-4 mb-3 d-none d-md-flex d-lg-flex langDropdown">
                          <span
                            width="full"
                            className="dropdown-toggle mr-5"
                            href="#"
                            role="button"
                            id="dropdownRoleLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {"Dataset 2"}{" "}
                          </span>
                          <div className="dropdown-menu mr-5 cursorStyleOne smallDDMenu" aria-labelledby="dropdownRoleLink">
                            <p className="dropdown-item dateFilterTextColor" href="#" value="Dataset 2">
                              Dataset 2
                          </p>
                          </div>
                        </div></div></div>
                    <div className="panel panel-default col-md-12 mt-4 bottom">
                      <div className="panel-heading">
                        <p data-toggle="collapse" href="#collapse3">New intent required<i className="fa fa-plus pull-right" style={{ color: "rgba(192,192,192,0.5)" }}></i></p>
                      </div>
                      <div id="collapse3" className="panel-collapse collapse">
                        <div className="panel-body"></div></div></div>
                  </div>
                ) : (null)}

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ActionPage;
