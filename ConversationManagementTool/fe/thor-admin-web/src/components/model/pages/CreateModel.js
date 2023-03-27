import { Component } from "react";
import React from 'react';
import BrandNavBar from "../../common/components/BrandNavBar";
import HeaderNavBar from "../../common/components/HeaderNavBar";
import axios from 'axios';
import { APP } from "../../../constants"
import Notify from "../../../helpers/notify";
import { DatasetService } from "../../../services/dataset.service";
import { ModelService } from "../../../services/model.service";

class CreateModel extends Component
{
    constructor(props) {
        super(props);
        this.state={Filter:[],
          name:this.props.match.params.name,
          disabled:true, 
          all:[],
          models:[],
          test:"choose a dataset",
          draft:true,
          trainingDatasets:[],
          testingDatasets:[],
          traindata:''}
}
handleSubmit = () =>
    {
      this.props.history.push("/models/publishModel/"+this.props.match.params.bot+"/"+this.props.match.params.name+"/testModel/" + this.props.match.params.username);
    }

onSubmit = () => 
    {
      let data=[];
      data.push(this.props.match.params.bot);
      data.push(this.state.traindata)

      DatasetService.train(data).then((response) => {
          if (response && response.status && response.status.code && response.status.code === APP.CODE.SUCCESS){
            this.props.history.push("/models/publishModel/"+this.props.match.params.bot+"/"+this.state.traindata+"/publish/" + this.props.match.params.username);
          } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
          }
          });
     
    }
    
async getData()
    {
      await DatasetService.getDataset(this.props.match.params.bot).then((response) => {
        if (
        response && response.status && response.status.code &&
        response.status.code === APP.CODE.SUCCESS
        ) {
        this.setState({
          trainingDatasets:Object.keys(response.payload.response)
        });
        } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
        }
        });
      await ModelService.getModels(this.props.match.params.bot).then((response) => {
        if (
        response && response.status && response.status.code &&
        response.status.code === APP.CODE.SUCCESS
        ) {
          this.setState({all : response.payload});
          this.setState({models: this.state.all[this.props.match.params.name]});
        } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
        }
        });
      }
    componentDidMount()
    {
      this.setState({traindata:this.state.name})
      this.getData()
    }
render()
{
  return(
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
        <BrandNavBar bot={this.props.match.params.bot}  username={this.props.match.params.username}/>
          <HeaderNavBar {...this.props} username={this.props.match.params.username}/>
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-3 admin-left-section" id="leftbar" style={{maxHeight:"930px",maxWidth:"340px"}}>
              <div className="col-md-12">
               <h5 className="mt-5 ml-3">Published</h5>
               <div className="row col-md-12 mt-3 ">
                 <div className=" row col-md-12 mt-2">
                    <label className="roundSquares mt-2 ml-3"/>
                     <label className="ml-3 mt-1">Version 2<small className="ml-2 labels">15h ago</small>
                     <span class="badge badge-pill badge-secondary ml-3">Production</span></label>
                 </div>
                 <div className=" row col-md-12 mt-2">
                    <label className="roundSquares mt-2 ml-3"/>
                     <label className="ml-3 mt-1">Version 1<small className="ml-2 labels">15h ago</small>
                     <span class="badge badge-pill badge-secondary ml-3">Staging</span></label>
                 </div>
               </div>

               </div>
               <div className="col-md-12">
               <h5 className="mt-5 ml-3">Models</h5>
               {this.state.draft ? (<div className="row col-md-12 mt-3 ">
                 
               <div className=" row col-md-12 mt-2 active">
                          <label className="roundSquares mt-2 ml-3" style={{backgroundColor:'white'}}/>
                           <label className="ml-3 mt-1">Draft</label>
                       </div>
                   {this.state.models.map((models, key)=>( 
                          <div className=" row col-md-12 mt-2">
                          <label className="roundSquares mt-2 ml-3"/>
                           <label className="ml-3 mt-1">{models}</label>
                       </div>
                        ))}
                 </div>) : (<div className="row col-md-12 mt-3 ">
                   {this.state.models.map((models, key)=>( 
                          <div className=" row col-md-12 mt-2">
                          <label className="roundSquares mt-2 ml-3"/>
                           <label className="ml-3 mt-1">{models}</label>
                       </div>
                        ))}
                 </div>)}
               

               </div>
               <div className="col-md-12 mt-1000 dashboard-item1 push-bottom" style={{height:"146px"}}>
                 <div className="mt-3">
                  <button className="btn default mt=4" style={{width:"300px",height:"40px"}}>Create a model</button>
                  </div> 
                  <button  id="publish" className="btn default mt-3 disabled"style={{width:"300px",height:"40px"}} disabled={true}>Publish</button>   
               </div>
              </div>
              <div className="col-md-9 admin-right-section">
                <div className="col-md-12 mt-4">
                <div className="row col-md-12">
                 <div className="row col-md-12">
                 <div className="row col-md-3">
                     Training
                     <div className="panel-body dropdown mt-4 mb-3 d-none d-md-flex d-lg-flex langDropdown" style={{width:"320px"}}>
                      <span
                        className="mr-5 span" style={{width:"320px"}}
                        href="#"
                        role="button"
                        data-toggle="dropdown"
                        id="dropdownRoleLink"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {this.state.traindata} 
                        {/* <i className="fa fa-caret-down pull-right" style={{fontSize:'15px'}} aria-hidden="true"/> */}
                      </span>

                      <div className="dropdown-menu mr-9 cursorStyleOne smallDDMenu pull-right"aria-labelledby="dropdownRoleLink">
                      {this.state.trainingDatasets.map((datasets, key)=>( 
                        <p className="dropdown-item dateFilterTextColor" style={{width:"300px"}} onClick={ () =>{
                          this.setState({traindata:datasets})
                        }}>
                          {datasets}
                        </p>
                      ))}
                      
                      </div>
                    </div>
                     </div>
                     <div className="row col-md-3">
                    Testing
                     <div className="panel-body dropdown mt-4 mb-3 d-none d-md-flex d-lg-flex langDropdown" style={{width:"320px"}}>
                      <span
                        className="mr-5" style={this.state.disabled ? ({width:"320px",color:"grey"}) : ({width:"320px",color:"white"})}
                        href="#"
                        role="button"
                        id="dropdownRoleLink"
                        aria-expanded="false"
                        onClick={this.handleSubmit}>
                        {this.state.test}
                        <i className="fa fa-caret-down pull-right" style={{fontSize:'15px'}} aria-hidden="true"/>
                      </span>
                    </div>
                     </div>
                     <div className="mt-4 ml-auto">
                      <button className="btn primary" onClick={this.onSubmit}>
                        Run Training
                      </button>
                      <button disabled={this.state.disabled} className="btn default">
                       Run Testing
                       </button>
                      </div> 

                 </div>
                 <div className="row col-md-12 mt-3">
                 <div className="mt-4 ml-2 mr-3 cards">
                        <h6 className="mt-2 ml-3 head_disabled">Entity evaluation</h6>
                        <div className="row col-md-12">
                            <div className="mt-1 col-md-4" style={{color:"grey"}}>Accuracy</div>
                            <div className="mt-1 col-md-4" style={{color:"grey"}}>f1-score</div>
                            <div className="mt-1 col-md-4" style={{color:"grey"}}>recall</div>
                        </div>
                        <div className="row col-md-12">
                            <h4 className="mt-1 col-md-4" style={{color:"grey"}}>NA</h4>
                            <h4 className="mt-1 col-md-4" style={{color:"grey"}}>NA</h4>
                            <h4 className="mt-1 col-md-4" style={{color:"grey"}}>NA</h4>
                        </div>
                     
                     </div>
                     <div className="mt-4 ml-2 cards">
                        <h6 className="mt-2 ml-3 head_disabled">Intent evaluation</h6>
                        <div className="row col-md-12">
                            <div className="mt-1 col-md-4" style={{color:"grey"}}>Accuracy</div>
                            <div className="mt-1 col-md-4" style={{color:"grey"}}>f1-score</div>
                            <div className="mt-1 col-md-4" style={{color:"grey"}}>recall</div>
                        </div>
                        <div className="row col-md-12">
                            <h4 className="mt-1 col-md-4" style={{color:"grey"}}>NA</h4>
                            <h4 className="mt-1 col-md-4" style={{color:"grey"}}>NA</h4>
                            <h4 className="mt-1 col-md-4" style={{color:"grey"}}>NA</h4>
                        </div>
                     
                     </div>

                 </div>
                 <div className="row col-md-5 mt-3">
                     Notes
                     <input type="text" placeholder="type something. . ." className="col-md-12 mt-4 mr-5 notes">
                     </input>

                 </div>
                 <div className="col-md-1q mt-5 dashboard-item bordered ml-1 mr-4 chart_size">
                    <i className="fa fa-ellipsis-v pull-right mr-4 mt-2" style={{color:"grey"}}></i>
                    <div className="mt-1 ml-3"><h6>Confusion Matrix</h6></div>
                </div>

                 <div className="col-md-1q mt-3 dashboard-item bordered ml-1 mr-4 chart_size">
                 <i className="fa fa-ellipsis-v pull-right mr-4 mt-2" style={{color:"grey"}}></i>
                 <div className="mt-1 ml-4"><h6>Intent prediction confidence distribution</h6></div>
                 
                    
                 </div>
                 
                </div>

              </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    );
}
}


export default CreateModel;