function manageBusiness(){
  ReactDOM.render(
    <BusinessMainContainer/>,document.getElementById("mainContainer")
  );
}

class BusinessMainContainer extends React.Component{
  componentDidMount(){
    getBusinessProfileList();
    firebase.database().ref("businessProfiles").on('child_changed',function(dataSnapshot){
      manageBusiness();
    });


    var pendingRequestContainer = document.getElementById("pending-request");
    firebase.database().ref("businessProfiles").orderByChild("businessApproval").equalTo(false).once('value', function(dataSnapshot){
      var pendingNumber = 0;
      dataSnapshot.forEach(function(childSnapshot){
        pendingNumber = pendingNumber+1;
      });
      console.log(pendingNumber);
      ReactDOM.render(
        pendingNumber,pendingRequestContainer
      );
    });
  }
  render(){
    return(
      <div className = "row w-100">
        <div className = "col-sm-2">
          <div className="text-uppercase nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">Business</a>
            <a className="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">Pending Request <span id ="pending-request" className="badge badge-danger"></span></a>
            <a className="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false">Approved Request</a>
            <a className="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">Business Owners</a>
          </div>
        </div>
        <div className ="col-sm-10" id="businessProfileList">

        </div>
      </div>
    );
  }
}

class Business extends React.Component{
componentDidMount(){
this.reRender();

}
changeBusinessStatus(){

  var aprroval = !this.props.businessApproval;
  var reRend = this.reRender();

  var postData = {
    businessApproval: aprroval,
  };
  firebase.database().ref("businessProfiles").child(this.props.businessId).update(postData,
    function(error) {
    if (error) {
      // The write failed...
      console.log(error);
    } else {
      // Data saved successfully!
      console.log("success");

    }
  }
  );


}

reRender(){
  getBusinessProfileList();
  var approvalStatusContainer = document.getElementById("approvalStatus"+this.props.businessId);
  var businessId = this.props.businessId;
  var businessApproval  = this.props.businessApproval;
  if (businessApproval) {
    ReactDOM.render(
      <div className="font-weight-light text-center text-small alert alert-success" role="alert">
        Approved
      </div>,document.getElementById("status"+businessId)
    );
    ReactDOM.render(
      <div className = "btn btn-success">
        Approve?
      </div>,approvalStatusContainer
    );
  }else {
    ReactDOM.render(
      <div className="font-weight-light text-center text-small alert alert-danger" role="alert">
        Pending Approval
      </div>,document.getElementById("status"+businessId)
    );
    ReactDOM.render(
      <div className = "btn btn-danger">
        Disable?
      </div>,approvalStatusContainer
    );
  }

  var ownerContainer = document.getElementById("ownerContainer"+this.props.businessId);
  var email = this.props.email;
  var contact = this.props.contact;
  firebase.database().ref("users").child(this.props.userId).once('value',function (dataSnapShot){
  var imagePath = dataSnapShot.val().userImage;
  ReactDOM.render(
    <div className ="row">
      <div className ="col-sm-2">
          <img className="user-account-image mr-1 centered rounded-circle border border-secondary" src={imagePath} alt="Card image cap"/>
      </div>
      <small className ="col-sm-3 pt-3">
        {dataSnapShot.val().userName}
      </small>
      <small className = "col-sm-3 pt-3">
        {email}
      </small>
      <small className = "col-sm-3 pt-3">
        {contact}
      </small>
    </div>,ownerContainer
  );
  });
  firebase.database().ref("businessProfiles").child(this.props.businessId).on('child_changed', function (dataSnapshot){
    console.log(dataSnapshot.val());
    if (dataSnapshot.val()) {
      ReactDOM.render(
        <div className="font-weight-light text-center text-small alert alert-success" role="alert">
          Approved
        </div>,document.getElementById("status"+businessId)
      );
      ReactDOM.render(
        <div className = "btn btn-success">
          Approve?
        </div>,approvalStatusContainer
      );
    }else {
      ReactDOM.render(
        <div className="font-weight-light text-center text-small alert alert-danger" role="alert">
          Pending Approval
        </div>,document.getElementById("status"+businessId)
      );
      ReactDOM.render(
        <div className = "btn btn-danger">
          Disable?
        </div>,approvalStatusContainer
      );
    }
  });
}

render(){
  return(

      <div className="card col-sm-3 shadow-sm m-2 border-0 borde">
        <div className="d-flex justify-content-center">
          <img className="centered businessImage rounded-circle border border-secondary" src={this.props.restoProfileImagePath} alt="Card image cap"/>
        </div>
        <div className="card-body">
          <h5 className="text-uppercase font-weight-light card-title text-primary text-center">{this.props.businessname}</h5>
          <div className ="row">
            <div className="col-sm-2 p-1">
              <div className="text-center align-top p-1 w-100 rounded text-primary" data-toggle="modal" data-target={"#manageBusinessDialog"+this.props.businessId}>
                <i className="material-icons">
                settings
                </i>
              </div>
            </div>
            <div className="col-sm-2 p-1">
              <div className="text-center p-1 w-100 rounded text-success">
                <i className="material-icons">
                check
                </i>

              </div>
            </div>

          </div>
          <small className="" id={"status"+this.props.businessId}>
          </small>

          {/* <small className="text-muted font-weight-light">{this.props.address}</small> */}

          {/* <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p> */}
        </div>
        <div className="modal fade" id={"manageBusinessDialog"+this.props.businessId} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              {/* <div className="modal-header">
                <h5 className="modal-title text-uppercase font-weight-light" id="exampleModalLabel">{this.props.businessname}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div> */}
              <div className="modal-body">
                <div className = "row">
                  <div className ="col-sm-3">
                    <img className="centered businessImage rounded-circle border border-secondary" src={this.props.restoProfileImagePath} alt="Card image cap"/>
                  </div>
                  <div className = "col-sm-8">
                      <h5 className="modal-title text-uppercase font-weight-light" id="exampleModalLabel">{this.props.businessname}</h5>
                      <div className ="row">
                        <small className="col text-secondary">
                          {this.props.businessType}
                        </small>
                      </div>
                      <div className ="row">
                          <div className="col">
                            {this.props.address}
                          </div>
                      </div>
                      <div id = {"ownerContainer"+this.props.businessId} className = "row">

                      </div>
                      <div id = {"approvalStatus"+this.props.businessId} onClick={this.changeBusinessStatus.bind(this)} className="row">

                      </div>
                  </div>

                </div>
              </div>
              {/* <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
  );
  }
}

function getBusinessProfileList(){
  var container = document.getElementById("businessProfileList");
  var businssProfilesObjects =[];

  firebase.database().ref("businessProfiles").once('value',function (dataSnapShot){
    dataSnapShot.forEach(function(childSnapshot){
      businssProfilesObjects.push(childSnapshot.val());
    });
    var listItem = businssProfilesObjects.map((object)=>
    <Business key = {object.key} businessId ={object.key}
      businessname = {object.name} restoProfileImagePath = {object.restoProfileImagePath}
      businessApproval = {object.businessApproval}
      businessType = {object.businessType}
      address = {object.address}
      userId = {object.userId}
      email = {object.email}
      contact = {object.contact}

    />
    );
    ReactDOM.render(
      <div className="row ml-5">{listItem}</div>,container
    );
  });
}
