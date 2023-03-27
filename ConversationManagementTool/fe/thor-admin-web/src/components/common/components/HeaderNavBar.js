import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import * as moment from "moment";
import { UserService } from "../../../services/user.service";
import { defaults } from "react-chartjs-2";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";
import { APP } from "../../../constants"
import Notify from "../../../helpers/notify";
import { BotService } from "../../../services/bot.service";
import AddIcon from '@material-ui/icons/Add';

/**
 * Header Navbar Component
 * Holds menus and placed after BrandNavBar component
 */

let strings = new LocalizedStrings(translations);

class HeaderNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
      active: false,
      currentDate: "",
      currentUser: "",
      theme: "",
      currentTheme: "",
      genAvatar: "",
      colorTrigger: "",
      desc: '',
      newBot: '',
      bot: this.props.bot,
      bots: [],
      dataset: 'choose'
    };
    // this.getCurrentDate = this.getCurrentDate.bind(this);
    // this.logout = this.logout.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }
  componentDidMount() {
    BotService.getBots().then((response) => {
      if (response && response === 403)
      {
        Notify.error('Access Denied !');
      } 
      else if(response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
      {
        this.setState({ bots: response.payload });
        this.setState({ currentUser: this.props.match.params.username });
      }
      else {
        Notify.error('Error in the api call');
      }
    });

    if (localStorage.getItem("language")) {
      this.setState({
        language: localStorage.getItem("language")
      });
    }

    localStorage.setItem("currentTheme" ,"Dark theme");
    localStorage.getItem("currentTheme") === "Dark theme"
      ? this.setState(
        { theme: "dark", currentTheme: "Light theme", colorTrigger: true },
        () => {
          document.documentElement.setAttribute(
            "data-theme",
            this.state.theme
          );
        }
      )
      : this.setState(
        { theme: "light", currentTheme: "Dark theme", colorTrigger: false },
        () => {
          document.documentElement.setAttribute(
            "data-theme",
            this.state.theme
          );
        }
      );
    // this.setState({
    //   theme: 'light',
    //   currentTheme: 'Dark theme'
    // }, () => {document.documentElement.setAttribute("data-theme", this.state.theme)});

    // this.getCurrentDate();
  }

  onBotClick = (evt) => {
    evt.preventDefault();
    BotService.createBot(this.state.newBot).then((response) => {
      if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS) {
        this.setState({bot : this.state.newBot})
        Notify.success(response && response.payload);
        BotService.getBots().then((response) => {
          if (response && response === 403)
          {
            Notify.error('Access Denied !');
          } 
          else if(response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS){
            this.setState({ bots: response.payload });
            this.props.history.push("/conversations/data-sets/" + this.state.newBot + "/training/" + this.props.match.params.username)
            this.props.manageData(this.state.newBot)
            this.setState({newBot : ''})
           
          }
          else
          {
            Notify.error('Error in the api call');
          }
        });

      }
      else {
        Notify.error(response && response.payload);
      }
    });
  }

  handleClick = event => {
    this.setState({
      [event.target.name]: event.target.value
    })

  }

  /**
   * Function to get current date, year, month and
   * converting those into the required format
   * using moment.js
   */
  // async getCurrentDate() {
  //   let date = new Date();
  //   await this.setState({
  //     currentDate: moment(date).format("dddd, Do MMMM YYYY")
  //   });
  //   let userDetails = localStorage.getItem("user");
  //   userDetails = JSON.parse(userDetails);
  //   let userName = userDetails.username;
  //   let name = userName.split("@");
  //   this.setState(
  //     {
  //       currentUser: name[0]
  //     },
  //     () => this.nameAvatar()
  //   );
  // }

  /**
   * Logout function
   */
  logout = () => {
    // UserService.logout();
    this.props.history.push("/");
  };

  // nameAvatar = () => {
  //   let genAvat = this.state.currentUser
  //     .split(/\s/)
  //     .reduce((res, letter) => (res += letter.slice(0, 1)), "");
  //   this.setState({
  //     genAvatar: genAvat
  //   });
  //   // return this.state.genAvatar;
  // };

  handleLanguageChange(e) {
    e.preventDefault();
    let lang = e.target.innerHTML;
    lang = lang.toLowerCase();
    if (lang.length === 2) {
      this.setState(
        prevState => ({
          language: lang
        }),
        () => {
          localStorage.setItem("language", this.state.language);
          this.props.pathName.history.push({
            pathName: "/models",
            state: { language: this.state.language }
          });
          this.props.history.push({
            pathName: "/conversations/data-sets/training",
            state: { language: this.state.language }
          });
        }
      );
    } else {
      this.setState(
        prevState => ({
          language: "en"
        }),
        () => {
          localStorage.setItem("language", this.state.language);
          this.props.pathName.history.push({
            pathName: "/models",
            state: { language: this.state.language }
          });
          this.props.pathName.history.push({
            pathName: "/conversations/data-sets/training",
            state: { language: this.state.language }
          });
        }
      );
    }
  }

  // static getDerivedStateFromProps() {
  //
  // }

  /**
   * Function to change theme from the dropdown
   */
  changeTheme = () => {
    this.state.currentTheme === "Dark theme"
      ? this.setState(
        { theme: "dark", currentTheme: "Light theme", colorTrigger: true },
        () => {
          document.documentElement.setAttribute(
            "data-theme",
            this.state.theme
          );
        }
      )
      : this.setState(
        { theme: "light", currentTheme: "Dark theme", colorTrigger: false },
        () => {
          document.documentElement.setAttribute(
            "data-theme",
            this.state.theme
          );
        }
      );
    localStorage.setItem("currentTheme", this.state.currentTheme);
    defaults.global.defaultFontColor = "grey";
    this.props.history.push({
      pathName: "/dashboards",
      state: { colorTrigger: this.state.colorTrigger }
    });
  };

  render() {
    strings.setLanguage(this.state.language);
    return (
      <nav className="navbar col-md-10 col-lg-10 col-xl-10 tabText navHeight tabText mainNavBarbuiltBorder" data-spy="affix">
        <div className="row">
        <NavLink
            activeClassName=""
            className={
              (this.props.location.pathname.match("/dashboards/"))
                ? "anchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 d-none d-md-inline d-lg-inline mainBarPosition active"
                : "anchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 d-none d-md-inline d-lg-inline mainBarPosition"
            }
            to={"/dashboards/"+this.props.bot+"/"+this.props.username}
          >
            Dashboard
            <hr
              className={
                (this.props.location.pathname.match("/dashboards/"))
                  ? "btmLine anchor"
                  : "btmLineNone"
              }

            />
          </NavLink>
          <NavLink
            activeClassName=""
            className={
              (this.props.location.pathname.match("/conversations"))
                ? "anchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 d-none d-md-inline d-lg-inline mainBarPosition active"
                : "anchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 d-none d-md-inline d-lg-inline mainBarPosition"
            }
            to={"/conversations/data-sets/"+this.props.bot+"/training/"+this.props.username}
          >
            Conversation
            <hr
              className={
                (this.props.location.pathname.match("/conversations/"))
                  ? "btmLine anchor"
                  : "btmLineNone"
              }

            />
          </NavLink>
          <NavLink
            activeClassName=""
            className={
              (this.props.location.pathname.match("/models"))
                ? "anchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 d-none d-md-inline d-lg-inline mainBarPosition active"
                : "anchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 d-none d-md-inline d-lg-inline mainBarPosition"
            }
            to={"/models/" + this.props.bot + "/" + this.state.choose +"/" + this.props.match.params.username}
          >
            Model
            <hr
              className={
                (this.props.location.pathname.match("/models/"))
                  ? "btmLine anchor"
                  : "btmLineNone"
              }

            />
          </NavLink>
        </div>
        <div className="moveRight paddingTop10 textColor">
          <div className="row pt-2">
            <p className="d-none d-md-none d-lg-flex mt-1 datePosition">
              {this.state.currentDate}
            </p>
            <div className="dropdown mr-5 mt-1 d-none d-md-flex d-lg-flex langDropdown cursorStyleOne">
              <p
                className="dropdown-toggle mr-5"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.bot}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </p>
              <div
                className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                aria-labelledby="dropdownMenuLink">
                {this.state.bots.map((bots, key) => (
                  <p
                    className="dropdown-item dateFilterTextColor"
                    value="bot"
                    onClick={() => {
                      this.setState({ bot: bots }, () => {
                        this.props.manageData(this.state.bot)
                      })
                    }}>
                    {bots}
                  </p>
                ))}
                <p className="create dropdown-item dateFilterTextColor" value="bot" data-toggle="modal"
                  data-target="#myBot"><AddIcon className="mr-2" />New Bot</p>




              </div>
            </div>
            {/*Dropdown one*/}
            <div className="dropdown mr-2 mt-1 d-none d-md-flex d-lg-flex langDropdown cursorStyleOne">
              <p
                className="dropdown-toggle mr-5"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.language.toUpperCase() ||
                  localStorage.getItem("language").toUpperCase()}{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </p>
              <div
                className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                aria-labelledby="dropdownMenuLink"
                // onClick={this.handleLanguageChange}
              >
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="en"
                >
                  EN
                </p>
                {/* <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="gu"
                >
                  GU
                </p> */}
                {/* <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="hi"
                >
                  HI
                </p> */}
                {/* <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="kn"
                >
                  KN
                </p> */}
                {/* <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="ml"
                >
                  ML
                </p> */}
                {/* <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="se"
                >
                  SE
                </p> */}
                {/* <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="ta"
                >
                  TA
                </p> */}
              </div>
            </div>
            {/*Dropdown two for small screens*/}
            <div className="dropdown">
              <p
                className="d-md-none d-lg-none d-sm-flex"
                role="button"
                id="dropdownMenuLinkThree"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span
                  className="ml-2 cursorStyleOne profileCircle textColor text-uppercase"
                  style={{ marginBottom: "0.5em" }}
                >
                  {this.state.genAvatar}
                  <img src="img/userProfile.png" width="25" height="25" alt="user profile" />
                  <p className="mt-1">tarentoUser</p>
                </span>
              </p>
              <div
                className="dropdown-menu profileDropdown mr-5 cursorStyleOne pr-5"
                aria-labelledby="dropdownMenuLinkThree"
              >
                {/* <p
                  className="dropdown-item dateFilterTextColor"
                  onClick={this.changeTheme}
                >
                  {this.state.currentTheme}
                </p> */}
                {/* <NavLink exact to="/helpPage">
                  <p className="dropdown-item dateFilterTextColor">Help</p>
                </NavLink> */}
                <NavLink exact to="/helpPage">
                  <p
                  className="dropdown-item dateFilterTextColor"
                  onClick={this.logout}
                >
                  Logout
                </p>
                </NavLink>
              </div>
            </div>
            {/*Dropdown two*/}

            <div className="dropdown">
              <p
                className="mr-5 d-none d-md-flex d-lg-flex"
                role="button"
                id="dropdownMenuLinkTwo"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >

                <span className="ml-1 mr-2" style={{ marginBottom: "0.5em" }}>
                  <img src="/img/userProfile.png" width="25" height="25" />
                </span>
                {this.props.match.params.username}
              </p>
              <div
                className="dropdown-menu profileDropdown mr-5 cursorStyleOne"
                aria-labelledby="dropdownMenuLinkTwo"
              >
                {/* <p
                  className="dropdown-item dateFilterTextColor"
                  onClick={this.changeTheme}
                >
                  {this.state.currentTheme}
                // </p> */}
                {/* // <NavLink exact to="/helpPage">
                //   <p className="dropdown-item dateFilterTextColor">Help</p>
                // </NavLink> */}
                <p
                  className="dropdown-item dateFilterTextColor"
                  onClick={this.logout}
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
          <div className="modal fade" id="myBot" role="dialog">
            <div className="modal-dialog" style={{ height: "300px", width: "400px" }}>
              <div className="modal-content modals" style={{ height: "300px", width: "400px" }}>
                <form onSubmit={this.onBotClick}>
                  <div className="modal-body modals" style={{ height: "300px", width: "400px" }}>
                    <h5 className="ml-2 mt-3">Create a Bot</h5>
                    <div className="col-md-12 mt-4">
                      Name
                    <div className="row col-md-12 mt-2" style={{ height: "40px"}}>
                        <input
                          type="text"
                          name="newBot"
                          id="newBot"
                          maxlength="10"
                          value={this.state.newBot}
                          onChange={this.handleClick}
                          className="form-control admin-table-bg no-radius"
                          placeholder="Enter the name of the bot e.g Tarento_Bot"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-12 mt-2">
                      Description
                    <div className="row col-md-12 mt-2" style={{ height: "40px"}}>
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
                    <button type="submit" className="btn default mt-3" data-dismiss="modal" onClick ={ () => {this.setState({newBot : ''});
                    this.setState({desc : ''})}}>Cancel</button>
                    <button type="submit" className="btn btn-primary mt-3 pull-right" disabled={!this.state.newBot} data-dismiss="modal" onClick={this.onBotClick}>Create</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default HeaderNavBar;
