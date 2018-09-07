function manageBusiness() {
  ReactDOM.render(
    <BusinessMainContainer />,
    document.getElementById("mainContainer")
  );
}

function getPendinBus8inessRequest() {
  var pendingRequestContainer = document.getElementById("pending-request");
  firebase
    .database()
    .ref("businessProfiles")
    .orderByChild("businessApproval")
    .equalTo(false)
    .on("value", function(dataSnapshot) {
      var pendingNumber = 0;
      dataSnapshot.forEach(function(childSnapshot) {
        pendingNumber = pendingNumber + 1;
      });
      console.log(pendingNumber);
      ReactDOM.render(pendingNumber, pendingRequestContainer);
    });
}
function getApprovedRequests() {
  var pendingRequestContainer = document.getElementById("approved-request");
  firebase
    .database()
    .ref("businessProfiles")
    .orderByChild("businessApproval")
    .equalTo(true)
    .on("value", function(dataSnapshot) {
      var pendingNumber = 0;
      dataSnapshot.forEach(function(childSnapshot) {
        pendingNumber = pendingNumber + 1;
      });
      console.log(pendingNumber);
      ReactDOM.render(pendingNumber, pendingRequestContainer);
    });
}
class BusinessMainContainer extends React.Component {
  componentDidMount() {
    this.getAllBusiness();
    getPendinBus8inessRequest();
    getApprovedRequests();
  }
  getPending() {
    getPending();
  }
  getAllBusiness() {
    getBusinessProfileList();
  }
  getApproved() {
    getApproved();
  }
  render() {
    return (
      <div className="row w-100">
        <div className="col-sm-12 justify-content-end">
          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link active"
                id="pills-home-tab"
                data-toggle="pill"
                href="#pills-home"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
                onClick={this.getAllBusiness.bind(this)}
              >
                Businesses
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="pills-profile-tab"
                data-toggle="pill"
                href="#pills-profile"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
                onClick={this.getPending.bind(this)}
              >
                Pending Requests{" "}
                <span id="pending-request" className="badge badge-danger" />
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="pills-profile-tab"
                data-toggle="pill"
                href="#pills-profile"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
                onClick={this.getApproved.bind(this)}
              >
                Approved Requests{" "}
                <span id="approved-request" className="badge badge-danger" />
              </a>
            </li>
          </ul>
        </div>
        <div className = "col-sm-12" id = "statusConfrim">
        
        </div>
        <div className="col-sm-12" id="businessProfileList" />
      </div>
    );
  }
}

class Business extends React.Component {
  changeBusinessStatus() {
    let sup = this;
    var aprroval = !this.props.businessApproval;
    var postData = {
      businessApproval: aprroval
    };

    firebase
      .database()
      .ref("businessProfiles")
      .child(this.props.businessId)
      .update(postData, function(error) {
        if (error) {
          // The write failed...

          console.log(error);
          getBusinessProfileList();

        } else {
          // Data saved successfully!
         if(aprroval){
          ReactDOM.render(
            <div class="alert alert-success" role="alert">
            Appoved
           </div>
            ,document.querySelector("#statusConfrim")
          )
         }else{
          ReactDOM.render(
            <div class="alert alert-danger" role="alert">
            Disabled
           </div>
            ,document.querySelector("#statusConfrim")
          )
         
         }
         setTimeout(
          function() {
            ReactDOM.render(
             <React.Fragment>
              
             </React.Fragment>
              ,document.querySelector("#statusConfrim")
            )
          }, 3000);
        
          console.log("success");
          setLoading();
          getBusinessProfileList();
        }
      });
    var approvalStatusContainer = document.getElementById(
      "approvalStatus" + this.props.businessId
    );
    firebase
      .database()
      .ref("businessProfiles")
      .child(this.props.businessId)
      .on("value", function(dataSnapshot) {
        if (dataSnapshot.val().businessId) {
          ReactDOM.render(
            <div className="btn btn-success">Approved</div>,
            approvalStatusContainer
          );
        } else {
          ReactDOM.render(
            <div className="btn btn-danger">Disabled</div>,
            approvalStatusContainer
          );
        }
      });
  }

  reRender() {
    let sup = this;
    var approvalStatusContainer = document.getElementById(
      "approvalStatus" + this.props.businessId
    );
    var businessId = this.props.businessId;
    var businessApproval = this.props.businessApproval;
    if (businessApproval) {
      ReactDOM.render(
        <div key={sup.props.businessId} className="btn btn-success">
          Approved
        </div>,
        approvalStatusContainer
      );
    } else {
      ReactDOM.render(
        <div key={sup.props.businessId} className="btn btn-danger">
          Disabled
        </div>,
        approvalStatusContainer
      );
    }

    var ownerContainer = document.getElementById(
      "ownerContainer" + this.props.businessId
    );
    var email = this.props.email;
    var contact = this.props.contact;
    firebase
      .database()
      .ref("users")
      .child(this.props.userId)
      .on("value", function(dataSnapShot) {
        var imagePath = dataSnapShot.val().userImage;
        ReactDOM.render(
          <div key={sup.props.businessId} className="ml-1">
            <div className="d-flex flex-row align-middle">
              <div className="">
                <img
                  className="user-account-image mr-2 centered rounded-circle border border-secondary"
                  src={imagePath}
                  alt="Card image cap"
                />
              </div>
              <small className="align-middle">
                {dataSnapShot.val().userName}
              </small>
            </div>
            <div className="d-flex flex-row">
              <div className = "container">
                <div className = "row">
                <small>{email}</small>
                </div>
                <div className = "row">
                <small>{contact}</small>
                </div>
              </div>
            </div>
          </div>,
          ownerContainer
        );
      });
  }

  componentDidMount() {
    this.reRender();
  }
  render() {
    return (
      <div className = "col-sm-12 col-xl-6">
      <div className="card shadow-sm p-3 border-0 border">
        <div className="d-flex flex-row">
          <div className="">
            <img
              className="centered businessImage rounded-circle border border-secondary"
              src={this.props.restoProfileImagePath}
              alt="Card image cap"
            />
          </div>
          <div className="ml-3">
            <h5
              className="modal-title text-uppercase font-weight-light"
              id="exampleModalLabel"
            >
              {this.props.businessname}
            </h5>
            <div className="row pl-1">
              <small className="col text-secondary">
                {this.props.businessType}
              </small>
            </div>
            <div className="row pl-3 w-100 ">{this.props.address}</div>
            <div
              id={"ownerContainer" + this.props.businessId}
              className="row pl-2 w-100"
            />
            <div
              id={"approvalStatus" + this.props.businessId}
              onClick={this.changeBusinessStatus.bind(this)}
              className="row ml-1 mt-2 w-100 "
            />
          </div>
        </div>
      </div>
      </div>
    );
  }
}

function getBusinessProfileList() {
  var container = document.getElementById("businessProfileList");
  var businssProfilesObjects = [];

  firebase
    .database()
    .ref("businessProfiles")
    .on("value", function(dataSnapShot) {
      businssProfilesObjects = [];
      dataSnapShot.forEach(function(childSnapshot) {
        businssProfilesObjects.push(childSnapshot.val());
      });
      var listItem = businssProfilesObjects.map(object => (
        <Business
          key={object.key}
          businessId={object.key}
          businessname={object.name}
          restoProfileImagePath={object.restoProfileImagePath}
          businessApproval={object.businessApproval}
          businessType={object.businessType}
          address={object.address}
          userId={object.userId}
          email={object.email}
          contact={object.contact}
        />
      ));
      ReactDOM.render(<div className="row ml-5">{listItem}</div>, container);
    });
}

function getPending() {
  var container = document.getElementById("businessProfileList");
  var businssProfilesObjects = [];

  firebase
    .database()
    .ref("businessProfiles")
    .orderByChild("businessApproval")
    .equalTo(false)
    .on("value", function(dataSnapShot) {
      businssProfilesObjects = [];
      dataSnapShot.forEach(function(childSnapshot) {
        businssProfilesObjects.push(childSnapshot.val());
      });
      var listItem = businssProfilesObjects.map(object => (
        <PendingBusiness
          key={object.key}
          businessId={object.key}
          businessname={object.name}
          restoProfileImagePath={object.restoProfileImagePath}
          businessApproval={object.businessApproval}
          businessType={object.businessType}
          address={object.address}
          userId={object.userId}
          email={object.email}
          contact={object.contact}
        />
      ));
      ReactDOM.render(<div className="row ml-5">{listItem}</div>, container);
    });
}

function getApproved() {
  var container = document.getElementById("businessProfileList");
  var businssProfilesObjects = [];

  firebase
    .database()
    .ref("businessProfiles")
    .orderByChild("businessApproval")
    .equalTo(true)
    .on("value", function(dataSnapShot) {
      businssProfilesObjects = [];
      dataSnapShot.forEach(function(childSnapshot) {
        businssProfilesObjects.push(childSnapshot.val());
      });
      var listItem = businssProfilesObjects.map(object => (
        <ApprovedBusiness
          key={object.key}
          businessId={object.key}
          businessname={object.name}
          restoProfileImagePath={object.restoProfileImagePath}
          businessApproval={object.businessApproval}
          businessType={object.businessType}
          address={object.address}
          userId={object.userId}
          email={object.email}
          contact={object.contact}
        />
      ));
      ReactDOM.render(<div className="row ml-5">{listItem}</div>, container);
    });
}

class PendingBusiness extends React.Component {
  componentDidMount() {
    this.reRender();
  }
  changeBusinessStatus() {
    var aprroval = !this.props.businessApproval;
    var postData = {
      businessApproval: aprroval
    };
    firebase
      .database()
      .ref("businessProfiles")
      .child(this.props.businessId)
      .update(postData, function(error) {
        if (error) {
          // The write failed...
          console.log(error);
        } else {
          // Data saved successfully!
          console.log("success");
          getPending();
        }
      });
  }

  reRender() {
    var approvalStatusContainer = document.getElementById(
      "approvalStatus" + this.props.businessId
    );
    var businessId = this.props.businessId;
    var businessApproval = this.props.businessApproval;
    let sup = this;
    if (businessApproval) {
      ReactDOM.render(
        <div key={this.props.businessId} className="btn btn-success">
          Approved
        </div>,
        approvalStatusContainer
      );
    } else {
      ReactDOM.render(
        <div key={this.props.businessId} className="btn btn-danger">
          Disabled
        </div>,
        approvalStatusContainer
      );
    }

    var ownerContainer = document.getElementById(
      "ownerContainer" + this.props.businessId
    );
    var email = this.props.email;
    var contact = this.props.contact;
    firebase
      .database()
      .ref("users")
      .child(this.props.userId)
      .on("value", function(dataSnapShot) {
        var imagePath = dataSnapShot.val().userImage;
        ReactDOM.render(
          <div key={sup.props.businessId} className="ml-1">
            <div className="d-flex flex-row align-middle">
              <div className="">
                <img
                  className="user-account-image mr-2 centered rounded-circle border border-secondary"
                  src={imagePath}
                  alt="Card image cap"
                />
              </div>
              <small className="align-middle">
                {dataSnapShot.val().userName}
              </small>
            </div>
            <div className="d-flex flex-row">
              <div className = "container">
                <div className = "row">
                <small>{email}</small>
                </div>
                <div className = "row">
                <small>{contact}</small>
                </div>
              </div>
            </div>
          </div>,
          ownerContainer
        );
      });
  }

  render() {
    return (
      <div className = "col-sm-12 col-xl-6">
      <div className="card shadow-sm p-3 border-0 border">
        <div className="d-flex flex-row">
          <div className="">
            <img
              className="centered businessImage rounded-circle border border-secondary"
              src={this.props.restoProfileImagePath}
              alt="Card image cap"
            />
          </div>
          <div className="ml-3">
            <h5
              className="modal-title text-uppercase font-weight-light"
              id="exampleModalLabel"
            >
              {this.props.businessname}
            </h5>
            <div className="row pl-1">
              <small className="col text-secondary">
                {this.props.businessType}
              </small>
            </div>
            <div className="row pl-3 w-100 ">{this.props.address}</div>
            <div
              id={"ownerContainer" + this.props.businessId}
              className="row pl-2 w-100"
            />
            <div
              id={"approvalStatus" + this.props.businessId}
              onClick={this.changeBusinessStatus.bind(this)}
              className="row ml-1 mt-2 w-100 "
            />
          </div>
        </div>
      </div>
      </div>
    );
  }
}

class ApprovedBusiness extends React.Component {
  componentDidMount() {
    this.reRender();
  }
  changeBusinessStatus() {
    var aprroval = !this.props.businessApproval;
    var postData = {
      businessApproval: aprroval
    };
    firebase
      .database()
      .ref("businessProfiles")
      .child(this.props.businessId)
      .update(postData, function(error) {
        if (error) {
          // The write failed...
          console.log(error);
        } else {
          // Data saved successfully!
          console.log("success");
          getApproved();
        }
      });
  }

  reRender() {
    var approvalStatusContainer = document.getElementById(
      "approvalStatus" + this.props.businessId
    );
    var businessId = this.props.businessId;
    var businessApproval = this.props.businessApproval;
    if (businessApproval) {
      ReactDOM.render(
        <div key={this.props.businessId} className="btn btn-success">
          Approved
        </div>,
        approvalStatusContainer
      );
    } else {
      ReactDOM.render(
        <div key={this.props.businessId} className="btn btn-danger">
          Disabled
        </div>,
        approvalStatusContainer
      );
    }
    let sup = this;
    var ownerContainer = document.getElementById(
      "ownerContainer" + this.props.businessId
    );
    var email = this.props.email;
    var contact = this.props.contact;
    firebase
      .database()
      .ref("users")
      .child(this.props.userId)
      .on("value", function(dataSnapShot) {
        var imagePath = dataSnapShot.val().userImage;
        ReactDOM.render(
          <div key={sup.props.businessId} className="ml-1">
            <div className="d-flex flex-row align-middle">
              <div className="">
                <img
                  className="user-account-image mr-2 centered rounded-circle border border-secondary"
                  src={imagePath}
                  alt="Card image cap"
                />
              </div>
              <small className="align-middle">
                {dataSnapShot.val().userName}
              </small>
            </div>
            <div className="d-flex flex-row">
              <div className = "container">
                <div className = "row">
                <small>{email}</small>
                </div>
                <div className = "row">
                <small>{contact}</small>
                </div>
              </div>
            </div>
          </div>,
          ownerContainer
        );
      });
  }

  render() {
    return (
      <div className = "col-sm-12 col-xl-6">
      <div className="card shadow-sm p-3 border-0 border">
        <div className="d-flex flex-row">
          <div className="">
            <img
              className="centered businessImage rounded-circle border border-secondary"
              src={this.props.restoProfileImagePath}
              alt="Card image cap"
            />
          </div>
          <div className="ml-3">
            <h5
              className="modal-title text-uppercase font-weight-light"
              id="exampleModalLabel"
            >
              {this.props.businessname}
            </h5>
            <div className="row pl-1">
              <small className="col text-secondary">
                {this.props.businessType}
              </small>
            </div>
            <div className="row pl-3 w-100 ">{this.props.address}</div>
            <div
              id={"ownerContainer" + this.props.businessId}
              className="row pl-2 w-100"
            />
            <div
              id={"approvalStatus" + this.props.businessId}
              onClick={this.changeBusinessStatus.bind(this)}
              className="row ml-1 mt-2 w-100 "
            />
          </div>
        </div>
      </div>
      </div>
    );
  }
}

function setLoading() {
  ReactDOM.render(
    <div>Loading</div>,
    document.getElementById("businessProfileList")
  );
}
