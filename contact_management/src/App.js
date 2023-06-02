//src/App.js
import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      name: '',
      email: '',
      country: '',
      city: '',
      job: '',
      contacts: [],
      editingId: null // Add a new state variable for editing contact
    };
    this.setId = this.setId.bind(this);
  }
  setId(id) {
    this.setState({ id }, () => {
      this.deleteFromID(this.state.id) 
      //console.log(this.state.id);
    });
  }
  //this should delete row on button click
  deleteFromID(val) {
  
    let formData = new FormData();
    formData.append('id', val)
  console.log(formData);
    axios({
        method: 'post',
        url: 'http://racun.local/react_contact/contact_backend/contact.php',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(response => {
        //handle success
        console.log(response)
        alert('Contact Successfully Deleted.');
  
        // fetch the updated contact list from the backend API
        this.componentDidMount(); 
    })
    .catch(function (response) {
        //handle error
        console.log(response)
    });
  }
 
 //This will load Contact Table
  componentDidMount() {
    const url = 'http://racun.local/react_contact/contact_backend/contact.php'
    axios.get(url).then(response => response.data)
    .then((data) => {
      this.setState({ contacts: data })
      console.log(this.state.contacts)
     })
  }
 
  handleFormSubmit(event) {
    event.preventDefault();
  
    let formData = new FormData();
    formData.append('name', this.state.name)
    formData.append('email', this.state.email)
    formData.append('city', this.state.city)
    formData.append('country', this.state.country)
    formData.append('job', this.state.job)
  
    let url = 'http://racun.local/react_contact/contact_backend/contact.php';
    let method = 'post';
  
    // If editingId is set, it means we are updating an existing contact
    if (this.state.editingId !== null) {
      formData.append('editingId', this.state.editingId);
      method = 'post';
    }
    //debugger;
    axios({
      method,
      url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
      .then(response => {
        //handle success
        console.log(response)
        let message = '';
        if (this.state.editingId === null) {
          message = 'New Contact Successfully Added.';
        } else {
          message = 'Contact Successfully Updated.';
          // Clear the editing state
          this.setState({ editingId: null });
        }
        alert(message);
  
        // fetch the updated contact list from the backend API
        this.componentDidMount();
      })
      .catch(function (response) {
        //handle error
        console.log(response)
      });
  }
  
  editContact(contact) {
    this.setState({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      country: contact.country,
      city: contact.city,
      job: contact.job,
      editingId: contact.id // set the editingId to the ID of the contact being edited
    }, () => {
      console.log(this.state.editingId);
    });
  }
  
  
 
  
    
    
  
  
 
  render() {
    return (
      <div className="container">
        <h1 className="page-header text-center">Contact Management</h1>
         <div className='row'>
        <div className="col-md-4">
            <div className="panel panel-primary">
                <div className="panel-heading"><span className="glyphicon glyphicon-user"></span> Add New Contact</div>
                <div className="panel-body">
                <form>
                    <label>Name</label>
                    <input type="text" name="name" className="form-control" value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>

                    <label>Email</label>
                    <input type="email" name="email" className="form-control" value={this.state.email} onChange={e => this.setState({ email: e.target.value })}/>

                    <label>Country</label>
                    <input type="text" name="country" className="form-control" value={this.state.country} onChange={e => this.setState({ country: e.target.value })}/>

                    <label>City</label>
                    <input type="text" name="city" className="form-control" value={this.state.city} onChange={e => this.setState({ city: e.target.value })}/>

                    <label>Job</label>
                    <input type="text" name="job" className="form-control" value={this.state.job} onChange={e => this.setState({ job: e.target.value })}/>

                    <br/>

                    {this.state.editingId ? (
                      <input type="submit" className="btn btn-primary btn-block" onClick={e => this.handleFormSubmit(e)} value="Update Contact" />
                    ) : (
                      <input type="submit" className="btn btn-primary btn-block" onClick={e => this.handleFormSubmit(e)} value="Add Contact" />
                      )}
                      
                      </form>

                </div>
            </div>
        </div>
 
        <div className="col-md-8">  
        <h3>Contact Table</h3>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Country</th>
              <th>City</th>
              <th>Job</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.contacts.map((contact, index) => (
              <tr key={index}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.country}</td>
                <td>{contact.city}</td>
                <td>{contact.job}</td>
                <td style={{textAlign: 'center'}}>
                <button type="button" className="btn btn-outline-primary" onClick={() => this.editContact(contact)}>Edit</button>&nbsp;
                <button type="button" className="btn btn-outline-danger" onClick={() => this.setId(contact.id)}>Delete</button>
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>

         </div>  
         </div>
        </div>
    );
  }
}
export default App;