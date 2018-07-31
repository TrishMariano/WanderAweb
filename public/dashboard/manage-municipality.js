function manageMunicipality(){
  ReactDOM.render(
    <MunicipalityContainer/>,document.getElementById("mainContainer")
  );
}


class MunicipalityContainer extends React.Component{
  getCategory(){
    var municipalityListContainer = document.getElementById("categoryContainer");
    var categoryObjects = [];
    var munObjects = [];
    firebase.database().ref("municipality").once("value",function(data){
        data.forEach(function(childData){
            munObjects.push(childData.val());
        });
        var listItem = munObjects.map((object)=>
        <Municipality key = {object.key} id={object.key} municipality = {object.municipality}/>
        );
        ReactDOM.render(
          <div class="accordion" id="accordionExample">{listItem}</div>,municipalityListContainer
        );
    });
  }
  componentDidMount(){
    this.getCategory();
  }
  addCategory(){

  }
  render() {
    return(
      <div className = "row">
        <div className ="col-sm-12">
          <button type="button" data-toggle="modal" data-target="#addCategory" className="btn btn-primary">Add Municipality</button>
        </div>
        <div className ="col-sm-12" id="categoryContainer">

        </div>
        <div className="modal fade" id="addCategory" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-group">
                  <label for="exampleInputPassword1">Add Municipality</label>
                  <input type="text" className="form-control" id="input-category" placeholder=""/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Municipality extends React.Component{

  addBarangay(){
    var id = this.props.id;
    var  inptMun = $("#input-barangay"+id).val();
    var munId = this.props.id;
    if (inptMun.lenght!=0) {
        var key = firebase.database().ref().child("barangay").push().key;
        firebase.database().ref().child("barangay").child(munId).child(key).set({
          barangay: inptMun,
          key: key,
          munId:munId,
        });
        $("#input-barangay"+id).val("");
        $("#addBarangay"+id).modal('hide');

      } else {
        alert("input invalid");
      }
      this.getbarangayList();
  }


componentDidMount(){
this.getbarangayList();
firebase.database().ref("barangay").child(this.props.id).on("child_changed",function(dataSnapShot){
getbarangayList(this.props.id);
console.log("triggred");
});
}
getbarangayList(){
  var barangayObjects = [];
  var barangayContainer = document.getElementById("barangayContainer"+this.props.id);
  firebase.database().ref("barangay").child(this.props.id).once("value",function(dataSnapShot){
    dataSnapShot.forEach(function (childSnapshot){
      barangayObjects.push(childSnapshot.val());
    });
    var itemList = barangayObjects.map((object)=>
    <BarangayList key = {object.key} munId = {object.munId} id = {object.key} barangayName = {object.barangay}/>
  );
  ReactDOM.render(
    <div className="row w-100 ml-3">{itemList}</div>,barangayContainer
  );
  });
}
render() {
  return(
    <div>
      <div class="card">
       <div class="card-header" id={"headingOne"+this.props.id}>
         <h5 class="mb-0">
           <button class="btn btn-link" type="button" data-toggle="collapse" data-target={"#collapseOne"+this.props.id} aria-expanded="true" aria-controls="collapseOne">
             {this.props.municipality}
           </button>
         </h5>
       </div>
       <div id={"collapseOne"+this.props.id} class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
         <div class="card-body">
           <button type="button" data-toggle="modal" data-target={"#addBarangay"+this.props.id} className="btn btn-primary">Add Barangay</button>
           <div className  = "row w-100" id = {"barangayContainer"+this.props.id}>

           </div>
         </div>
       </div>
     </div>
     <div className="modal fade" id={"addBarangay"+this.props.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
       <div className="modal-dialog" role="document">
         <div className="modal-content">
           <div className="modal-body">
             <div className="form-group">
               <label for="exampleInputPassword1">Barangay</label>
               <input type="text" className="form-control" id={"input-barangay"+this.props.id} placeholder=""/>
             </div>
           </div>
           <div className="modal-footer">
             <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
             <button type="button" onClick = {this.addBarangay.bind(this)} className="btn btn-primary">Save changes</button>
           </div>
         </div>
       </div>
     </div>
    </div>
  );
}
}

class BarangayList extends React.Component{
  deleteBarangay(){
    firebase.database().ref("barangay").child(this.props.munId).child(this.props.id).remove();
    getbarangayList(this.props.munId);
  }
  render(){
    return(
      <div className = "col-sm-3 d-flex justify-content-between bg-light border-0 rounded m-1">
        <h3>{this.props.barangayName}</h3> <button type="button" class="btn btn-danger text-white">
        <i onClick = {this.deleteBarangay.bind(this)} class="material-icons">
        delete_forever
        </i>
        </button>
      </div>
    );
  }
}

function getbarangayList(id){
  var barangayObjects = [];
  var barangayContainer = document.getElementById("barangayContainer"+id);
  firebase.database().ref("barangay").child(id).once("value",function(dataSnapShot){
    dataSnapShot.forEach(function (childSnapshot){
      barangayObjects.push(childSnapshot.val());
    });
    var itemList = barangayObjects.map((object)=>
    <BarangayList key = {object.key} munId = {object.munId} id = {object.key} barangayName = {object.barangay}/>
  );
  ReactDOM.render(
    <div className="row w-100  m-2 pt-3">{itemList}</div>,barangayContainer
  );
  });
}
