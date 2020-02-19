import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import Save from '@material-ui/icons/Save';
import Create from '@material-ui/icons/Create';
import Messages from './Messages/Messages';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CreateIcon from '@material-ui/icons/Create';
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

const TaskDetails = props => {
    const { history } = props;

    const helpSID = window.localStorage.getItem("taskId");
    let SID = helpSID=="null"?null:helpSID;

    const classes = useStyles();

    const [formState, setFormState] = useState({
        isValid: false,
        isSaveValid:false,
        isDeleteValid:false,
        isBusinessSelected:false,
        isAssigneeSelected:false,
        uvjetMessage: false,
        vrijednosti: [],
        values: {
            name:'',
            description:'',
            business:'',
            assignee:'',
            pricePerHour:'',
            hoursPlanned:'',
            activityId: null,
            activitiyDescription:'',
            activitiyEmployeeName:''
        },
        touched: {},
        errors: {},
        assignees:[],
        tasks: [],
        businesses:[],
        selectedAssignee:{},
        selectedBusiness:{},
        activities:[]
    });

    let isNull = true;

    useEffect(()=>{


        axios.get("http://radno-vrijeme.herokuapp.com/tasks")
    .then(res => {

       const helpTasks=res.data;
       if(SID!=null){
           isNull=false;
           helpTasks.forEach(task =>{
            if(task.id==SID){ 
                axios.get("http://radno-vrijeme.herokuapp.com/businesses")
                .then(response=>{
                    const newBusinesses=response.data;
                    newBusinesses.forEach(bus=>{
                        if(bus.id===task.businessId){
                            setFormState(formState=>({
                                ...formState,
                                values:{
                                    ...formState.values,
                                    business:bus.name
                                }  ,
                                selectedBusiness :bus.name
                            }));
                        }
                    });
                });
                axios.get("http://radno-vrijeme.herokuapp.com/employees")
                .then(response=>{
                    const newAssignees=response.data;
                    newAssignees.forEach(as=>{
                        if(as.id===task.assigneeId){
                            setFormState(formState=>({
                                ...formState,
                                values:{
                                    ...formState.values,
                                    assignee:as.username
                                }   ,
                                selectedAssignee:as.username
                            }));
                        }
                    });
                });
                setFormState(formState=>({
                    ...formState,
                    values:{
                        ...formState.values,
                        name:task.name,
                        description:task.description,
                        pricePerHour:task.pricePerHour,
                        hoursPlanned:task.hoursPlanned
                    }   
                }));
            }
        });
        }

       setFormState(formState => ({
           ...formState,
           vrijednosti: res.data,
           tasks: res.data,
       }))
    });

    axios.get("http://radno-vrijeme.herokuapp.com/employees")
    .then(res => {

       setFormState(formState => ({
           ...formState,
           assignees: res.data
       }))
    });

    axios.get("http://radno-vrijeme.herokuapp.com/businesses")
    .then(res => {

       setFormState(formState => ({
           ...formState,
           businesses: res.data
       }))
    });
    

    if(SID!=null){
        setFormState(formState => ({
            ...formState,
            isSaveValid:true,
            isDeleteValid:true,
            isBusinessSelected:true,
            isAssigneeSelected:true
        }));
    }

    axios.get(`http://radno-vrijeme.herokuapp.com/tasks/${SID}/activities`)
        .then(res =>{
            res.data.map(activity =>{

                axios.get("http://radno-vrijeme.herokuapp.com/employees")
                .then(response=>{
                    response.data.forEach(employee => {
                        if(employee.id===activity.employeeId){
                              setFormState(formState =>({
                                  ...formState,
                                  activities: [...formState.activities,
                                          { 
                                            activityId:activity.id,
                                            activityDescription:activity.description,
                                            activitiyEmployeeName:`${employee.firstName} ${employee.lastName}`}]
                             }));
                                 
                            }    
                            
                    });
                 });
             });
        });
    },[]);

    const handleCreate = (event) =>{
        event.preventDefault();
    
            //trebalo bi ga linkati na upravljanje djelatnostima bez poslanog propsa za id
            window.localStorage.setItem("activityId", null);
            window.localStorage.setItem("taskId", SID);
            props.history.push('/workHours');
     }
     const handleEdit = (rowId) =>{

         //trebalo bi ga linkati na ekran upravljanje djelatnostima sa propsom id koji ce biti jednak rowId argumentu funkcije
         window.localStorage.setItem("activityId", rowId);
         window.localStorage.setItem("taskId", SID);
         props.history.push('/workHours');
    
     }
    
    
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


        if(document.getElementById('name').value===''
            || document.getElementById('description').value===''
            || formState.isBusinessSelected===false
            || formState.isAssigneeSelected===false
            || document.getElementById('pricePerHour').value===''
            || document.getElementById('hoursPlanned').value===''){
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

    const handleBusiness = event =>{
        setFormState(formState => ({
            ...formState,
            isBusinessSelected:true,
            selectedBusiness: event.target.value,
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


        if(document.getElementById('name').value===''
            || document.getElementById('description').value===''
            || formState.isAssigneeSelected===false
            || document.getElementById('pricePerHour').value===''
            || document.getElementById('hoursPlanned').value===''){
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

    const handleAssignee = event =>{
        setFormState(formState => ({
            ...formState,
            isAssigneeSelected:true,
            selectedAssignee: event.target.value,
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

        if(document.getElementById('name').value===''
            || document.getElementById('description').value===''
            || formState.isBusinessSelected===false
            || document.getElementById('pricePerHour').value===''
            || document.getElementById('hoursPlanned').value===''){
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
                                    Task Management
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                </Typography>
                                <TextField
                                    className={classes.textField}
                                    id="name"
                                    disabled="true"
                                    error={hasError('name')}
                                    fullWidth
                                    helperText={
                                        hasError('name') ? formState.errors.name[0] : null
                                    }
                                    label="Name"
                                    name="name"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.name || ''}
                                    variant="outlined"
                                />
                                 <TextField
                                    className={classes.textField}
                                    id="description"
                                    disabled="true"
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
                                    Select a business:
                                </InputLabel>
                                <Select
                                    //className={classes.textField}
                                    labelId="demo-simple-select-label"
                                    id="business"
                                    disabled="true"
                                    error={hasError('business')}
                                    fullWidth
                                    helperText={
                                        hasError('business') ? formState.errors.business[0] : null
                                    }
                                    name="business"
                                    onChange={handleBusiness}
                                    type="text"
                                    value={formState.values.business}
                                    variant="outlined"
                            > 
                                    {formState.businesses.map(current =>(
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
                                    Select a assignee:
                                </InputLabel>
                                <Select
                                    //className={classes.textField}
                                    labelId="demo-simple-select-label"
                                    id="assignee"
                                    disabled="true"
                                    error={hasError('assignee')}
                                    fullWidth
                                    helperText={
                                        hasError('assignee') ? formState.errors.assignee[0] : null
                                    }
                                    name="assignee"
                                    onChange={handleAssignee}
                                    type="text"
                                    value={formState.values.assignee}
                                    variant="outlined"
                            > 
                                    {formState.assignees.map(current =>(
                                        <MenuItem 
                                        value={current.username} 
                                        id={current.id}
                                        onChange={handleChange}>
                                        {current.username}
                                        </MenuItem>                          
                                     ))};
                                </Select>
                                 <TextField
                                    className={classes.textField}
                                    error={hasError('pricePerHour')}
                                    id="pricePerHour"
                                    disabled="true"
                                    fullWidth
                                    helperText={
                                        hasError('pricePerHour') ? formState.errors.pricePerHour[0] : null
                                    }
                                    label="Price Per Hour"
                                    name="pricePerHour"
                                    onChange={handleChange}
                                    type="number"
                                    value={formState.values.pricePerHour || ''}
                                    variant="outlined"
                                />
                                   <TextField
                                    className={classes.textField}
                                    error={hasError('hoursPlanned')}
                                    id="hoursPlanned"
                                    disabled="true"
                                    fullWidth
                                    helperText={
                                        hasError('hoursPlanned') ? formState.errors.hoursPlanned[0] : null
                                    }
                                    label="Hours Planned"
                                    name="hoursPlanned"
                                    onChange={handleChange}
                                    type="number"
                                    value={formState.values.hoursPlanned || ''}
                                    variant="outlined"
                                />
                               <Typography
                                    className={classes.title}
                                    variant="h4"
                                >
                                    Activity list
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                </Typography>
                                <Button className={classes.Button} variant="contained" color="primary" onClick={handleCreate}>
                                Create
                                </Button>
                            <Paper>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell align="left">Description</TableCell>
                                            <TableCell align="left">Employee name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formState.activities.map(row => (
                                            <TableRow key={row.activityId}>
                                                <TableCell component="th" scope="row">
                                                    {row.activityId}
                                                </TableCell>
                                                <TableCell align="left">{row.activityDescription}</TableCell>
                                                <TableCell align="left">{row.activitiyEmployeeName}</TableCell>
                                                <TableCell align="left" onClick={() => handleEdit(row.activityId)}>
                                                <CreateIcon />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                            </form>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

TaskDetails.propTypes = {
    history: PropTypes.object
};

export default TaskDetails;