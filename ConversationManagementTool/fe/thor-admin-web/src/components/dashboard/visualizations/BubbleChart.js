import React from "react";
import { Bubble } from "react-chartjs-2";
// import NFormatterFun from '../NumberFormaterFun';
import _ from "lodash";
let palette = window.palette;

/**
 * BubbleChart component
 */

const options = {
  responsive: true,

  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  },
  legend: {
    display: true,
    position: "bottom",
    labels: {
      boxWidth: 10
    }
  },
  tooltips: {
    callbacks: {
      label: function(tooltipItem, data) {
        // console.log(data);
        var dataset = data.datasets[tooltipItem.datasetIndex];
        // var meta = dataset._meta[Object.keys(dataset._meta)[0]];
        // var total = meta.total;
        var currentValue = dataset.data[tooltipItem.index];

        // var percentage = parseFloat((currentValue / total * 100).toFixed(1));
        // // if (dataset.dataSymbol[tooltipItem.index][0] == 'number' || dataset.dataSymbol[tooltipItem.index][1] == 'Unit') {
        // currentValue = NFormatterFun(currentValue, dataset.dataSymbol[tooltipItem.index][0], dataset.dataSymbol[tooltipItem.index][1], true)
        // }
        // return currentValue + ' (' + percentage + '%)';
        // console.log("Value: "+JSON.stringify(this.tempData))
        return JSON.stringify(currentValue);
      },
      title: function(tooltipItem, data) {
        return data.labels[tooltipItem[0].index];
      }
    }
  }
};

class BubbleChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  getData(chartData) {
    var tempData = {
      labels: [],
      datasets: []
    };
    var tempdataSet = {
      label: [],
      data: []
      // dataSymbol: []
    };
    let tempArray = [];

    _.map(chartData, function(k, v) {
      var plots = k["plots"];
      let labelName = k["headerName"];
      tempArray.push(labelName);
      // console.log("Plots name: "+JSON.stringify(labelName));
      // for(var l=0; l < labelName.length; l++) {

      // tempData.labels.push(chartData[l].headerName);
      // tempdataSet.label.push(chartData[l].headerName);
      // }

      for (var i = 0; i < plots.length; i++) {
        // console.log("Plots name: "+chartData[i]);
        //tempdataSet.data.push(NFormatterFun(plots[i]['value'], plots[i]['symbol'], this.props.GFilterData['Denomination']));
        tempdataSet.data.push({
          x: plots[i]["xAxis"],
          y: plots[i]["yAxis"],
          r: plots[i]["zAxis"]
        });
        // tempdataSet.dataSymbol.push([plots[i]['symbol'], "Unit"]);
      }
      // }.bind(this));
    });

    tempArray.forEach((value, index) => {
      tempData.labels.push(value);
      tempdataSet.label.push(value);
    });

    tempdataSet.backgroundColor = palette(
      "cb-Custom1",
      tempdataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    tempdataSet.borderColor = palette(
      "cb-Custom1",
      tempdataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    tempData.datasets.push(tempdataSet);
    // console.log("Here: "+JSON.stringify(tempData))
    return tempData;
  }

  render() {
    let { chartData } = this.props;
    // console.log("Bubble data: "+JSON.stringify(data))
    let _data = this.getData(chartData);
    // 	let intPie;
    // intPie = setInterval(() => (this.getData(chartData)), 10000);
    // localStorage.setItem("intPie", intPie);
    //     console.log("PieChart chartData", chartData);
    // console.log("PieChart _data", _data);
    if (_data) {
      return <Bubble height={this.props.dimensions.height} data={_data} options={options} />;
    }
    return <div>Loading...</div>;
  }
}

export default BubbleChart;
