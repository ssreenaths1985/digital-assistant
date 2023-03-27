import React, { Component } from "react";
import DataSetDetailsPage from "../pages/DataSetDetailsPage";

class DataSetComponent extends Component {
  constructor(props) {
    super(props);
  }

  searchIntentItems = (event) => {
    var input, filter, formItems, a, i, txtValue;
    input = event.target.value;
    filter = input.toUpperCase();
    formItems = document.getElementsByClassName("intent");
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

  searchUtterenceItems = (event) => {
    var input, filter, formItems, a, i, txtValue;
    input = event.target.value;
    filter = input.toUpperCase();
    formItems = document.getElementsByClassName("utterence");
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

  render() {
    return (
      <DataSetDetailsPage
        {...this.props}
        searchIntentItems={this.searchIntentItems}
        searchUtterenceItems={this.searchUtterenceItems}
      />
    );
  }
}

export default DataSetComponent;
