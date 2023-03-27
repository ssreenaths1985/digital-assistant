import React, { Component } from "react";
import SidebarPage from "../pages/SidebarPage.js";

class SidebarComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <SidebarPage {...this.props} />;
  }
}

export default SidebarComponent;
