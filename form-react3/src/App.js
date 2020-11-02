import React, { Component } from 'react';
import './App.css';

class App extends Component {

constructor(){
  super();
  this.state={
    inputValue:''
  }
  this.inputChange = this.inputChange.bind(this);
}


inputChange(event){
this.setState({
  value: event.target.value
})
console.log(this.state.value)
}

inputSubmit(event){
  alert('la valeur a été envoyée : ' + this.state.value);
  event.preventDefault();
}

  render() {
    return (
      <div className="App" >
        <form method="POST" action="/form/signup" onSubmit={this.inputSubmit}>
          <input name="username"  value={this.state.value} onChange={this.inputChange}/>

          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default App;