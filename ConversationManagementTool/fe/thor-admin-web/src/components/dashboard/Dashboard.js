import React, { Component } from "react";
import BrandNavBar from "../../components/common/components/BrandNavBar";
import HeaderNavBar from "../../components/common/components/HeaderNavBar";
import WidgetNavBar from "./components/common/WidgetNavBar";
import FilterNavBar from "./components/common/FilterNavBar";
import PropTypes from "prop-types";
import PageLayout from "./components/common/PageLayout";
import { DashboardService } from "../../services/dashboard.service";
import _ from "lodash";
// import { defaults } from 'react-chartjs-2';

/**
 * Dashboard component
 */

class Dashboard extends Component
{
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      dashboardConfigData: [],
      selectedTab: "",
      trigger: false,
      colorTrigger: true
    };
    this.manageData = this.manageData.bind(this);
  }


  manageData(bot)
  {
    this.props.history.push("/dashboards/"+bot+"/"+this.props.username)
  }
  componentDidMount() {
    // console.log("PathName: "+JSON.stringify(this.props))
    // let renderChartsint;
    this._isMounted = true;
    if (localStorage.getItem("currentDashId")) {
      DashboardService.getConfig().then(
        response => {
          this.setState(
            prevState => ({
              ...prevState,
              dashboardConfigData: response.responseData
            }),
            () =>
              localStorage.setItem(
                "customFilters",
                JSON.stringify(this.state.dashboardConfigData[0].filters)
              )
          );
          // localStorage.setItem('dashboardName', this.state.dashboardConfigData[0].name);
        },
        error => {}
      );
    } else {
      setTimeout(
        () =>
          DashboardService.getConfig().then(
            response => {
              this.setState(
                prevState => ({
                  ...prevState,
                  dashboardConfigData: response.responseData
                }),
                () =>
                  localStorage.setItem(
                    "customFilters",
                    JSON.stringify(this.state.dashboardConfigData[0].filters)
                  )
              );
              // localStorage.setItem('dashboardName', this.state.dashboardConfigData[0].name);
            },
            error => {}
          ),
        500
      );
    }

    // renderChartsint = setInterval(() => this.renderCharts(), 10000);
    // localStorage.setItem("renderChartsint", renderChartsint);
  }

  componentWillUnmount() {
    localStorage.removeItem("label");
    localStorage.removeItem("filterKey");
    localStorage.removeItem("customFilters");
    localStorage.removeItem("customFiltersConfigUnitKey");
    localStorage.removeItem("customFiltersConfigUnitFilter");
    localStorage.removeItem("customFiltersConfigCountryKey");
    localStorage.removeItem("customFiltersConfigCountryFilter");
    localStorage.removeItem("customFiltersConfigThirdFilter");
    localStorage.removeItem("customFiltersConfigThirdKey");
    this._isMounted = false;
  }

  UNSAFE_componentWillReceiveProps(prevProps) {
    // console.log("prevProps: "+JSON.stringify(prevProps));
    if (prevProps.history.location.state) {
      if (prevProps.history.location.state.trigger === true) {
        this.setState({
          trigger: true
        });
        if (this.state.trigger) {
          this.setState({
            trigger: false
          });
        }
      }

      // if(prevProps.history.location.state.colorTrigger === true){
      //   this.setState({
      //     colorTrigger: true
      //   })
      //     defaults.global.defaultFontColor = "grey";
      //
      // } else {
      //   this.setState({
      //     colorTrigger: false
      //   })
      //     defaults.global.defaultFontColor = "white";
      // }
    }
  }

  renderCharts = () => {
    // console.log("Render Charts")
    let { dashboardConfigData } = this.state;
    let tabsInitData = _.chain(dashboardConfigData)
      .first()
      .get("visualizations")
      .groupBy("name")
      .value();
    return (
      <div>
        {_.map(tabsInitData, (k, v) => {
          return (
            <PageLayout
              key={v}
              chartRowData={k}
              row={k.row}
              pathName={this.props}
            />
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
          <BrandNavBar bot={this.props.match.params.bot}  username={this.props.match.params.username}/>
          <HeaderNavBar {...this.props} history={this.props.history} bot={this.props.match.params.bot}  username={this.props.match.params.username} manageData={this.manageData}/>
          <FilterNavBar pathName={this.props} />
          <WidgetNavBar history={this.props.history} pathName={this.props} />
        </div>
        {/*{this.state.colorTrigger && (*/}
        <div className="row tabText">
          <div className="col-md-12 mt-5">
            {/* {!this.state.trigger &&
              this.state.dashboardConfigData &&
              this.state.dashboardConfigData.length &&
              this.renderCharts()}
            {this.state.trigger &&
              this.state.dashboardConfigData &&
              this.state.dashboardConfigData.length &&
              this.renderCharts()} */}
            {/*<div className="pull-right">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <div className="row">
                  <h6 className="mt-3">Powered by RAIN from </h6>
                  <a className="" href="https://www.tarento.com/">
                    <p className="brandLogo">&nbsp;</p>
                  </a>
                </div>
              </div>
            </div>*/}
          </div>
        </div>

        {/*)}*/}
        {/*{!this.state.colorTrigger && (
        <div className="row tabText">
          <div className="col-md-12 mt-5 mb-5">
            {!this.state.trigger  && this.state.dashboardConfigData && this.state.dashboardConfigData.length && this.renderCharts()}
            {this.state.trigger && this.state.dashboardConfigData && this.state.dashboardConfigData.length && this.renderCharts()}
          </div>
        </div>
      )}*/}
      </div>
    );
  }
}

export default Dashboard;
