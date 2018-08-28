function getDashbaord() {
  ReactDOM.render(
    <DashbaoardContainer />,
    document.getElementById("mainContainer")
  );
}

class DashbaoardContainer extends React.Component {
 
  constructor(props){
    super(props);
    this.state = {
        userType: "owner",
        ownera: "bg-dark text-white",
        usera:" t",
        listTitle:"Business Owners",
      }
  }
  getOwners() {
    firebase
      .database()
      .ref("users")
      .orderByChild("owner")
      .equalTo(true)
      .on("value", function(dataSnapShot) {
        console.log(dataSnapShot);
        var phraseObject = [];
        var number = 0;
        dataSnapShot.forEach(function(childSnapshot) {
          phraseObject.push(childSnapshot.val());
          number++;
        });
        phraseObject.reverse();
        var listItem = phraseObject.map(object => (
          <UsersItem username={object.userName} email={object.email} />
        ));

        ReactDOM.render(
          <div className="list-group m-2 w-100">{listItem}</div>,
          document.getElementById("usersList")
        );
        ReactDOM.render(number, document.getElementById("businessOwnerNumber"));
      });
      this.setOwnerActive();
  }

  getUsers() {
    firebase
      .database()
      .ref("users")
      .orderByChild("user")
      .equalTo(true)
      .on("value", function(dataSnapShot) {
        console.log(dataSnapShot);
        var phraseObject = [];
        var number = 0;
        dataSnapShot.forEach(function(childSnapshot) {
          phraseObject.push(childSnapshot.val());
          number++;
        });
        phraseObject.reverse();
        var listItem = phraseObject.map(object => (
          <UsersItem username={object.userName} email={object.email} />
        ));

        ReactDOM.render(
          <div className="list-group m-2 w-100">{listItem}</div>,
          document.getElementById("usersList")
        );
        ReactDOM.render(number, document.getElementById("usersNumber"));
      });
      this.setUserActive();
  }
    setOwnerActive(){
        this.setState({
            listTitle:"Business Owners",
            ownera: "bg-dark text-white",
            usera:" t"
        });
  }
  setUserActive(){
    this.setState({
        listTitle:"Users of App for Tourist",
        usera: "bg-dark text-white",
        ownera:" t"
       })
  
  }
  componentDidMount() {
    this.getUsers();
    this.getOwners();
  }
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <h3>Dashboard</h3>
        </div>
        <div className="row">
          <div className="col-sm-3 ">
            <div onClick = {this.getOwners.bind(this)}  className={"row p-5 shadow rounded "+this.state.ownera}>
                <div className = {"col"}>
                <div className="row ">Business Owners</div>
                <div className="row">
                    <h1 id="businessOwnerNumber" />
                </div>
                </div>
            </div>
            <div onClick = {this.getUsers.bind(this)} className={"row p-5 mt-5 shadow rounded "+this.state.usera}>
             <div className = "col">
             <div className="row "><small>Users of App for Tourist</small></div>
              <div className="row">
                <h1 id="usersNumber" />
              </div>
             </div>
            </div>
          </div>
          <div className="col-sm-9 pl-5">
            <div className = "row">
                <h2>{this.state.listTitle}</h2>
            </div>
            <div className="row">
              <ul class="list-group" id="usersList" />
            </div>
          </div>
        </div>

        {/* <div className="row">
          <div className="col-sm-3 p-5 shadow rounded">
            <div className="row ">Business Owners</div>
            <div className="row">
              <h1 id="businessOwnerNumber" />
            </div>
          </div>
          <div className="col-sm-3 ml-3  p-5 shadow rounded">
            <div className="row ">Application Users</div>
            <div className="row">
              <h1 id="usersNumber" />
            </div>
          </div>
        </div> */}
      </React.Fragment>
    );
  }
}
getDashbaord();
class UsersItem extends React.Component {
  state = {};
  render() {
    return (
      <div className="list-group-item border-0 rounded list-group-item-action ml-3">
        <div className="row pl-1 pr-1 pt-1">{this.props.username}</div>
        <div className="row">
          <small>{this.props.email}</small>
        </div>
      </div>
    );
  }
}
