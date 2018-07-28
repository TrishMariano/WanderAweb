
function manageBusiness(){
  ReactDOM.render(
    <BusinessMainContainer/>,document.getElementById("mainContainer")
  );
}

function getPendinBus8inessRequest(){
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
class BusinessMainContainer extends React.Component{
  componentDidMount(){
    getBusinessProfileList();
    firebase.database().ref("businessProfiles").on('child_changed',function(dataSnapshot){
      manageBusiness();
    });
    getPendinBus8inessRequest();


  }
  render(){
    return(
      <div className = "row w-100">

        <div className = "col-sm-12 justify-content-end">
          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Bussiness</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Pending Request <span id ="pending-request" className="badge badge-danger"></span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Approved Request</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">Business Owners</a>
          </li>
        </ul>

        </div>
        <div className ="col-sm-12" id="businessProfileList">

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
    getPendinBus8inessRequest();
    ReactDOM.render(
      <div className = "btn btn-success">
        Approved
      </div>,approvalStatusContainer
    );
  }else {
    getPendinBus8inessRequest();
    ReactDOM.render(
      <div className = "btn btn-danger">
        Disabled
      </div>,approvalStatusContainer
    );
  }

  var ownerContainer = document.getElementById("ownerContainer"+this.props.businessId);
  var email = this.props.email;
  var contact = this.props.contact;
  firebase.database().ref("users").child(this.props.userId).once('value',function (dataSnapShot){
  var imagePath = dataSnapShot.val().userImage;
  ReactDOM.render(
    <div className = "ml-1">
      <div className = "d-flex flex-row align-middle">
        <div className ="">
            <img className="user-account-image mr-2 centered rounded-circle border border-secondary" src={imagePath} alt="Card image cap"/>
        </div>
        <small className ="align-middle">
          {dataSnapShot.val().userName}
        </small>
      </div>
      <div className = "d-flex flex-row">
        <small className = "mr-3">
          {email}
        </small>
        <small>
          {contact}
        </small>
      </div>
    </div>,ownerContainer
  );
  });
  firebase.database().ref("businessProfiles").child(this.props.businessId).on('child_changed', function (dataSnapshot){
    console.log(dataSnapshot.val());
    if (dataSnapshot.val()) {
        getPendinBus8inessRequest();
      ReactDOM.render(
        <div className = "btn btn-success">
          Approved
        </div>,approvalStatusContainer
      );
    }else {
        getPendinBus8inessRequest();
      ReactDOM.render(
        <div className = "btn btn-danger">
          Disabled
        </div>,approvalStatusContainer
      );
    }
  });
}

render(){
  return(

      <div className="card col-sm-5 shadow-sm m-2 border-0 borde">
        <div className = "d-flex flex-row">
          <div className ="">
            <img className="centered businessImage rounded-circle border border-secondary" src={this.props.restoProfileImagePath} alt="Card image cap"/>
          </div>
          <div className = "ml-3">
              <h5 className="modal-title text-uppercase font-weight-light" id="exampleModalLabel">{this.props.businessname}</h5>
              <div className ="row pl-1">
                <small className="col text-secondary">
                  {this.props.businessType}
                </small>
              </div>
              <div className ="row pl-3 w-100 ">
                    {this.props.address}
              </div>
              <div id = {"ownerContainer"+this.props.businessId} className = "row pl-2 w-100">

              </div>
              <div id = {"approvalStatus"+this.props.businessId} onClick={this.changeBusinessStatus.bind(this)} className = "row ml-1 mt-2 w-100 ">

              </div>
          </div>

        </div>
      </div>
  );
  }
}
manageBusiness();
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
