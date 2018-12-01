import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends Component {

    state = {
        activeMarker: null,
        selectedPlace: {name: ""}
    }

    onMarkerClick = (props, marker, e) => {
        if (this.props.topTen){
            this.props.setHighlightedRow(props);
        }
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
          });
    }

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          })
        }
      };

    render() {
        let points = [];
        this.props.earthquakeLocations.forEach(location => {
            points.push({lat: location.lat, lng: location.lng})
        });
        console.log(points);
        var bounds = new this.props.google.maps.LatLngBounds();

        for (var i = 0; i < points.length; i++) {
            bounds.extend(points[i]);
          }

        return (
            <Map google={this.props.google} onClick={this.onMapClicked} bounds={bounds} zoom={4} >
                {this.props.earthquakeLocations.map((location, index) => <Marker key={index}
                                                                                index={index}
                                                                                onClick={this.onMarkerClick}
                                                                                title="Earthquake"
                                                                                name={location.datetime}
                                                                                depth={location.depth}
                                                                                magnitude={location.magnitude}
                                                                                position={{ lat: location.lat, lng: location.lng }} />
                )}

                <InfoWindow marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <h4>Earthquake Registred</h4>
                        <h5>{`Datetime: ${this.state.selectedPlace.name}`}</h5>
                        <h5>{`Depth: ${this.state.selectedPlace.depth}`}</h5>
                        <h5>{`Magnitude: ${this.state.selectedPlace.magnitude}`}</h5>
                    </div>
                </InfoWindow>
            </Map>
        )
    }


}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyCCbmBMSu-C4M53eYTG7b-bXCaEPzQhMqQ')
})(MapContainer)