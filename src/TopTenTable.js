import React, {Component} from 'react';
import {Table} from 'react-bootstrap';

class TopTenTable extends Component {

    render(){
        return(
            <Table>
                <thead>
                    <tr>
                        <th>Date and Time of the Earthquake</th>
                        <th>Magnitude</th>

                    </tr>
                </thead>
                <tbody>
                    {this.props.earthquakes.slice(0,10).map((quake, index) => (
                        <tr key={index} style={{backgroundColor: quake.highlight ? "lightgreen": ""}}>
                            <td>{quake.datetime}</td>
                            <td>{quake.magnitude}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

}

export default TopTenTable;