import React, { Component } from "react";
import LogPage from "../pages/ShadowMonitoringPage";

class ShadowMonitoringComponent extends Component {
  constructor(props) {
    super(props);
  }

  searchConversationItems = (event) => {
    var input,
      filter,
      table,
      tr,
      th,
      td,
      i,
      j,
      txtValue,
      visibleElements = 0;
    console.log(event)
    input = event.target;
    console.log(input)
    filter = input.value.toUpperCase();
    table = document.getElementsByClassName("borderless")[0];
    tr = table.getElementsByTagName("tr");
    th = table.querySelectorAll("tr .white-70");
    for (i = 1; i < tr.length; i++) {
      let display = false;
      for (j = 0; j < th.length; j++) {
        td = tr[i].getElementsByTagName("td")[parseInt(j)];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            display = true;
          }
        }
      }
      if (display) {
        tr[i].style.display = "";
        visibleElements += 1;
      } else {
        tr[i].style.display = "none";
      }
    }
  };

  render() {
    return (
      <LogPage
        {...this.props}
        searchConversationItems={this.searchConversationItems}
      />
    );
  }
}

export default ShadowMonitoringComponent;