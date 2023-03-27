import React from "react";
import ChartType from "./ChartType";
import "file-saver";
import domtoimage from "dom-to-image";

/**
 * GenericChart component to display the
 * generated charttypes in the page layout
 */

class GenericCharts extends React.Component {
  filterImage = node => {
    return (
      node.id !== "dropdownMenuButton" &&
      node.id !== "zoomIn" &&
      node.id !== "zoomOut" &&
      node.id !== "zoomInBtn" &&
      node.id !== "zoomOutBtn"
    );
  };

  renderCharts(d, chartData, index) {
    switch (d.vizType.toUpperCase()) {
      case "CHART":
        return (
          <div
            key={index}
            className={`col-sm-12 col-md-${d.dimensions.width} col-lg-${d.dimensions.width} mt-2 mb-3`}
          >
            <div
              className="chart-wrapper h-100 cardChart chartWrapperPadding"
              id={d.name}
            >
              <div className="row">
                <h5 className="pb-5 pt-2 pl-3">{d.name}</h5>
                <img
                  className="cursorStyleOne mt-3 downloadBtn ml-3 downloadIcon"
                  src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=="
                  title="Download as PNG"
                  alt="download chart"
                  width="13"
                  height="13"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                ></img>
                <div
                  className="dropdown-menu dropdown-menu-custom"
                  aria-labelledby="dropdownMenuButton"
                  style={{ marginLeft: "-18em" }}
                >
                  <p
                    className="dropdown-item cursorStyleOne metricTextColor"
                    onClick={() =>
                      domtoimage
                        .toBlob(document.getElementById(d.name), {
                          filter: this.filterImage
                        })
                        .then(blob => window.saveAs(blob, d.name))
                    }
                  >
                    Download as PNG
                  </p>
                </div>
              </div>
              <ChartType
                key={index}
                chartData={d.charts}
                label={d.name}
                section={chartData.name}
                pathName={this.props}
                dimensions={d.dimensions}
              />
            </div>
          </div>
        );
      case "METRICCOLLECTION":
        return (
          <div
            key={index}
            className={`col-sm-12 col-md-${d.dimensions.width} col-lg-${d.dimensions.width} mt-2 mb-3`}
          >
            <div
              className="chart-wrapper h-100 cardChart chartWrapperPadding"
              id={d.name}
            >
              <div className="row">
                <h5 className="pb-5 pt-2 pl-3">{d.name}</h5>
                <img
                  className="cursorStyleOne mt-3 downloadBtn downloadIcon ml-3"
                  src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=="
                  title="Download as PNG"
                  alt="download chart"
                  width="13"
                  height="13"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                ></img>
                <div
                  className="dropdown-menu dropdown-menu-custom"
                  aria-labelledby="dropdownMenuButton"
                  style={{ marginLeft: "-18em" }}
                >
                  <p
                    className="dropdown-item cursorStyleOne metricTextColor"
                    onClick={() =>
                      domtoimage
                        .toBlob(document.getElementById(d.name), {
                          filter: this.filterImage
                        })
                        .then(blob => window.saveAs(blob, d.name))
                    }
                  >
                    Download as PNG
                  </p>
                </div>
              </div>
              <ChartType
                key={index}
                chartData={d.charts}
                label={d.name}
                section={chartData.name}
              />
            </div>
          </div>
        );
      default:
        return <div></div>;
    }
  }
  render() {
    let { chartData, row } = this.props;

    return (
      <div key={row} className="row">
        {chartData.vizArray.map((d, i) => this.renderCharts(d, chartData, i))}
      </div>
    );
  }
}

export default GenericCharts;
