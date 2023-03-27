import React, { Component } from "react";
import { UserService } from "../../services/user.service";
import Auth from "../../helpers/auth";
import Notify from "./../../helpers/notify";
import { APP } from "../../constants";
import { Link } from "react-router-dom";

/**
 * Login component
 */

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {username:'', password:'',jwToken:''}
    // Notify.success('This is a test message.');
  }


  handleClick= event => {
    this.setState({
      [event.target.name]:event.target.value
    })

  }
  onFormClick =(event) =>
  {
    event.preventDefault();
    var data=[];
    data.push(this.state.username);
    data.push(this.state.password);
    UserService.login(data).then((response) => {
      if(response !== 'Error in the api call')
      {
        if (response === 401)
        {
          Notify.error("Invalid credentials. Please try again with valid credentials.")
        }
        else if (response === 403)
        {
          Notify.error("Access Denied !")
        }
        else
        {
          if(response.payload.active === false)
          {
            Notify.error("The user is not active.");
          }
          // else if (response.payload.active === true && response.status.code === APP.CODE.SUCCESS)
          else if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS)
        {
          Notify.success("Login successful")
          localStorage.setItem('jwt', response.payload.jwToken);
          this.props.history.push("/conversations/data-sets/Choose a bot/training/"+response.payload.username);
        
        } else if(response && response === 401)
        {
          Notify.error("Invalid credentials. Please try again with valid credentials.")
        }
        }
      }
      else {
        Notify.error('Error in the api call')
      }
      
  
      
    });
  }


  render() {
    return (
      <div className="d-md-flex d-lg-flex d-xl-flex fullHeight">
        <div className="col-md-7 d-none d-md-flex d-lg-flex d-xl-flex">
          <img
            className="centerAlign"
            src="img/logoTarento.png"
            alt="brand cover"
            height="158"
            width="400"
          />
        </div>
        <div className="col-md-5 d-md-flex d-lg-flex d-xl-flex loginRightBg fullHeight">
          <div className="centerAlign verticalCenter" style={{ width: "85%" }}>
            <div className="loginForm text-center">
              <form className="form-signin" onSubmit={this.onFormClick}>
                <h1 className="h4 mb-3 font-weight-normal">Please sign in</h1>
                <input
                  type="text"
                  id="inputEmail"
                  name="username"
                  className="form-control"
                  placeholder="Username"
                  onChange={this.handleClick}
                  autoComplete="off"
                  required

                />
                <input
                  type="password"
                  id="inputPassword"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={this.handleClick}
                  autoComplete="off"
                  required
                />
                <button
                  className="btn btn-lg btn-primary btn-block"
                  id="loginBtn"
                  type="submit"
                  // onClick={this.onFormClick}
                >
                  Login
                </button>
                <p className="text-center">
                  <Link to="login" className="forgot">
                    Forgot password?
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
