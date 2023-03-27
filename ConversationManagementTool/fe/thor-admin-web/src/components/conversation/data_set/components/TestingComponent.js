import React, { Component } from "react";
import TrainingPage from "../pages/TrainingPage";

class TestingComponent extends Component {
  constructor(props) {
    super(props);
  }

  searchTrainingItems = (event) => {
    var input, filter, formItems, a, i, txtValue;
    input = event.target.value;
    filter = input.toUpperCase();
    formItems = document.getElementsByClassName("dashboard-item");
    for (i = 0; i < formItems.length; i++) {
      a = formItems[i].getElementsByClassName("title")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        formItems[i].parentNode.parentNode.style.display = "";
      } else {
        formItems[i].parentNode.parentNode.style.display = "none";
      }
    }
  };

  render() {
    return (
      <TrainingPage
        {...this.props}
        searchTrainingItems={this.searchTrainingItems}
      />
    );
  }
}

export default TestingComponent;
