import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import TasksProgress from "./TaskProgress";

class Dashboard extends Component{
    state = {
        tasks: [],
        searchString: ''
    }

    constructor(){
        super();
        this.getTasks();
    }

    async getTasks (){
        console.log('bok')
        const url = "http://radno-vrijeme.herokuapp.com/tasks";
        axios.get(url).then((res) => {
            const res2 = res.data.filter(e => (sessionStorage.getItem('userID') == e.assigneeId));
            this.setState({tasks : res2})
            console.log(res2);
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
                {this.state.tasks ? (
                    <div>
                        <TextField style={{padding: 24}}
                                   id={"searchInput"}
                                   placeholder={"Search for Tasks"}
                                   margin={"normal"}
                                   inputProps={{min: 0, style: { textAlign: 'center' }}}
                                   onChange={this.onSearchInputChange}
                                   allign={"center"}/>
                        <Grid container spacing={1} style={{padding: 24}}>
                            {this.state.tasks.filter(e => e.name.toLowerCase().includes(this.state.searchString.toLowerCase()))
                                .map(currentTask => (
                                    <Grid item xs={12} sm={6} lg={4} xl={3} key={currentTask.id}>
                                        <TasksProgress task={currentTask} />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                ) : "No tasks found"}
            </div>
        )
    }
}

export default Dashboard;