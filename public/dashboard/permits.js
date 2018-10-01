


class PermitsContainer extends React.Component {
  state = {  }
  getBusiness(){
    firebase
    .database()
    .ref("permitCategory")
    .on("value", function(dataSnapshot) {
      let busItem = [];
      dataSnapshot.forEach(function(childSnapshot) {
        busItem.push(childSnapshot);
        
      });
      let listItem = busItem.map(object => (
        <BusinessItemPermits
          key={object.key}
          businessKey = {object.key}
        />
      ));
      ReactDOM.render(<React.Fragment>{listItem}</React.Fragment>, document.querySelector("#businessContainer"));
    });
  }
  componentDidMount() {
    this.getBusiness();
  }
  
  render() { 
    return ( 
      <React.Fragment>
        <div className = "row">
          <h3>Manage Permits</h3>
        </div>
        <div className = "row">
         <div className = "col-3">
          <div className = "list-group" id = "businessContainer">

          </div>
         </div>
         <div className = "col-9" id = "permitCategoryContainer">
         
         </div>
        </div>
      </React.Fragment>
     );
  }
}
class BusinessItemPermits extends React.Component {
  state = { businessName:""  }
  getBusinessProfile(){
    let sup = this;
    firebase
    .database()
    .ref("businessProfiles")
    .child(this.props.businessKey)
    .on("value", function(dataSnapshot) {
      sup.setState({
        businessName:dataSnapshot.val().name
      })
    });
  }
  showCategory(){
     ReactDOM.render(
       <BusinessPermitsCategory key = {this.props.businessKey} businessKey = {this.props.businessKey}/>,
       document.querySelector("#permitCategoryContainer")
     )
  }
  componentDidMount(){
    this.getBusinessProfile();
  }
  render() { 
    return (  
      <div className = "list-group-item w-100" onClick = {this.showCategory.bind(this)}>
        <div className = "row p-3">
          <h5>{this.state.businessName}</h5>
        </div>
      </div>
    );
  }
}

function managePermits() {
  ReactDOM.render(
    <PermitsContainer />,
    document.getElementById("mainContainer")
  );
}

class BusinessPermitsCategory extends React.Component {
  state = { businessName:"",
  businessKey:""
}
  getBusinessProfile(){
    let sup = this;
    firebase
    .database()
    .ref("businessProfiles")
    .child(this.props.businessKey)
    .on("value", function(dataSnapshot) {
      sup.setState({
        businessName:dataSnapshot.val().name
      })
    });
  }
  getCategory(){
    firebase
    .database()
    .ref("permitCategory")
    .child(this.props.businessKey)
    .on("value", function(dataSnapshot) {
      let catItem = [];
      dataSnapshot.forEach(function(childSnapshot) {
        catItem.push(childSnapshot.val());
      });
      let listItem = catItem.map(object => (
        <BusinessPermitCategoryItem
          key={object.key}
          category = {object.category}
          id = {object.key}
          businessKey = {object.businessKey}
        />
      ));
      ReactDOM.render(<React.Fragment>{listItem}</React.Fragment>, 
      document.querySelector("#categoryContainer")
      );
    });
  }
  componentDidMount(){
    this.getBusinessProfile();
    this.getCategory();
  }
  render() {
    return ( 
      <React.Fragment>
        <div className = "row">
          <div className = "col">
          <h3>{this.state.businessName}</h3>
          </div>
        </div>
        <div className = "row">
        <div className = "list-group w-100" id = "categoryContainer">
          
        </div>
        </div>
      </React.Fragment>
     );
  }
}

class BusinessPermitCategoryItem extends React.Component {
  state = { 

   }
   getPermitItems(){
     let sup = this;
    firebase
    .database()
    .ref("permits")
    .child(this.props.businessKey)
    .child(this.props.id)
    .on("value", function(dataSnapshot) {
      let catItem = [];
      dataSnapshot.forEach(function(childSnapshot) {
        catItem.push(childSnapshot.val());
      });
      let listItem = catItem.map(object => (
        <BusinessPermitItem
          key={object.key}
          categoryKey = {object.categoryKey}
          id = {object.key}
          businessKey = {object.businessKey}
          imageUrl = {object.imageUrl}
        />
      ));
      ReactDOM.render(<React.Fragment>{listItem}</React.Fragment>, 
      document.querySelector("#permitItem"+sup.props.id)
      );
    });
   }
   componentDidMount(){
     this.getPermitItems();
   }
  render() { 
    return ( 
      <div className = "list-group-item border-0 w-100">
        <div className = "col-12">
        {this.props.category}
        </div>
        <div className = "col-12" >
        <div className = "row w-100 container-fluid"  id ={"permitItem"+this.props.id}>
        
        </div>
        </div>
      </div>
     );
  }
}

class BusinessPermitItem extends React.Component {
  state = {  }
  render() { 
    return (
      <React.Fragment>
        <div className = "col-4">
        <img src={this.props.imageUrl} class="rounded w-100 mx-auto d-block" alt="..." data-toggle="modal" data-target={"#"+this.props.id}/>
        </div>
      <div id = {this.props.id} className="modal fade bd-example-modal-lg" tabiIdex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className = "col-12 mt-5 p5-5">
            <img src={this.props.imageUrl} class="w-100 " alt="..."/>
            </div>
          </div>
        </div>
      </div>
      </React.Fragment>
     );
  }
}