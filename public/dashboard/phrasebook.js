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
        <div className="accordion" id="accordionExample">{itemList}</div>,categoryContainer
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
        <div className ="col-sm-12" id="categoryContainer">

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
    this.getPhraseList();
  }
}
componentDidMount(){
  this.getPhraseList();
}
getPhraseList(){
  var phraseContainer = document.getElementById("phraseContainer"+this.props.id);
  var phraseObject=[];
  firebase.database().ref("phrasebook/translation").child(this.props.id).once("value",function (dataSnapShot){
    dataSnapShot.forEach(function(childSnapshot){
      phraseObject.push(childSnapshot.val());
    });
    var listItem = phraseObject.map((object)=>
    <PhrasesListItem key = {object.key} phraseEnglish = {object.english} phraseKaraya = {object.karaya} phraseCategory = {object.category}/>
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
    <div>
      <div className="card">
        <div className="card-header" id={"heading"+this.props.id}>
          <h5 className="mb-0">
            <button className="btn btn-link" type="button" data-toggle="collapse" data-target={"#collapseOne"+this.props.id} aria-expanded="true" aria-controls="collapseOne">
              {this.props.category}
            </button>
          </h5>
        </div>

        <div id={"collapseOne"+this.props.id} className="collapse border" aria-labelledby="headingOne" data-parent="#accordionExample">
          <div className="card-body">
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
  deleteTranslation(){

  }
  render() {
    return(
      <div className = "list-group-item m-1 list-group-item-action">
        <div className = "row">
          <div className = "col-sm-10">
            <div className = "row">
              <div className ="col-sm-12">
                English -> {this.props.phraseEnglish}
              </div>
              <div className = "col-sm-12">
                Karay-a -> {this.props.phraseKaraya}
              </div>
            </div>
          </div>
          <div className = "col-sm-2">
            <button type="button" class="btn m-2 btn-success text-white">
            <i onClick = {this.deleteTranslation.bind(this)} class="material-icons">
            edit
            </i>
            </button>
            <button type="button" class="btn m-2 btn-danger text-white">
            <i onClick = {this.deleteTranslation.bind(this)} class="material-icons">
            delete_forever
            </i>
            </button>
          </div>

        </div>
      </div>
    )
  }
}
