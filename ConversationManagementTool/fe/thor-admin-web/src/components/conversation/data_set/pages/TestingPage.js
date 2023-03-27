import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../../common/components/BrandNavBar";
import HeaderNavBar from "../../../common/components/HeaderNavBar";
import SidebarComponent from "../../common/components/SidebarComponent";
import LocalizedStrings from "react-localization";
import { translations } from "../../../../translations.js";
import { DatasetService } from "../../../../services/dataset.service"
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";


let strings = new LocalizedStrings(translations);
// let data=[];

class TestingPage extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en", name: '', datasets: [], intents: [], records: [], value: '', showInput: false };
    this.addValue = this.addValue.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }

  addValue(evt) {
    evt.preventDefault();
    if (this.state.value != undefined) {
      this.setState({ showInput: false })
      DatasetService.createDataset(this.state.value).then((response) => {
        if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS
        ) {
          Notify.success(response && response.payload);
          DatasetService.getDataset().then((response) => {
            if (
              response && response.status && response.status.code && 
              response.status.code === APP.CODE.SUCCESS
            ) {
              this.setState({
                datasets: Object.keys(response.payload.response)
              });
              this.setState({
                records: Object.values(response.payload.response)
              });
            } else {
              Notify.error(response && response.data.statusInfo.errorMessage);
            }
          });
        }
        else {
          Notify.error(response && response.payload);
        }
      });
    }
  }

  updateInput(evt) {
    this.state = { value: evt.target.value };
  }

  componentDidMount() {
    DatasetService.getDataset().then((response) => {
      if (
        response && response.status && response.status.code &&
        response.status.code === APP.CODE.SUCCESS
      ) {
        this.setState({
          datasets: Object.keys(response.payload.response)
        });
        this.setState({
          records: Object.values(response.payload.response)
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  }

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        {console.log(this.state.datasets)}
        <div className="row">
        <BrandNavBar bot={this.props.match.params.bot}  username={this.props.match.params.username}/>
          <HeaderNavBar {...this.props} />
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-2 admin-left-section">
                <SidebarComponent {...this.props} />
              </div>
              <div className="col-md-10 admin-right-section">
                <div className="row col-md-12">
                  <div className="col-md-12 mt-5">
                    <Link
                      to={"/conversations/data-sets/training"}
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
                  </div>
                </div>
                <div className="row col-md-12 mt-5">
                  <div className="col-md-12">
                    <button type="button" disabled={this.state.showInput} className="btn theme" onClick={() => {
                      this.setState({ showInput: true })
                    }}>
                      Create a new data set
                    </button>
                  </div>
                  {this.state.showInput ? (
                    <div className="col-md-12 mt-3">
                      <form onSubmit={this.addValue}>
                        <input type="text" className="addNew" placeholder="e.g Tarento-HR" onChange={this.updateInput} style={{ height: "40px", width: "250px" }} required /><br /><br />
                        <input type="text" className="addNew" placeholder="Description (Optional)" style={{ height: "80px", width: "400px" }} /><br /><br />
                        <button type='submit' className="btn default">
                          Add Dataset
                    </button>
                      </form>
                    </div>
                  ) : (null)}
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
                    <div className="col-md-4">
                      <Link to={{ pathname: '/conversations/data-sets/' + dataset + '/details' }}>
                        <div className="dashboard-item bordered">
                          <div className="row col-12">
                            <div className="col-2">
                              <span className="ml-3 profileCircle textColor text-uppercase">
                                DS1
                          </span>
                            </div>

                            <div className="col-10">
                              <p className="p-3 one-line">
                                <span className="title" >{dataset}</span> <br />
                                <span className="recordCount">{this.state.records[key]} records</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TestingPage;
