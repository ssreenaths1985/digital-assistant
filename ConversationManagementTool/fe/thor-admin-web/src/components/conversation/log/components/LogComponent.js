import React, { Component } from "react";
import LogPage from "../pages/LogPage";

class LogComponent extends Component {
  constructor(props) {
    super(props);
  }

  searchIntentItems = (event) => {
    var input, filter, formItems, a, i, txtValue;
    input = event.target.value;
    filter = input.toUpperCase();
    formItems = document.getElementsByClassName("borderless")[0];
    for (i = 0; i < formItems.length; i++) {
      a = formItems[i].getElementsByClassName("title")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        formItems[i].style.display = "";
      } else {
        formItems[i].style.display = "none";
      }
    }
  };

  searchConversationItems = (event) => {
    var input, filter, table, tr, th, td, i, j, txtValue, visibleElements = 0;
    input = event.target;
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

  filterFunction = (filter) => {
    var input, intent, table, tr, int, i, intValue, filterInt
    intent = filter
    filterInt = intent.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      int = tr[i].getElementsByTagName("td")[2];
      intValue = int.textContent || int.innerText;
      if (intValue.toUpperCase().indexOf(filterInt) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }

    }
  }






  render() {
    return (
      <LogPage
        {...this.props}
        searchIntentItems={this.searchIntentItems}
        searchConversationItems={this.searchConversationItems}
        filterFunction={this.filterFunction}
      />
    );
  }
}

export default LogComponent;
