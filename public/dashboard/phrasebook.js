function managePhraseBook(){
  ReactDOM.render(
    <PhraseBookContaier/>,document.getElementById("mainContainer")
  );
}


class PhraseBookContaier extends React.Component{
  getCategory(){
    var categoryContainer = document.getElementById("categoryContainer");
    var categoryObjects = [];

    firebase.database().ref("phrasebook/category").once('value',function (dataSnapShot){
      dataSnapShot.forEach(function(childSnapshot){
        console.log(childSnapshot.val());
        categoryObjects.push(childSnapshot.val());
      });
      var itemList = categoryObjects.map((object)=>
        <Category key={object.key} id={object.key} category={object.category}/>
      );
      ReactDOM.render(
        <div className="accordion" data-spy="scroll" data-target="#list-example" data-offset="0" id="accordionExample">{itemList}</div>,categoryContainer
      );

      var scrollspyItem = categoryObjects.map((object)=>
        <PhraseListScrollSpy key={object.key} id={object.key} category={object.category} />
      );

      ReactDOM.render(
        <div id="list-example" className="list-group">
          {scrollspyItem} 
        </div>,document.getElementById("scrollspy")
      );
      

    });
  }
  componentDidMount(){
    this.getCategory();
  }
  addCategory(){
    var category = $("#input-category").val();
    if (category.lenght!=0) {
      var key = firebase.database().ref("phrasebook/category").push().key;
      firebase.database().ref("phrasebook/category").child(key).set({
        category:category,
        key:key,
      });
      $("#addCategory").modal('hide');
      this.getCategory();
    }
  }

  render() {
    return(
      <div className = "row">
        <div className ="col-sm-12">
          <button type="button" data-toggle="modal" data-target="#addCategory" className="btn btn-primary">Add Category</button>
        </div>
        <div className ="col-sm-10" id="categoryContainer">

        </div>
        <div className = "col-sm-2">
          <div id = "scrollspy" className = "position-fixed">
           
          </div>
        </div>

        <div className="modal fade" id="addCategory" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-group">
                  <label for="exampleInputPassword1">Add Category</label>
                  <input type="text" className="form-control" id="input-category" placeholder=""/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" onClick = {this.addCategory.bind(this)} className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class PhraseListScrollSpy extends React.Component {

  state = {  }
  render() { 
    return (  
       <a class="list-group-item list-group-item-action text-secondary border-0" href={"#heading"+this.props.id}>{this.props.category}</a>
    );
  }
}
 



class Category extends React.Component{

addPhrase(){
  var phraseEnglish =$("#input-english"+this.props.id).val();
  var phraseKaraya = $("#input-karaya"+this.props.id).val();
  var categoryId = this.props.id;
  console.log(phraseEnglish+" "+phraseKaraya);
  if (phraseEnglish.lenght!=0 && phraseKaraya.lenght!=0) {
    var key = firebase.database().ref().child("phrasebook/translation").child(this.props.id).push().key;
    firebase.database().ref("phrasebook/translation").child(this.props.id).child(key).set({
      category:categoryId,
      english:phraseEnglish,
      karaya:phraseKaraya,
      key:key,
    });
    $("#addPhrase"+this.props.id).modal('hide');
    $("#input-english"+this.props.id).val("");
    $("#input-karaya"+this.props.id).val("");
    
  }
}
componentDidMount(){
  this.getPhraseList();
}
getPhraseList(){
  var phraseContainer = document.getElementById("phraseContainer"+this.props.id);
  

  firebase.database().ref("phrasebook/translation").child(this.props.id).on("value",function (dataSnapShot){
    var phraseObject=[];
    dataSnapShot.forEach(function(childSnapshot){
      phraseObject.push(childSnapshot.val());
    });
    phraseObject.reverse();
    var listItem = phraseObject.map((object)=>
    <PhrasesListItem key = {object.key} id = {object.key} phraseEnglish = {object.english} phraseKaraya = {object.karaya} phraseCategory = {object.category}/>
  );
  ReactDOM.render(
      <div className="list-group m-2 w-100">
        {listItem}
      </div>,phraseContainer
    );
  });
}

render() {
  return(
    <div className = "mb-2">
      <div className="card">
        <div className="card-header bg-white" id={"heading"+this.props.id}>
          <h5 className="mb-0">
            <button className="btn btn-link" type="button" data-toggle="collapse" data-target={"#collapseOne"+this.props.id} aria-expanded="true" aria-controls="collapseOne">
              {this.props.category}
            </button>
          </h5>
        </div>

        <div id={"collapseOne"+this.props.id} className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
          <div className="card-body ">
            <button type="button" data-toggle="modal" data-target={"#addPhrase"+this.props.id} className="btn btn-primary">Add Translation</button>
            <div className  = "row" id = {"phraseContainer"+this.props.id}>

            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id={"addPhrase"+this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <label for="exampleInputPassword1">Add phraseBook</label>
              <div className="form-group">
              <label for="exampleInputPassword1">English Phrase</label>
              <input type="text" className="form-control" id={"input-english"+this.props.id} placeholder=""/>
              </div>
              <div className="form-group">
                <label for="exampleInputPassword1">Karay.a</label>
                <input type="text" className="form-control" id={"input-karaya"+this.props.id} placeholder=""/>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" onClick = {this.addPhrase.bind(this)} className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
}
}


class PhrasesListItem extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      alert: "w-100 alert alert-danger invisible d-flex justify-content-between"
    }
  }
  deleteTranslation(){
    firebase.database().ref("phrasebook/translation").child(this.props.phraseCategory).child(this.props.id).remove();
    console.log("delete clicked");
  }
  
  setAlerState(){
    let visible = "w-100 alert alert-danger visible d-flex justify-content-between";
    let invisible = "w-100 alert alert-danger invisible d-flex justify-content-between";
    this.setState(
      {
        alert: (this.state.alert == visible )? invisible: visible ,
      }
    )
  }

  cancleDelete(){
    let invisible = "w-100 alert alert-danger invisible d-flex justify-content-between";
    this.setState(
      {
        alert: invisible,
      }
    )
  }
  updateTranslation(){
    let englishPhrase = $("#input-english"+this.props.id).val();
    let karayaPhrase = $("#input-karaya"+this.props.id).val();
    console.log(englishPhrase);
    firebase.database().ref("phrasebook/translation").child(this.props.phraseCategory).child(this.props.id).update({
      english: englishPhrase,
      karaya: karayaPhrase
    });
    $("#update"+this.props.id).modal('hide');
  }

  render() {
  
    return(
      <div className = "list-group-item m-1 border-0 list-group-item-action">
        <div className = "row">
          <div className = "col-sm-10">
            <div id = "perma" className = "row">
              <div className ="col-sm-10 m-3">
                <div className = "row">
                  <h5>English</h5>
                </div> 
                <div className = "row">
                 <h3>{this.props.phraseEnglish}</h3>
                </div>
              </div>
              <div className = "col-sm-10 m-3">
                <div className ="row">
                  <h5>Karay A</h5>
                </div>
                <div className = "row">
                  <h3>{this.props.phraseKaraya}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className = "col-sm-2">
            <button type="button" class="btn m-2 btn-success text-white" data-toggle="modal" data-target={"#update"+this.props.id}>
            <i  class="material-icons">
            edit
            </i>
            </button>
            <button type="button"  onClick = {this.setAlerState.bind(this)} class="btn m-2 btn-danger text-white">
            <i class="material-icons" >
            delete_forever
            </i>
            </button>
          </div>
        </div>
        <div className = "row w-100">
          <div className={this.state.alert} role="alert">
            <div><div className = "mt-1">Confirm Delete</div> </div> <div> <button type="button" onClick = {this.cancleDelete.bind(this)} class="btn btn-light btn-sm mr-3">Cancel</button>
             <button type="button" onClick = {this.deleteTranslation.bind(this)} class="btn btn-danger btn-sm">Remove</button></div>
          </div>
        </div>
        <div className="modal fade" id={"update"+this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Update Translation</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <div className="form-group">
                <label for="english">English</label>
                <input type="text" defaultValue = {this.props.phraseEnglish} className="form-control" id={"input-english"+this.props.id}/>
                <small id="emailHelp" className="form-text text-muted">Enter English Phrase</small>
              </div>
              <div className="form-group">
                <label for="karaya">Karay a</label>
                <input type="text" defaultValue = {this.props.phraseKaraya} className="form-control" id={"input-karaya"+this.props.id}/>
                <small id="emailHelp" className="form-text text-muted">Enter Karay a Phrase</small>
              </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" onClick = {this.updateTranslation.bind(this)} className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
