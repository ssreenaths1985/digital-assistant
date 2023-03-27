import React, { Component } from "react";
import * as d3 from "d3";

class CalendarHeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calData: []
    };
    this.loadCalendar = this.loadCalendar.bind(this);
    this.anchor = React.createRef();
  }

  componentDidMount() {
    fetch("/json/CalendarHeatMapData.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(messages => {
        this.setState(
          prevState => ({
            calData: [...prevState.calData, messages]
          }),
          () => {
            this.loadCalendar(this.state.calData[0]);
          }
        );
      });
  }

  loadCalendar = dateData => {
    d3.select(this.anchor.current)
      .select("svg")
      .remove();

    var weeksInMonth = function(month) {
      var m = d3.timeMonth.floor(month);
      return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m, 1))
        .length;
    };

    var minDate = d3.min(dateData, function(d) {
      return new Date(d.day);
    });
    var maxDate = d3.max(dateData, function(d) {
      return new Date(d.day);
    });

    var cellMargin = 2,
      cellSize = 10;

    var day = d3.timeFormat("%w"),
      week = d3.timeFormat("%U"),
      format = d3.timeFormat("%Y-%m-%d"),
      titleFormat = d3.utcFormat("%a, %d-%b"),
      monthName = d3.timeFormat("%B"),
      months = d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

    var svg = d3
      .select(this.anchor.current)
      .selectAll("svg")
      .data(months)
      .enter()
      .append("svg")
      .attr("class", "month")
      .attr("height", cellSize * 7 + cellMargin * 8 + 20) // the 20 is for the month labels
      .attr("width", function(d) {
        var columns = weeksInMonth(d);
        return cellSize * columns + cellMargin * (columns + 1);
        // return ((cellSize * columns)+(cellMargin *(columns)))
      })
      .append("g");

    svg
      .append("text")
      .attr("class", "month-name")
      .attr("y", cellSize * 7 + cellMargin * 8 + 15)
      .attr("x", function(d) {
        var columns = weeksInMonth(d);
        return (cellSize * columns + cellMargin * (columns + 1)) / 2;
      })
      .attr("text-anchor", "middle")
      .text(function(d) {
        return monthName(d);
      });

    var rect = svg
      .selectAll("rect.day")
      .data(function(d, i) {
        return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth() + 1, 1));
      })
      .enter()
      .append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", 10)
      .attr("stroke", "#434343")
      .attr("stroke-width", 1)
      // .attr("rx", 3).attr("ry", 3) // rounded corners
      .attr("fill", "#ffffff") // default light grey fill
      .attr("y", function(d) {
        return day(d) * cellSize + day(d) * cellMargin + cellMargin;
      })
      .attr("x", function(d) {
        return (
          (week(d) - week(new Date(d.getFullYear(), d.getMonth(), 1))) *
            cellSize +
          (week(d) - week(new Date(d.getFullYear(), d.getMonth(), 1))) *
            cellMargin +
          cellMargin
        );
      })
      .on("mouseover", function(d) {
        d3.select(this).classed("hover", true);
      })
      .on("mouseout", function(d) {
        d3.select(this).classed("hover", false);
      })
      .datum(format);

    rect.append("title").text(function(d) {
      return titleFormat(new Date(d));
    });

    var lookup = d3
      .nest()
      .key(function(d) {
        return d.day;
      })
      .rollup(function(leaves) {
        return d3.sum(leaves, function(d) {
          return parseInt(d.count);
        });
      })
      .object(dateData);

    var scale = d3
      .scaleLinear()
      .domain(
        d3.extent(dateData, function(d) {
          return parseInt(d.count);
        })
      )
      .range([0.4, 1]);

    rect
      .filter(function(d) {
        return d in lookup;
      })
      .style("fill", function(d) {
        return d3.interpolateBlues(scale(lookup[d]));
      })
      .select("title")
      .text(function(d) {
        return titleFormat(new Date(d)) + ":  " + lookup[d];
      });
  };

  render() {
    const { calData } = this.state;

    if (!calData) {
      return null;
    }
    return <g is="x3d" ref={this.anchor} />;
  }
}

export default CalendarHeatMap;
