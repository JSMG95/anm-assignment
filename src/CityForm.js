import React, {Component} from 'react';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import Geocode from 'react-geocode';

class CityForm extends Component {
    state = {
        value: ""
    }

    componentDidMount(){
        Geocode.setApiKey('AIzaSyCCbmBMSu-C4M53eYTG7b-bXCaEPzQhMqQ');
        Geocode.enableDebug();
    }

    handleChange = e => {
        this.setState({ value: e.target.value });
    }
    handleFormSubmit = e => {
        e.preventDefault();
        this.props.handleRequestError("");
        console.log("Form Submitted", this.state.value);
        Geocode.fromAddress(this.state.value).then(
            response => {
                console.log(response);
                if (response.results[0].geometry.hasOwnProperty('bounds')){
                    this.props.setCityRectangleBounds(response.results[0].geometry.bounds)
                } else {
                    this.props.handleRequestError("City named not valid, please verify the data entered (input example: Los Angeles, Tokyo)");
                }
            },
            error => {
                console.error(error);
            }
        )

    }

    render(){
        return(
            <form>
                <FormGroup>
                    <ControlLabel>Enter a city name: </ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="City Name"
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <Button bsStyle="info" type="submit" onClick={(e) => this.handleFormSubmit(e)}>Submit</Button>
                <h4 style={{color: "red"}}>{this.props.errorMessage}</h4>
            </form>
        )
    }


}

export default CityForm;