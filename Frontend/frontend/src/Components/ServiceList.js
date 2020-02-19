import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Service from '../Components/Service';
import axios from "axios";

class ServiceList extends Component{
    state = {
        services: [],
        searchString: ''
    }

    constructor(){
        super()
        this.getServices()
    }

    async getServices (){
        const url = "http://radno-vrijeme.herokuapp.com/businesses";
        axios.get(url).then((res) => {
            this.setState({services : res.data})
            console.log(res.data);
            console.log(sessionStorage.getItem('username'),sessionStorage.getItem('isLogged'),sessionStorage.getItem('userID'));
        });
    }

    onSearchInputChange = (event) => {
        if (event.target.value) {
            this.setState({searchString: event.target.value})
            console.log(event.target.value);
        } else {
            this.setState({searchString: ''})
        }
    }

    render(){
        return (
            <div>
                {this.state.services ? (
                    <div>
                        <TextField style={{padding: 24}}
                                   id={"searchInput"}
                                   placeholder={"Search for Services"}
                                   margin={"normal"}
                                   inputProps={{min: 0, style: { textAlign: 'center' }}}
                                   onChange={this.onSearchInputChange}
                                   allign={"center"}/>
                        <Grid container spacing={1} style={{padding: 24}}>
                            {this.state.services.filter(e => e.name.toLowerCase().includes(this.state.searchString.toLowerCase()))
                            .map(currentService => (
                                <Grid item xs={12} sm={6} lg={4} xl={3} key={currentService.id}>
                                   <Service service={currentService} />
                                </Grid>
                             ))}
                        </Grid>
                    </div>
                ) : "No courses found"}
            </div>
        )
    }
}

export default ServiceList;