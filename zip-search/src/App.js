import React, { Component } from 'react';
import './App.css';


function City(props) {
  return (
    <div className="row">
      <div className="col-xs-12">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{props.data.LocationText}</h3>
          </div>
          <div className="panel-body">
            <ul>
              <li>State: {props.data.State}</li>
              <li>Location: ({props.data.Lat}, {props.data.Long})</li>
              <li>Population (estimated): {props.data.EstimatedPopulation}</li>
              <li>Total Wages: {props.data.TotalWages}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchField(props) {
  return (
    <div className="row">
      <div className="col-xs-12">
        <form>
        <label> Zip Code: </label>
        <input type="text" value={props.zipCode} onChange={props.handleChange} placeholder="Try 10016" />
        </form>
      </div>
    </div>
  );
}



class App extends Component {
  constructor() {
    super();//call component constructor
    this.state = {
      zipCode: "",
      cities: [],
    }

    //bind event handler
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const zipInput = event.target.value;  //value of search field on change

    this.setState({
      zipCode: zipInput,
    })

    //only fetch url if 5 digit zip code
    if(zipInput.length === 5) {
      fetch('http://ctp-zip-api.herokuapp.com/zip/'+zipInput)
        .then((response) => {
          if(response.ok) {
            return response.json(); //return json if there are no issues
          } else {
            return [];
          }
        })
        .then((json) => {
          const cities = json.map((city) => {
            return <City data={city} key = {city.RecordNumber}/>;  //return City component, set data to each city and key to unique identifier in json data(record number)
          });

          //populate cities array after mapping json above
          this.setState({
            cities: cities,
          });
        })
        .catch((ex) => {
          this.setState({
            cities: [],
          });
          console.log("Error in catch " + ex);
        });
    } else {
      this.setState({
        cities: [],
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Zip Code Search</h2>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6 col-sm-3">
              <SearchField zipCode={this.state.zipCode} handleChange={this.handleChange} /> 
              { this.state.cities }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;