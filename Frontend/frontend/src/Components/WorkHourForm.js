import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import Save from '@material-ui/icons/Save';
import Create from '@material-ui/icons/Create';
import Messages from './Messages/Messages';
import {
    Grid,
    Button,
    Input,
    InputLabel,
    IconButton,
    Select,
    TextField,
    Link,
    FormHelperText,
    Checkbox,
    MenuList,
    MenuItem,
    Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from 'axios';

const schema = {
    serviceId: {
        presence: { allowEmpty: true, message: 'is required' },
        length: {
            maximum: 32
        }
    },
    name: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 32
        }
    },
    surname: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 32
        }
    },
    group: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 32
        }
    },
    serviceDescription: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 256
        }
    },
    leader: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 32
        }
    },
    pricePerHour: {
        presence: { allowEmpty: false, message: 'is required' },
    }
};

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        height: '100%'
    },
    grid: {
        height: '100%'
    },
    name: {
        marginTop: theme.spacing(3),
        color: theme.palette.white
    },
    bio: {
        color: theme.palette.white
    },
    contentContainer: {},
    content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    contentHeader: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    logoImage: {
        marginLeft: theme.spacing(4)
    },
    contentBody: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
    },
    form: {
        paddingLeft: 100,
        paddingRight: 100,
        paddingBottom: 125,
        flexBasis: 700,
    },
    title: {
        marginTop: theme.spacing(3)
    },
    textField: {
        marginTop: theme.spacing(2)
    },
    inputLabel: {
        marginTop: theme.spacing(4)
    },
    policy: {
        marginTop: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    policyCheckbox: {
        marginLeft: '-14px'
    },
    Button: {
         margin: theme.spacing(2, 0),
         width: 100
    },
    ButtonDelete: {
        margin: theme.spacing(2, 0),
        width: 100,
        marginRight: 30,
        backgroundColor: 'red'
    }
}));

const WorkHourForm = props => {
    const { history } = props;

    const helpSID = window.localStorage.getItem("activityId");
    let SID = helpSID=="null"?null:helpSID;
    const taskId = window.localStorage.getItem("taskId");

    const classes = useStyles();

    const [formState, setFormState] = useState({
        isValid: false,
        isSaveValid:false,
        isDeleteValid:false,
        isTaskSelected:false,
        isEmployeeSelected:false,
        uvjetMessage: false,
        vrijednosti: [],
        values: {
            description:'',
            startTime:'',
            endTime:'',
            employeeName:'',
            taskName:''
        },
        touched: {},
        errors: {},
        assignees:[],
        tasks: [],
        activities:[],
        employees:[],
        selectedEmployee:{},
        selectedTask:{}
    });

    let isNull = true;

    useEffect(()=>{
        console.log(helpSID);
        console.log(taskId);

        axios.get(`http://radno-vrijeme.herokuapp.com/activities`)
    .then(res => {

       const helpActivities=res.data;
       if(SID!=null){
           isNull=false;
           helpActivities.forEach(activity =>{
            if(activity.id==SID){ 
                axios.get("http://radno-vrijeme.herokuapp.com/tasks")
                .then(response=>{
                    const newTasks=response.data;
                    newTasks.forEach(task=>{
                        if(task.id===activity.taskId){
                            setFormState(formState=>({
                                ...formState,
                                values:{
                                    ...formState.values,
                                    taskName:task.name
                                }  ,
                                selectedTask :task.name,
                            }));
                        }
                    });
                });
                axios.get("http://radno-vrijeme.herokuapp.com/employees")
                .then(response=>{
                    const newEmployees=response.data;
                    newEmployees.forEach(employee=>{
                        if(employee.id===activity.employeeId){
                            setFormState(formState=>({
                                ...formState,
                                values:{
                                    ...formState.values,
                                    employeeName:employee.username
                                }   ,
                                selectedEmployee:employee.username
                            }));
                        }
                    });
                });

                const startTimeString =activity.startTime;
                const arrayStartTime = startTimeString.split(" ");
                let date = arrayStartTime[0];
                let time = arrayStartTime[1];
                let arrayDate = date.split("-");
                let arrayTime = time.split(":");
                const formattedStartTime = arrayDate[2]+"-"+arrayDate[1]+"-"+arrayDate[0]+"T"+arrayTime[0]+":"+arrayTime[1];

                const endTimeString =activity.endTime;
                const arrayEndTime = endTimeString.split(" ");
                date = arrayEndTime [0];
                time = arrayEndTime [1];
                arrayDate = date.split("-");
                arrayTime = time.split(":");
                const formattedEndTime = arrayDate[2]+"-"+arrayDate[1]+"-"+arrayDate[0]+"T"+arrayTime[0]+":"+arrayTime[1];

                setFormState(formState=>({
                    ...formState,
                    values:{
                        ...formState.values,
                        description:activity.description,
                        startTime:formattedStartTime,
                        endTime:formattedEndTime
                    }   
                }));
            }
        });
        }

       setFormState(formState => ({
           ...formState,
           vrijednosti: res.data,
           activities: res.data,
       }))
    });

    axios.get("http://radno-vrijeme.herokuapp.com/employees")
    .then(res => {

       setFormState(formState => ({
           ...formState,
           employees: res.data
       }))
    });

    axios.get("http://radno-vrijeme.herokuapp.com/tasks")
    .then(res => {

       setFormState(formState => ({
           ...formState,
           tasks: res.data
       }))
    });
    

    if(SID!=null){
        setFormState(formState => ({
            ...formState,
            isSaveValid:true,
            isDeleteValid:true,
            isTaskSelected:true,
            isEmployeeSelected:true
        }));
    }
    },[]);

    
    const handleChange = event => {
        event.persist();

        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]:
                    event.target.type === 'checkbox'
                        ? event.target.checked
                        : event.target.value
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true
            }
        }));


        if(document.getElementById('description').value===''
            || formState.isTaskSelected===false
            || formState.isEmployeeSelected===false
            || document.getElementById('startTime').value===''
            || document.getElementById('endTime').value===''){
                setFormState(formState => ({
                    ...formState,
                    isSaveValid:false 
                }));
        }
        else{
            setFormState(formState => ({
                ...formState,
                isSaveValid:true
          }));
        }
        
        console.log(document.getElementById('endTime').value);
    };

    const handleTasks = event =>{
        setFormState(formState => ({
            ...formState,
            isTaskSelected:true,
            selectedTask: event.target.value,
            values: {
                ...formState.values,
                [event.target.name]:
                    event.target.type === 'checkbox'
                        ? event.target.checked
                        : event.target.value
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true
            }
        }));


        if(document.getElementById('description').value===''
            || formState.isEmployeeSelected===false
            || document.getElementById('startTime').value===''
            || document.getElementById('endTime').value===''){
                setFormState(formState => ({
                    ...formState,
                    isSaveValid:false 
                }));
        }
        else{
            setFormState(formState => ({
                ...formState,
                isSaveValid:true
          }));
        }
        
    };

    const handleEmployee = event =>{
        setFormState(formState => ({
            ...formState,
            isEmployeeSelected:true,
            selectedEmployee: event.target.value,
            values: {
                ...formState.values,
                [event.target.name]:
                    event.target.type === 'checkbox'
                        ? event.target.checked
                        : event.target.value
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true
            }
        }));

        if(document.getElementById('description').value===''
            || formState.isTaskSelected===false
            || document.getElementById('startTime').value===''
            || document.getElementById('endTime').value===''){
                setFormState(formState => ({
                    ...formState,
                    isSaveValid:false 
                }));
        }
        else{
            setFormState(formState => ({
                ...formState,
                isSaveValid:true
          }));
        }
    };

    const handleBack = () => {
        history.goBack();
    };


    const handleDelete = event =>{
        event.preventDefault();

        setFormState(formState =>({
            ...formState,
            uvjetMessage: true
        }));

        if(SID !=null){
            axios.delete(`http://radno-vrijeme.herokuapp.com/activities/${SID}`)
            .then(res => {
              console.log(res);
              console.log(res.data);
            }).catch(e => {
                console.log(e);
            });

        }

    }


    const handleSave = event => {  
        event.preventDefault();

        setFormState(formState =>({
            ...formState,
            uvjetMessage: true
        }));

        const timeStartString = document.getElementById('startTime').value.toString();
        const arrayStartTime = timeStartString.split("T");
        const dateStartArray = arrayStartTime[0].split("-");
        const formatedStartTime = dateStartArray[2] + '-' + dateStartArray[1] + '-' + dateStartArray[0] + ' ' + arrayStartTime[1];

        const timeEndString = document.getElementById('endTime').value.toString();
        const arrayEndTime = timeEndString.split("T");
        const dateEndArray = arrayEndTime[0].split("-");
        const formatedEndTime = dateEndArray[2] + '-' + dateEndArray[1] + '-' + dateEndArray[0] + ' ' + arrayEndTime[1];

        let helpEmployeeId=99;
        let helpTaskId=99;

        formState.employees.forEach(current=>{
            if(current.username===formState.selectedEmployee){
                helpEmployeeId=current.id;
            }
        });

        formState.tasks.forEach(current=>{
            if(current.name===formState.selectedTask){
                helpTaskId=current.id;
            }
        });
        if(SID==null){

            const param ={
                id: null,
                description: document.getElementById("description").value,
                startTime: formatedStartTime,
                endTime: formatedEndTime,
                employeeId: helpEmployeeId,
                taskId: helpTaskId
            };
            console.log(param);
            axios.post('http://radno-vrijeme.herokuapp.com/activities',param)
            .then(res=>{
                console.log(res);
            }).catch(e => {
                console.log(e);
            });  
            
            return;
        }
       
        if(SID!=null){
            const param2 ={
                id: SID,
                description: document.getElementById("description").value,
                startTime: formatedStartTime,
                endTime: formatedEndTime,
                employeeId: helpEmployeeId,
                taskId: helpTaskId
            };
            axios.put(`http://radno-vrijeme.herokuapp.com/activities/${SID}`,param2)
            .then(res => {
                console.log(res);
                console.log(res.data);
              }).catch(e => {
                  console.log(e);
              });


              return;
        }

      
        
    };

    const hasError = field =>
            formState.touched[field] && formState.errors[field] ? true : false;

    return (
        <div className={classes.root}>
            <Grid
                className={classes.grid}
                container
            >
                <Grid
                    className={classes.content}
                    item
                    lg={7}
                    xs={12}
                >
                    <div className={classes.content}>
                        <div className={classes.contentHeader}>
                            <IconButton onClick={handleBack}>
                                <ArrowBackIcon />
                            </IconButton>
                        </div>
                        <div className={classes.contentBody}>
                            <form
                                className={classes.form}
                            >
                                <Typography
                                    className={classes.title}
                                    variant="h2"
                                >
                                    Activity Management
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                </Typography>
                                <TextField
                                    className={classes.textField}
                                    id="description"
                                    error={hasError('description')}
                                    fullWidth
                                    helperText={
                                        hasError('description') ? formState.errors.description[0] : null
                                    }
                                    label="Description"
                                    name="description"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.description || ''}
                                    variant="outlined"
                                />
                                <InputLabel 
                                    id="demo-simple-select-label"
                                    className={classes.inputLabel}
                                >
                                    Start Time:
                                </InputLabel>
                                 <TextField
                                    className={classes.textField}
                                    id="startTime"
                                    error={hasError('startTime')}
                                    fullWidth
                                    helperText={
                                        hasError('startTime') ? formState.errors.startTime[0] : null
                                    }
                                    name="startTime"
                                    onChange={handleChange}
                                    type="datetime-local"
                                    value={formState.values.startTime || ''}
                                    variant="outlined"
                                />
                                <InputLabel 
                                    id="demo-simple-select-label"
                                    className={classes.inputLabel}
                                >
                                    End Time:
                                </InputLabel>
                                <TextField
                                    className={classes.textField}
                                    id="endTime"
                                    error={hasError('endTime')}
                                    fullWidth
                                    helperText={
                                        hasError('endTime') ? formState.errors.endTime[0] : null
                                    }
                                    name="endTime"
                                    onChange={handleChange}
                                    type="datetime-local"
                                    value={formState.values.endTime || ''}
                                    variant="outlined"
                                />
                                <InputLabel 
                                    id="demo-simple-select-label"
                                    className={classes.inputLabel}
                                >
                                    Select a task:
                                </InputLabel>
                                <Select
                                    //className={classes.textField}
                                    labelId="demo-simple-select-label"
                                    id="taskName"
                                    error={hasError('taskName')}
                                    fullWidth
                                    helperText={
                                        hasError('taskName') ? formState.errors.taskName[0] : null
                                    }
                                    name="taskName"
                                    onChange={handleTasks}
                                    type="text"
                                    value={formState.values.taskName || ''}
                                    variant="outlined"
                            > 
                                    {formState.tasks.map(current =>(
                                        <MenuItem 
                                        value={current.name} 
                                        id={current.id}
                                        onChange={handleChange}>
                                        {current.name}
                                        </MenuItem>                          
                                     ))};
                                </Select>
                                <InputLabel 
                                    id="demo-simple-select-label"
                                    className={classes.inputLabel}
                                >
                                    Select a employee:
                                </InputLabel>
                                <Select
                                    //className={classes.textField}
                                    labelId="demo-simple-select-label"
                                    id="employeeName"
                                    error={hasError('employeeName')}
                                    fullWidth
                                    helperText={
                                        hasError('employeeName') ? formState.errors.employeeName[0] : null
                                    }
                                    name="employeeName"
                                    onChange={handleEmployee}
                                    type="text"
                                    value={formState.values.employeeName || ''}
                                    variant="outlined"
                            > 
                                    {formState.employees.map(current =>(
                                        <MenuItem 
                                        value={current.username} 
                                        id={current.id}
                                        onChange={handleChange}>
                                        {current.username}
                                        </MenuItem>                          
                                     ))};
                                </Select>
                                <Button
                                    className={classes.ButtonDelete}
                                    id="deleteBtn"
                                    color="primary"
                                    disabled={!formState.isDeleteValid}
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    onClick={handleDelete}
                                >
                                    <Delete />
                                    Delete
                                </Button>
                                <Button
                                    className={classes.Button}
                                    id="saveBtn"
                                    color="primary"
                                    disabled={!formState.isSaveValid}
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    onClick={handleSave}
                                >  
                                    <Save />
                                    Save
                                </Button>
                                <Messages uvjet={formState.uvjetMessage}/>
                            </form>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

WorkHourForm.propTypes = {
    history: PropTypes.object
};

export default WorkHourForm;