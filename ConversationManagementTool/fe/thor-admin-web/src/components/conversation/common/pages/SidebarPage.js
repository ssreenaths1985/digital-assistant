import React, { Component } from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../../../translations.js";

let strings = new LocalizedStrings(translations);

class SidebarPage extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }


  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <ul className="menu-items">
        <Link to={"/conversations/data-sets/" + this.props.match.params.bot + "/training/"+this.props.match.params.username}>
        {}
          <li
            className={`${this.props.location.pathname.match("/conversations/"+"data-sets/")
              ? "active white-90"
              : "white-90"
              }`}
          >
            Datasets
          </li>
        </Link>
        <Link to={"/conversations/"+this.props.match.params.bot+"/logs/"+this.props.match.params.username}>
          <li
            className={`${this.props.location.pathname.match("/conversations/" + this.props.bot + "/logs")
              ? "active white-90"
              : "white-90"
              }`}
          >
            Conversation Logs
          </li>
        </Link>
        {/* <Link to={`/conversations/choose a bot/actions`}>
          <li
            className={`${this.props.location.pathname.match("/conversations/" + this.props.bot + "/actions")
              ? "active white-90"
              : "white-90"
              }`}
          >
            Actions
          </li>
        </Link> */}
        {/* <Link to="/shadowmonitering">
          <li
            className={`${this.props.location.pathname.match("/shadowmonitering")
              ? "active white-90"
              : "white-90"
              }`}
          >
            Shadow Monitoring
          </li>
        </Link> */}
      </ul>
    );
  }
}

export default SidebarPage;
