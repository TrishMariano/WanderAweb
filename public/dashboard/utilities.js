function utilities(){
  ReactDOM.render(
    <UtilitiesMainContainer/>,document.getElementById("mainContainer")
  );
}
function getMunicipalityList(){
  var municipalityListContainer = document.getElementById("municipalityListContainer");
  var munObjects = [];
  firebase.database().ref("municipality").once("value",function(data){
      data.forEach(function(childData){
          munObjects.push(childData.val());
      });
      var listItem = munObjects.map((object)=>
      <MunicipalityList key = {object.key} id={object.key} municipality = {object.municipality}/>
      );

      ReactDOM.render(
        <div className="list-group" id="list-tab" role="tablist">{listItem}</div>,municipalityListContainer
      );
  });
}

class BarangayListContainer extends React.Component{
  addBarangay(){
    var  inptMun = $("#input-barangay").val();
    var munId = this.props.id;
    if (inptMun.lenght!=0) {
        var key = firebase.database().ref().child("barangay").push().key;
        firebase.database().ref().child("barangay").child(munId).child(key).set({
          barangay: inptMun,
          key: key,
          munId:munId,
        });
        $("#input-barangay").val("");
        $("#addBarangay").modal('hide');

      } else {
        alert("input invalid");
      }
  }
  render(){
    return(
      <div className = "container">
        <div className = "row">
            <button type="button" data-toggle="modal" data-target="#addBarangay" className="btn btn-primary">Add Barangay</button>
        </div>
        <div className = "row">

        </div>
        {/* addBarangay */}
        <div className="modal fade" id="addBarangay" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-group">
                  <label for="exampleInputPassword1">Barangay</label>
                  <input type="text" className="form-control" id="input-barangay" placeholder=""/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" onClick={this.addBarangay.bind(this)} className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class UtilitiesMainContainer extends React.Component{
  componentDidMount(){
    getMunicipalityList();
  }
  insertMunicipality(){
    console.log("insertMunicipality");
    var inptMun = $("#input-municipality").val();

    if (inptMun.lenght!=0) {
        var key = firebase.database().ref().child("municipality").push().key;
        firebase.database().ref().child("municipality").child(key).set({
          municipality: inptMun,
          key: key,
        });
        $("#input-municipality").val("");
        $("#addMunicipality").modal('hide');
        getMunicipalityList();

      } else {
        alert("input invalid");
      }
  }
  render(){
    return(
      <div className = "row w-100">
        <div className = "col-sm-2">
          <div className="text-uppercase nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">Manage Municipality</a>
            {/* <a className="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">Pending Request <span id ="pending-request" className="badge badge-danger"></span></a>
            <a className="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false">Approved Request</a>
            <a className="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">Business Owners</a> */}
          </div>
        </div>
        <div className ="col-sm-10" id="municipalityList">
          <div className = "row">
            <button type="button" data-toggle="modal" data-target="#addMunicipality" className="btn btn-primary">Add Municipality</button>
          </div>
          <div className ="row mt-3">
            <div id = "municipalityListContainer" className = "col-sm-3">

            </div>
            <div className ="col mt-3" id="barangayContainer">

            </div>
          </div>
        </div>
        {/* add Municipality Modal */}
        <div className="modal fade" id="addMunicipality" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-group">
                  <label for="exampleInputPassword1">Municipality</label>
                  <input type="text" className="form-control" id="input-municipality" placeholder=""/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" onClick={this.insertMunicipality.bind(this)} className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class MunicipalityList extends React.Component{
  loadBarangayContainer(){
    ReactDOM.render(
      <BarangayListContainer id = {this.props.id}/>,document.getElementById("barangayContainer")
    );
  }
  render(){
    return(
      <div className = "list-group-item list-group-item-action" onClick={this.loadBarangayContainer.bind(this)} data-toggle="list" role="tab">
        <div className = "row">
            <div className="col">{this.props.municipality}</div><div><button type="button" class="m-1 col btn btn-light">Update</button><button type="button" class="m-1 col btn btn-danger">Remove</button> </div>
        </div>
      </div>
    );
  }
}
