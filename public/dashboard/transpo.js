function manageTranspo(){
    ReactDOM.render(
        <TranspoContainer/>,document.getElementById("mainContainer")
      );
}

class TranspoContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        openAddTranspo: "d-none",
        filename:"Choose file",
        upimageVis: "invisible",
        imgPath:""
        }
      }
    componentDidMount(){
    const container = document.getElementById("transpoContainer");
   
    firebase.database().ref("transportation").on("value",function (dataSnapshot){
        let transpoObject = [];
        dataSnapshot.forEach(function (childSnapshot){

            transpoObject.push(childSnapshot.val());
        });
        let listItem = transpoObject.map((object)=>
           <TranspoItem key = {object.key} 
           drivername = {object.name}
           price = {object.price}
           seats = {object.seats}
           contact = {object.number}
           origin = {object.origin}
           imgPath = {object.vanImg}
           id = {object.key}
            /> 
        );
        ReactDOM.render(
            <React.Fragment>
                {listItem}
            </React.Fragment>,container
        )
    });
    }
    addTranspoContainer(){
        this.setState({
            openAddTranspo: (this.state.openAddTranspo == "visible")? "d-none" : "visible"
        })
  
    }
    onfileSelect(){
        const superb = this;
        const ref = firebase.storage().ref();
        const file = $('#inputGroupFile01').get(0).files[0];
        const name = (+new Date()) + '-' + file.name;
        const metadata = { contentType: file.type };
        const task = ref.child("transpoImages").child(name).put(file, metadata);
        task.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                superb.setState({
                    imgPath:downloadURL,
                    upimageVis: "visible",
                    filename:name
                });
              console.log('File available at', downloadURL);
            });
          });
    }
    addTranspo(){
        let name = $("#driver-name").val();
        let price = $("#price").val();
        let seats = $("#seats").val();
        let origin = $("#origin").val();
        let phonenum = $("#contact-number").val();
        let imgPath = this.state.imgPath;
        const key = firebase.database().ref("transportation").push().key;
        firebase.database().ref("transportation").child(key).set({
            key:key,
            name:name,
            price:price,
            seats:seats,
            number:phonenum,
            origin:origin,
            vanImg:imgPath
        });
        $("#driver-name").val("");
        $("#price").val("");
        $("#seats").val("");
        $("#origin").val("");
        $("#contact-number").val("");
        this.addTranspoContainer();
    }
    render() {
        return (
          <div>
           <button type="button" onClick = {this.addTranspoContainer.bind(this)} className="btn btn-primary">Add Transpo</button>
            <div id= "addTranspo" className={"row w-100 mt-3 "+this.state.openAddTranspo}>
               <div className = "col-sm-4">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroupFileAddon01">Upload</span>
                    </div>
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" onChange = {this.onfileSelect.bind(this)} id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"/>
                        <label className="custom-file-label" for="inputGroupFile01">{this.state.filename}</label>
                    </div>
                </div>

                <img src = {this.state.imgPath} className = {"w-100 "+this.state.upimageVis}/>
               </div>
               <div className = "col-sm-8">
                    <div className="form-group">
                        <label for="exampleInputEmail1">Driver Name</label>
                        <input type="text" className="form-control" id="driver-name" aria-describedby="emailHelp" placeholder="Driver Name"/>
                        <small id="emailHelp" className="form-text text-muted">Full Name of the Driver</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1">Price</label>
                        <input type="number" className="form-control" id="price" aria-describedby="emailHelp" placeholder="Price"/>
                        <small id="emailHelp" className="form-text text-muted">Price of the Rent</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1">No of Seats</label>
                        <input type="number" className="form-control" id="seats" aria-describedby="emailHelp" placeholder="No of Seats"/>
                        <small id="emailHelp" className="form-text text-muted">Number of Seats Available</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1">Contact Number</label>
                        <input type="number" className="form-control" id="contact-number" aria-describedby="emailHelp" placeholder="Ex: +63916"/>
                        <small id="emailHelp" className="form-text text-muted">Driver's Contact Number</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1">Origin</label>
                        <input type="text" className="form-control" id="origin" aria-describedby="emailHelp" placeholder="Origin"/>
                        <small id="emailHelp" className="form-text text-muted">Origin of the Van</small>
                    </div>
                    
                    <button onClick = {this.addTranspo.bind(this)} className="btn btn-primary">Submit</button>
               </div>
            </div>
            <div className = "w-100" id = "transpoContainer">
                
            </div>
          </div>
        );
    }
}


class TranspoItem extends React.Component {
    state = {
         udpateExtend:"d-none",
         filename :"choose file to update",
         imagePath: this.props.imgPath
 }
 deleteTranspo(){
    firebase.database().ref("transportation").child(this.props.id).remove();
    
 }
 onfileSelect(){
    const superb = this;
    const ref = firebase.storage().ref();
    const file = $('#inputGroupFileUpdate'+this.props.id).get(0).files[0];
    const name = (+new Date()) + '-' + file.name;
    const metadata = { contentType: file.type };
    const task = ref.child("transpoImages").child(name).put(file, metadata);
    task.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            superb.setState({
                imagePath:downloadURL,
                filename:name
            });
          console.log('File available at', downloadURL);
        });
      });
}
    extendUpdateContainer(){
        this.setState({
            udpateExtend: this.state.udpateExtend == "d-none" ? "visible" : "d-none"
        });
    }

    updateTranspo(){
        let name = $("#driver-name"+this.props.id).val();
        let price = $("#price"+this.props.id).val();
        let seats = $("#seats"+this.props.id).val();
        let origin = $("#origin"+this.props.id).val();
        let phonenum = $("#contact-number"+this.props.id).val();
        let imgPath = this.state.imagePath;
        
        firebase.database().ref("transportation").child(this.props.id).update({
            name:name,
            price:price,
            seats:seats,
            number:phonenum,
            origin:origin,
            vanImg:imgPath
        });
        this.extendUpdateContainer();
    }
    render() { 
        return (
        <React.Fragment>
            <div className = "row shadow-sm">
                    
                    <div className = "col-sm-12 col-md">
                    <small>Driver Name</small><br/>
                    {this.props.drivername}
                    </div>
                    <div className = "col-sm-12 col-md">
                    
                    <small>Contact</small><br/>
                    {this.props.contact}
                    </div>
                    <div className = "col-sm-12 col-md">
                    <small>Price</small><br/>
                    {this.props.price}
                    </div>
                    <div className = "col-sm-12 col-md">
                    <small>Searts</small><br/>
                    {this.props.seats}
                    </div>
                    
                    <div className = "col-sm-12 col-md">
                    <small>Origin</small><br/>
                    {this.props.origin}
                    </div>
                    <div className = "col-sm-12 col-md">
                    
                    <button type="button" class="btn btn-outline-success m-1" onClick = {this.extendUpdateContainer.bind(this)}>Update</button>
                    <button type="button" class="btn btn-outline-danger m-1" data-toggle="modal" data-target={"#deleteTranspo"+this.props.id}>Delete</button>
                    </div>
                
            </div> 
            <div className = {"row "+this.state.udpateExtend}>
            <div className = "col-sm-4">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id = {"describedImage"+this.props.id}>Upload</span>
                    </div>
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" onChange = {this.onfileSelect.bind(this)}  id={"inputGroupFileUpdate"+this.props.id} aria-describedby={"describedImage"+this.props.id}/>
                        <label className="custom-file-label" for={"inputGroupFileUpdate"+this.props.id}>{this.state.filename}</label>
                    </div>
                </div>

                <img src = {this.state.imagePath} className = {"w-100 "}/>
               </div>
               <div className = "col-sm-8">
                    <div className="form-group">
                        <label for="exampleInputEmail1">Driver Name</label>
                        <input type="text" defaultValue = {this.props.drivername} className="form-control" id={"driver-name"+this.props.id} aria-describedby="emailHelp" placeholder="Driver Name"/>
                        <small id="emailHelp" className="form-text text-muted">Full Name of the Driver</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1">Price</label>
                        <input type="number" defaultValue = {this.props.price} className="form-control" id={"price"+this.props.id} aria-describedby="emailHelp" placeholder="Price"/>
                        <small id="emailHelp" className="form-text text-muted">Price of the Rent</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1">No of Seats</label>
                        <input type="number" defaultValue = {this.props.seats} className="form-control" id={"seats"+this.props.id} aria-describedby="emailHelp" placeholder="No of Seats"/>
                        <small id="emailHelp" className="form-text text-muted">Number of Seats Available</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1">Contact Number</label>
                        <input type="number" defaultValue = {this.props.contact} className="form-control" id={"contact-number"+this.props.id} aria-describedby="emailHelp" placeholder="Ex: +63916"/>
                        <small id="emailHelp" className="form-text text-muted">Driver's Contact Number</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1">Origin</label>
                        <input type="text" defaultValue = {this.props.origin} className="form-control" id={"origin"+this.props.id} aria-describedby="emailHelp" placeholder="Origin"/>
                        <small id="emailHelp" className="form-text text-muted">Origin of the Van</small>
                    </div>
                    
                  
                    <button className="btn btn-primary" onClick = {this.updateTranspo.bind(this)}>Submit</button>
               </div>
            </div>
            {/* delete transpo modal */}
            <div className="modal fade" id={"deleteTranspo"+this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-body">
                        Delete Transpo?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick = {this.deleteTranspo.bind(this)}>Delete</button>
                    </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
        
     );
    }
}
 


