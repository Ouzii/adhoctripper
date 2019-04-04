import React, { Component } from 'react'
import Select from 'react-select'

const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'black', width: '50%', maxWidth: '400px', margin: 'auto' }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected ? 'grey' : 'black',
            color: 'whitesmoke',
        };
    },
    menu: styles => ({ ...styles, width: '50%', maxWidth: '400px', margin: 'auto', backgroundColor: 'black', position: 'relative', border: '1px solid white' }),
    input: styles => ({ ...styles }),
    placeholder: styles => ({ ...styles }),
    singleValue: styles => ({ ...styles, color: 'whitesmoke' }),
};

export default class TripPriceInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentVehicle: 0,
            vehicles: props.user ? props.user.vehicles : [],
            length: props.length,
            estFuelPrice: props.user ? props.user.estFuelPrice : 0,
            options: []
        }
    }

    componentDidMount() {
        if (this.state.user) {
            const options = this.state.vehicles.map(vehicle => {
                return {
                    value: this.state.vehicles.indexOf(vehicle),
                    label: vehicle.name
                }
            })
            this.setState({ options })
        }
    }

    handleChange = (selectedOption) => {
        this.setState({ currentVehicle: parseInt(selectedOption.value) })
    }

    render() {
        return (
            <div>
                {this.state.options ?
                    <div>
                        Select vehicle <br />
                        <Select

                            styles={colourStyles}
                            value={this.state.options[this.state.currentVehicle]}
                            onChange={this.handleChange}
                            options={this.state.options} />

                        Length of route: {+(this.state.length / 1000).toFixed(2)}km<br />
                        {this.state.vehicles.length > 0 ?
                            <div>
                                Est. fuel consumption: {+((this.state.length / 1000) * (this.state.vehicles[this.state.currentVehicle].consumption / 100)).toFixed(2)} l<br />
                                Est. fuel price: {+(((this.state.length / 1000) * (this.state.vehicles[this.state.currentVehicle].consumption / 100)) * this.state.estFuelPrice).toFixed(2)}€
                            </div>
                            :
                            <div>
                                Add vehicles for trip fuel info
                            </div>
                        }
                    </div>
                    :
                    <div />}
            </div>
        )
    }
}
