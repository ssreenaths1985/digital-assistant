import React, { Component } from "react";
import LogPage from "../pages/ActionPage";
import ActionPage from "../pages/ActionPage";

class ActionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false }
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

  searchIntentItems = (event) => {
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

  showSideNavContents = (event) => {
    this.setState({ show: !this.state.show })
  }

  render() {
    return (
      <ActionPage
        {...this.props}
        searchIntentItems={this.searchIntentItems}
        searchConversationItems={this.searchConversationItems}
        showSideNavContents={this.showSideNavContents}
        show={this.state.show}
      />
    );
  }
}

export default ActionComponent;
