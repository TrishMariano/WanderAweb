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
           origin = {object.origin}
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
        let imgPath = this.state.imgPath;
        const key = firebase.database().ref("transportation").push().key;
        firebase.database().ref("transportation").child(key).set({
            key:key,
            name:name,
            price:price,
            seats:seats,
            origin:origin,
            vanImg:imgPath
        });
        $("#driver-name").val("");
        $("#price").val("");
        $("#seats").val("");
        $("#origin").val("");

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
                <img src = {this.state.imgPath} className = {"van-image "+this.state.upimageVis}/>
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
            <div className ="row w-100">
                <div className = "font-weight-bold col">
                Driver Name
                </div>
                <div className = "font-weight-bold col">
                Contact Number
                </div>
                <div className = "col font-weight-bold">
                Price
                </div>
                <div className = "col font-weight-bold">
                Seats
                </div>
                <div className = "col font-weight-bold">
                Origin
                </div>
                <div className = "col font-weight-bold">
                
                </div>

            </div>  
            <div className = "w-100" id = "transpoContainer">
                
            </div>
          </div>
        );
    }
}


class TranspoItem extends React.Component {
    state = {  }
    render() { 
        return (
        <div className = "row">
           
                <div className = "col">
                {this.props.drivername}
                </div>
                <div className = "col">
                
                </div>
                <div className = "col">
                {this.props.price}
                </div>
                <div className = "col">
                {this.props.seats}
                </div>
                <div className = "col">
                {this.props.origin}
                </div>
                <div className = "col">
                
                <button type="button" class="btn btn-outline-success m-1">Update</button>
                <button type="button" class="btn btn-outline-danger m-1">Delete</button>
                </div>
            
       </div> 
     );
    }
}
 


