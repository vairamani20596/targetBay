import React, {Component} from 'react'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
// import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      edit:false,
      userData:[],
      indexTitle: "",
      draggedData:{}
    }
  }
componentDidMount(){
  var getArr = localStorage.getItem("userDB");
  const newdata =  getArr ? JSON.parse(getArr) : []
  this.setState({ userData : [...newdata]})
}
  getInputDetails = (e, name) => {
    switch(name){ 
      case 'firstName':
      return this.setState({firstName:e.target.value }) 
      case 'lastName':
        return this.setState({lastName:e.target.value })
      case 'email':
        return this.setState({email:e.target.value })   
      default :
      return
    }
  }

     pushUserDetail = (e) => {
       e.preventDefault()
      let obj = {
        firstName : this.state.firstName,
        lastName : this.state.lastName,
        email: this.state.email
      }
      let val = this.state.userData
      val.push(obj)
      this.setState({
        userData : [...val],
        firstName:"",
        lastName:"",
        email:""
      },()=>{
        var uniqueArr = this.state.userData.reduce((acc, current) => {
          const x = acc.find(item => item.email === current.email);
          if (!x) {
            return acc.concat([current]);
          } else {
            alert('Email-ID already exists')
            return acc;
          }
        }, []);
        this.setState({
          userData: [...uniqueArr]
        },()=>{
          var arr = JSON.stringify(this.state.userData)
          localStorage.setItem("userDB", arr);
        })
      })
    }
    editDetails(index){
      this.setState({indexTitle: index})
    }  
  updateonChangeValues = (e, index) => {
   let update = this.state.userData;
   update[index][e.target.name] = e.target.value;
    this.setState({userData: [...update]},()=>{
      var arr = JSON.stringify(this.state.userData)
      localStorage.setItem("userDB", arr);
    }) 
  }

  DeleteMethod = (index) => {
   this.state.userData.splice(index , 1)
   this.setState({
     userData:[...this.state.userData]
   },()=>{
    var arr = JSON.stringify(this.state.userData)
    localStorage.setItem("userDB", arr);
   })
   

  }

  //drag items

  onDragEnd = (result) => {
    console.log(result)
    const {destination, source, reason} = result;
    
    if(!destination || reason === 'CANCEL'){
      return;   
    }

    if(destination.droppableId === source.droppableId && destination.index === source.index){
      return;
    }

    const users = Object.assign([],this.state.userData)
    const droppedUser =this.state.userData[source.index];

    users.splice(source.index, 1)
    users.splice(destination.index, 0, droppedUser)

    this.setState({
      userData:users
    },()=>{
      var arr = JSON.stringify(this.state.userData)
      localStorage.setItem("userDB", arr);
    })
   
  }

  
render(){
 
  return (
    <>
    <div  style={{margin:'80px'}}>
      <div className="card">
      <div className="card-header text-center">
        <h3>Add User Form</h3>
      </div>
      <div className="card-body">
      <form  onSubmit={this.pushUserDetail}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="firstName">First Name</label>
            <input className="form-control" maxLength="45" id="firstName" type="text" name="firstName" value={this.state.firstName}  placeholder="Enter your first name"  onChange={(e)=>this.getInputDetails(e, 'firstName')} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" className="form-control" maxLength="45" id="lastName" name="lastName" value={this.state.lastName}  placeholder="Enter your last name" onChange={(e)=>this.getInputDetails(e, 'lastName')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email-ID</label>
          <input type="email" className="form-control" id="email" name="email"  value={this.state.email}  placeholder="Enter your email-ID" onChange={(e)=>this.getInputDetails(e, 'email')}/>
        </div>
        {this.state.userData.length < 20 ?
        <div className="text-center">
          <button type="submit" disabled={!this.state.firstName || !this.state.lastName || !this.state.email} className="btn btn-primary" >Save</button>
        </div> :<div className="text-center">Only up to 20 people will be allowed.Here no space</div> }
        </form>
      </div>
    </div>
    <DragDropContext onDragEnd={this.onDragEnd}>
    <table className="table table-bordered">
      <thead className="thead-dark">
        <tr>
          <th>S.No</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email-ID</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <Droppable droppableId="dp1">
        {
          (provided) => (
            <tbody ref={provided.innerRef} {...provided.droppableProps}>
            {this.state.userData.map((userDetail , index) => 
                  (
                    <Draggable key={index} draggableId={index+''} index={index}>
                      {(provided) => (
                        <tr key={index} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        {
                          this.state.edit && this.state.indexTitle === index ? 
                          <>
                          <th>{index + 1}</th> 
                          <td><input type="text" name="firstName" value={userDetail['firstName']}  placeholder="Enter your first name"  onChange={(e)=>this.updateonChangeValues(e, index)} /></td>
                          <td><input type="text" name="lastName" value={userDetail['lastName']}  placeholder="Enter your last name" onChange={(e)=>this.updateonChangeValues(e, index)} /></td>
                          <td><input type="email" name="email"  value={userDetail['email']}  placeholder="Enter your email-ID" onChange={(e)=>this.updateonChangeValues(e, index)}/></td></> 
                          : 
                          <>
                          <th>{index + 1}</th> 
                            <td> {userDetail.firstName}</td>
                            <td>{userDetail.lastName}</td>
                            <td>{userDetail.email}</td>
                            </>
                        }
                        
                        <td><button type="button" className="btn btn-secondary" onClick={()=>{this.setState({edit:true},()=>{this.editDetails(index)})}} disabled={this.state.edit}>Edit</button></td> 
                        <td><button type="button" className="btn btn-secondary" onClick={()=>{this.setState({edit:false})}} disabled={!this.state.edit}>update</button></td>
                        <td><button type="button" className="btn btn-danger"    onClick={()=>this.DeleteMethod(index)}>Delete</button></td>
                      </tr>
                      )}
                    </Draggable>
                  ) 
            
              )}
              {/* {provided.placeholder} */}
            </tbody>
          )
        }
       </Droppable>
    </table>
    </DragDropContext>
  </div>
  </>
  );
}
}

export default App;