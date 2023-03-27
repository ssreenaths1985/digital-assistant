import React, { Component } from "react";
import { NavLink } from "react-router-dom";

/**
 * Brand Navbar Component
 * Holds the brand logo
 */

class BrandNavBar extends Component {
  render() {
    return (
      <NavLink className="navbar navbar-light col-sm-12 col-md-2 col-lg-2 col-xl-2 justifyContent navHeight tabText brandNavBarbuiltBorder brandSection"
      to={"/dashboards/"+this.props.bot+"/"+this.props.username}>
        
      </NavLink>
      // <nav className="navbar navbar-light col-sm-12 col-md-2 col-lg-2 col-xl-2 justifyContent navHeight tabText brandNavBarbuiltBorder brandSection"
      // to={"/dashboards/"+this.props.bot+"/"+this.props.username}>
       
      // </nav>
    );
  }
}

export default BrandNavBar;
