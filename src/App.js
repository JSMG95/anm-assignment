import React, { Component } from 'react';
import {PageHeader, Col, Panel, Row} from 'react-bootstrap'; 
import CityForm from './CityForm';
import MapContainer from './MapContainer';
import TopTenTable from './TopTenTable';

class App extends Component {
  state = {
    earthquakeLocations: [],
    topTenEarthquakes: [],
    errorMessage: ""
  }

  componentDidMount(){
    this.fetchTopTen();
  }

  handleRequestError = (message) => {
    this.setState({errorMessage: message})
  }

  setHighlightedRow = (marker) => {
    console.log(marker);
    let topTenEarthquakes = [...this.state.topTenEarthquakes];
    topTenEarthquakes.forEach(quake => {quake.highlight = false});
    let quake = {...topTenEarthquakes[marker.index]};
    quake.highlight = true;
    topTenEarthquakes[marker.index] = quake;
    this.setState({topTenEarthquakes});
  }

  setCityRectangleBounds = (bounds) => {
    this.setState({inputCityRectangleBounds: bounds});
    this.fetchEarthquakesInfo();
  }
  
  fetchEarthquakesInfo = () => {
    fetch(`http://api.geonames.org/earthquakesJSON?` + 
    `north=${this.state.inputCityRectangleBounds.northeast.lat}` + 
    `&south=${this.state.inputCityRectangleBounds.southwest.lat}` +
    `&east=${this.state.inputCityRectangleBounds.northeast.lng}` +
    `&west=${this.state.inputCityRectangleBounds.southwest.lng}` +
    `&username=jsmg`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      if (data.earthquakes.length > 0){
        this.setState({earthquakeLocations: data.earthquakes});
      } else {
        this.handleRequestError("No data of earthquakes found in the input city")
      }
    })
  }

  fetchTopTen = () => {
    //get last year value
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear() - 1;
    let today = `${year}-${month}-${day}`
    
    //Use max value in lat and lng in order to return the whole globe, also use max results permitted by Geonames
    fetch(`http://api.geonames.org/earthquakesJSON?north=90&south=-90&east=180&west=-180&maxRows=500&minMagnitude=2&datetime=${today}&username=jsmg`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      //Sort only the earthquakes within last year
      let sortedList = data.earthquakes.filter(quake => {
        if ((Date.parse(quake.datetime)) > Date.parse(today)){
          quake.highlight = false;
          return quake;
        } else {
          return false;
        }
      });
      console.log(sortedList);
      this.setState({topTenEarthquakes: sortedList});
    })
  }

  render() {
    return (
      <div className="App">
        <PageHeader className="text-center"> ANM Assignment  <small>Created with React by Juan Manrique</small></PageHeader>
        <Row>
        <Col md={3} mdOffset={1}>
          <Panel>
            <Panel.Heading>
              <h2>How it works?</h2>
            </Panel.Heading>
            <Panel.Body>
              <ol>
                <li>In the first section you must enter a valid city name in order to display in the map the earthquakes registred in the city; click on the marker to get information regarding the quake. *Note: If given a not valid city addres or a city with no earthquake data, a message should prompt</li>
                <li>In Section two you are able to see the top ten earthquakes registred within the last year; click on the marker to highlight it in the table.</li>
              </ol>
            </Panel.Body>

          </Panel>
        </Col>
        <Col md={3} mdOffset={0}>
          <CityForm setCityRectangleBounds={this.setCityRectangleBounds} handleRequestError={this.handleRequestError} errorMessage={this.state.errorMessage}/>
        </Col>
        <Col md={4} style={{minHeight: '350px'}}>
          <MapContainer earthquakeLocations={this.state.earthquakeLocations}/>
        </Col>
        </Row>
        <br/><br/>
        <Row>
          <Panel>
                
              <Panel.Heading>
                <h2>Top Ten Earthquakes A Year From Now</h2>
              </Panel.Heading>
              <Panel.Body>
              <Col md={6} mdOffset={0} style={{}}>
                <TopTenTable earthquakes={this.state.topTenEarthquakes}/>
              </Col>
              <Col md={4} style={{minHeight: '350px'}}>
                <MapContainer earthquakeLocations={this.state.topTenEarthquakes.slice(0,10)} topTen setHighlightedRow={this.setHighlightedRow}/>
                </Col> 
              </Panel.Body>
          </Panel>
           
        </Row>
      </div>
    );
  }
}

export default App;
