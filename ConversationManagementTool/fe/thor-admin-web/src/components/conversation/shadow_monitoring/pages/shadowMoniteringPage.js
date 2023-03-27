import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../../common/components/BrandNavBar";
import HeaderNavBar from "../../../common/components/HeaderNavBar";
import SidebarComponent from "../../common/components/SidebarComponent";
import LocalizedStrings from "react-localization";
import { translations } from "../../../../translations.js";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { color } from "d3";
import { green, grey } from "@material-ui/core/colors";

let strings = new LocalizedStrings(translations);

class LogPage extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" ,clickedCheck1:false , clickedClear1:false , clickedCheck2:false , clickedClear2:false , clickedCheck3:false , clickedClear3:false
    , clickedCheck4:false , clickedClear4:false
    , clickedCheck5:false , clickedClear5:false
    , clickedCheck6:false , clickedClear6:false
    , clickedCheck7:false , clickedClear7:false
    , clickedCheck8:false , clickedClear8:false} ;
  }

  render() {
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
              <div className="col-md-2 admin-left-section">
                <SidebarComponent {...this.props} />
              </div>
              <div className="col-md-8 admin-right-section">
                <div className="row col-md-12 mt-5">
                  <div className="col-md-12">
                    <div className="dropdown mr-5 mt-1 d-none d-md-flex d-lg-flex langDropdown">
                      <span
                        className="dropdown-toggle mr-5"
                        href="#"
                        role="button"
                        id="dropdownRoleLink"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {"Most Recent"}{" "}
                      </span>
                      <div
                        className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                        aria-labelledby="dropdownRoleLink"
                        // onClick={this.handleLanguageChange}
                      >
                        <p
                          className="dropdown-item dateFilterTextColor"
                          href="#"
                          value="Most Recent"
                        >
                          Most Recent
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row col-md-12">
                    <div className="col-md-4">
                      <div className="form-group has-search">
                        <i className="material-icons form-control-feedback">
                          search
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
                  <div className="row col-md-12 mt-4">
                    <div className="col-12">
                      <table className="table borderless conversation-list">
                        <tbody>
                          <tr>
                            <td className="white-70">Conversations</td>
                            <td className="white-70">Live</td>
                            <td className="white-70">Shadow</td>
                          </tr>
                          <tr>
                            <td>Show mw the contact details of the Ajay</td>
                            <td>
                            <button className="btn intent-action" disabled={this.state.clickedClear1 ? (true) : (false)} onClick={() => {
                                this.setState({clickedCheck1:!this.state.clickedCheck1})}}
                              style={this.state.clickedCheck1 ? ({backgroundColor:"green"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <CheckIcon style={this.state.clickedCheck1 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              <button className="btn intent-action" disabled={this.state.clickedCheck1 ? (true) : (false)} onClick={() => {
                                this.setState({clickedClear1:!this.state.clickedClear1})}}
                              style={this.state.clickedClear1 ? ({backgroundColor:"red"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <ClearIcon style={this.state.clickedClear1 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              contact
                            </td>
                            <td>
                            <button className="btn intent-action" disabled={this.state.clickedClear2 ? (true) : (false)} onClick={() => {
                                this.setState({clickedCheck2:!this.state.clickedCheck2})}}
                              style={this.state.clickedCheck2 ? ({backgroundColor:"green"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <CheckIcon style={this.state.clickedCheck2 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              <button className="btn intent-action" disabled={this.state.clickedCheck2 ? (true) : (false)} onClick={() => {
                                this.setState({clickedClear2:!this.state.clickedClear2})}}
                              style={this.state.clickedClear2 ? ({backgroundColor:"red"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <ClearIcon style={this.state.clickedClear2 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              contact
                            </td>
                          </tr>
                          <tr>
                            <td>Find details of Amit</td>
                            <td>
                            <button className="btn intent-action" disabled={this.state.clickedClear3 ? (true) : (false)} onClick={() => {
                                this.setState({clickedCheck3:!this.state.clickedCheck3})}}
                              style={this.state.clickedCheck3 ? ({backgroundColor:"green"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <CheckIcon style={this.state.clickedCheck3 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              <button className="btn intent-action" disabled={this.state.clickedCheck3 ? (true) : (false)} onClick={() => {
                                this.setState({clickedClear3:!this.state.clickedClear3})}}
                              style={this.state.clickedClear3 ? ({backgroundColor:"red"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <ClearIcon style={this.state.clickedClear3 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                             contact
                            </td>
                            <td>
                            <button className="btn intent-action" disabled={this.state.clickedClear4 ? (true) : (false)} onClick={() => {
                                this.setState({clickedCheck4:!this.state.clickedCheck4})}}
                              style={this.state.clickedCheck4 ? ({backgroundColor:"green"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <CheckIcon style={this.state.clickedCheck4 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              <button className="btn intent-action" disabled={this.state.clickedCheck4 ? (true) : (false)} onClick={() => {
                                this.setState({clickedClear4:!this.state.clickedClear4})}}
                              style={this.state.clickedClear4 ? ({backgroundColor:"red"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <ClearIcon style={this.state.clickedClear4 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                            project_managers
                            </td>
                          </tr>
                          <tr>
                            <td>hey hi, who are you?</td>
                            <td>
                            <button className="btn intent-action" disabled={this.state.clickedClear5 ? (true) : (false)} onClick={() => {
                                this.setState({clickedCheck5:!this.state.clickedCheck5})}}
                              style={this.state.clickedCheck5 ? ({backgroundColor:"green"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <CheckIcon style={this.state.clickedCheck5 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              <button className="btn intent-action" disabled={this.state.clickedCheck5 ? (true) : (false)} onClick={() => {
                                this.setState({clickedClear5:!this.state.clickedClear5})}}
                              style={this.state.clickedClear5 ? ({backgroundColor:"red"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <ClearIcon style={this.state.clickedClear5 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              greet
                            </td>
                            <td>
                            <button className="btn intent-action" disabled={this.state.clickedClear6 ? (true) : (false)} onClick={() => {
                                this.setState({clickedCheck6:!this.state.clickedCheck6})}}
                              style={this.state.clickedCheck6 ? ({backgroundColor:"green"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <CheckIcon style={this.state.clickedCheck6 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              <button className="btn intent-action" disabled={this.state.clickedCheck6 ? (true) : (false)} onClick={() => {
                                this.setState({clickedClear6:!this.state.clickedClear6})}}
                              style={this.state.clickedClear6 ? ({backgroundColor:"red"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <ClearIcon style={this.state.clickedClear6 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              bot_challenge
                            </td>
                          </tr>
                          <tr>
                            <td>get me the details of team project-x</td>
                            <td>
                            <button className="btn intent-action" disabled={this.state.clickedClear7 ? (true) : (false)} onClick={() => {
                                this.setState({clickedCheck7:!this.state.clickedCheck7})}}
                              style={this.state.clickedCheck7 ? ({backgroundColor:"green"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <CheckIcon style={this.state.clickedCheck7 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              <button className="btn intent-action" disabled={this.state.clickedCheck7 ? (true) : (false)} onClick={() => {
                                this.setState({clickedClear7:!this.state.clickedClear7})}}
                              style={this.state.clickedClear7 ? ({backgroundColor:"red"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <ClearIcon style={this.state.clickedClear7 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              contact
                            </td>
                            <td>
                            <button className="btn intent-action" disabled={this.state.clickedClear8 ? (true) : (false)} onClick={() => {
                                this.setState({clickedCheck8:!this.state.clickedCheck8})}}
                              style={this.state.clickedCheck8 ? ({backgroundColor:"green"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <CheckIcon style={this.state.clickedCheck8 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              <button className="btn intent-action" disabled={this.state.clickedCheck8 ? (true) : (false)} onClick={() => {
                                this.setState({clickedClear8:!this.state.clickedClear8})}}
                              style={this.state.clickedClear8 ? ({backgroundColor:"red"}) : ({backgroundColor:'rgba(255, 255, 255, 0.05)'})}>
                                <ClearIcon style={this.state.clickedClear8 ? ({color: 'rgb(255, 255, 255)'}) : ({color: 'rgba(255, 255, 255, 0.16)'})} fontSize="30px"/>
                              </button>
                              project_details
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LogPage;