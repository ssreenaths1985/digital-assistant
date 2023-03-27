import React from "react";
import { Bar } from "react-chartjs-2";
import NFormatterFun from "../numberFormaterFun";
import _ from "lodash";
let palette = window.palette;

/**
 * MixedData component
 */

const plugins = [
  {
    afterDraw: (chartInstance, easing) => {
      // const ctx = chartInstance.chart.ctx;
      // ctx.fillText("This text drawn by a plugin", 100, 100);
    }
  }
];
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
        // console.log(data)
        var dataset = data.datasets[tooltipItem.datasetIndex];
        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
        var total = meta.total;
        var currentValue = dataset.data[tooltipItem.index];
        var percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
        // if (dataset.dataSymbol[tooltipItem.index][0] == 'number' || dataset.dataSymbol[tooltipItem.index][1] == 'Unit') {
        currentValue = NFormatterFun(
          currentValue,
          dataset.dataSymbol[tooltipItem.index][0],
          dataset.dataSymbol[tooltipItem.index][1],
          true
        );
        // }
        return currentValue + " (" + percentage + "%)";
      },
      title: function(tooltipItem, data) {
        return data.labels[tooltipItem[0].index];
      }
    }
  }
};

class MixedData extends React.Component {
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
      label: "",
      type: "bar",
      data: [],
      dataSymbol: []
    };
    var tempdataSetTwo = {
      label: "",
      type: "line",
      data: [],
      dataSymbol: []
    };

    _.map(chartData, function(k, v) {
      var plots = k["plots"];

      for (var i = 0; i < plots.length; i++) {
        tempData.labels.push(plots[i]["name"]);
        //tempdataSet.data.push(NFormatterFun(plots[i]['value'], plots[i]['symbol'], this.props.GFilterData['Denomination']));
        tempdataSet.data.push(plots[i]["value"]);
        tempdataSetTwo.data.push(plots[i]["value"]);
        tempdataSet.dataSymbol.push([plots[i]["symbol"], "Unit"]);
        tempdataSetTwo.dataSymbol.push([plots[i]["symbol"], "Unit"]);
      }
      // }.bind(this));
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
    tempData.datasets.push(tempdataSetTwo);
    return tempData;
  }

  render() {
    let { chartData } = this.props;
    let _data = this.getData(chartData);
    // console.log("Data: " + JSON.stringify(_data));
    // 	let intPie;
    // intPie = setInterval(() => (this.getData(chartData)), 10000);
    // localStorage.setItem("intPie", intPie);
    //     console.log("PieChart chartData", chartData);
    // console.log("PieChart _data", _data);
    if (_data) {
      return <Bar data={_data} options={options} plugins={plugins} />;
    }
    return <div>Loading...</div>;
  }
}

export default MixedData;
