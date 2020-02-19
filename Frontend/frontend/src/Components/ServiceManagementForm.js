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
    serviceName: {
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

const ServiceManagementForm = props => {
    const { history } = props;

    const classes = useStyles();

    const SID = window.localStorage.getItem("serviceId");
    var isEdit = false;
    if(SID!=="null") isEdit = true;
    else isEdit = false;

    const [formState, setFormState] = useState({
        isValid: false,
        groupNames:  [],
        groupIds: [],
        groupId: null,
        groupName: "",
        values: {serviceName: "",serviceDescription: "",pricePerHour: "",groupName: ""},
        touched: {},
        uvjetDel: false,
        uvjetMessage: false,
        errors: {},
        count: 0,
    });

    const validate = () =>{
        
        if(!formState.values.serviceName=="" && !formState.values.serviceDescription=="" && !formState.values.groupName=="" && !formState.values.pricePerHour==""){
            return true;
        } 
        return false;

    }
    const handleSave = (event) =>{
        event.preventDefault();
        setFormState(formState =>({
            ...formState,
            uvjetMessage: true
        }))
        //parametri za slanje na api u slucaju da saljemo create
       const params = {
            name: formState.values.serviceName,
            description: formState.values.serviceDescription,
            pricePerHour: formState.values.pricePerHour,
            groupId: formState.groupId
          }
          //parametri ako saljemo update
        const params2 = {
            id: SID,
            name: formState.values.serviceName,
            description: formState.values.serviceDescription,
            pricePerHour: formState.values.pricePerHour,
            groupId: formState.groupId
        }
        const headers = {
            'Content-Type' : 'application/json'
        }
          //ako ne postoji SID to znaci da se ocekuje create podataka
        if(SID==="null"){
        
            axios.post('http://radno-vrijeme.herokuapp.com/businesses',params)
                .then((response) =>{
                    console.log(response)
                },(error) =>{
                console.log(error)
                })
        }
        //else je u slucaju kada je SID poslan, pa se ocekuje edit podataka
        else{
           axios.put('http://radno-vrijeme.herokuapp.com/businesses/' + SID,params2,headers)
            .then((response) =>{
                console.log(response)
            },(error) =>{
               console.log(error)
            })
        }
        window.location.href = '/';
    }

    const handleDelete = (event) =>{

        event.preventDefault();
        setFormState(formState =>({
            ...formState,
            uvjetDel: false,
            uvjetMessage: true
        }))

        const params = {
            name: formState.values.serviceName,
            description: formState.values.serviceDescription,
            pricePerHour: formState.values.pricePerHour,
            groupId: formState.groupId         
        }

         axios.delete('http://radno-vrijeme.herokuapp.com/businesses/' + SID,params)
          .then((response) =>{
           console.log(response)
          },(error) =>{
          console.log(error)
          })
    }
    //ako smo dohvatili id sa propsa, dohvacamo vrijednosti sa apija i stavljamo ih na inpute

    useEffect(() => {
        //ako nismo dohvatili id pomocu propsa, necemo dohvacati vrijednosti sa apija
            if(SID==="null"){
                if(formState.count===0){
                    const uvjet = validate();
                    setFormState(formState =>({
                        ...formState,
                        isValid: uvjet,
                        count: formState.count + 1
                    }))
                    axios.get("http://radno-vrijeme.herokuapp.com/groups")
                            .then(result => {
                                result.data.map(data =>{
                                        setFormState(formState =>({
                                            ...formState,
                                            groupNames: [...formState.groupNames,data.name],
                                            groupIds: [...formState.groupIds,data.id],
                                            count: formState.count + 1
                                        }))
                                    })
                            })
                }
                //ako smo dohvatili id sa propsa, dohvacamo vrijednosti sa apija i stavljamo ih na inpute
                else{
                    const uvjet = validate();
                    setFormState(formState =>({
                        ...formState,
                        isValid: uvjet,
                        count: formState.count + 1
                    }))
                }
            }
            else{
                if(formState.count===0){
                    setFormState(formState =>({
                        ...formState,
                        count: formState.count + 1,
                        uvjetDel: true
                    }))
                axios.get("http://radno-vrijeme.herokuapp.com/businesses")
                .then(res => {
                    res.data.map(current =>{
                        if(current.id==SID){
                            setFormState(formState => ({
                                ...formState,
                                //dohvati podatke sa apija za service sa id-om jednakim SID, a SID je decoy id koji cu kasnije zamijeniti sa onim dobivenim kroz props
                                values : {serviceName: current.name,serviceDescription: current.description,groupId: current.groupId,pricePerHour: current.pricePerHour}
                            }))
                            axios.get("http://radno-vrijeme.herokuapp.com/groups")
                            .then(result => {
                                result.data.map(data =>{
                                        setFormState(formState =>({
                                            ...formState,
                                            groupNames: [...formState.groupNames,data.name],
                                            groupIds: [...formState.groupIds,data.id],
                                            count: formState.count + 1
                                        }))
                                    if(data.id===current.groupId){
                                        setFormState(formState => ({
                                        ...formState,
                                        isValid: true,
                                        groupName: data.name,
                                        groupId: current.groupId,
                                        values: {...formState.values,groupName: data.name},
                                        count: formState.count + 1
                                    }))
                                    }
                                })
                            });
                        }
                    })
                });
                }
                else{
                    const uvjet = validate();
                    setFormState(formState =>({
                        ...formState,
                        isValid: uvjet,
                        count: formState.count + 1
                    }))
                }
            }
        },[formState.values]);

    const handleChange = event => {
      event.persist();

      setFormState(formState =>({
        ...formState,
        uvjetDel: false
    }))
      if(event.target.name==="groupName"){
        for(let i = 0 ; i < formState.groupNames.length ; i++){
            if(event.target.value===formState.groupNames[i]){
                setFormState(formState =>({
                    ...formState,
                    groupId: formState.groupIds[i],
                }))
            }
        }
      }
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.value
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true
            }
        }));
    };

    const handleBack = () => {
        window.location.href = '/services';
    };

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
                                //onSubmit={handleSignUp}
                            >
                                <Typography
                                    className={classes.title}
                                    variant="h2"
                                >
                                    Service management
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                </Typography>
                                <TextField
                                    className={classes.textField}
                                    fullWidth
                                    label="Service name"
                                    name="serviceName"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.serviceName}
                                    variant="outlined"
                                />
                                <Input
                                    className={classes.textField}
                                    fullWidth
                                    placeholder="Service description"
                                    label="Service description"
                                    name="serviceDescription"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.serviceDescription}
                                    variant="outlined"
                                />
                                <InputLabel 
                                    id="demo-simple-select-label"
                                    className={classes.inputLabel}
                                >
                                    Select a group:
                                </InputLabel>
                                <Select
                                    //className={classes.textField}
                                    labelId="demo-simple-select-label"
                                    fullWidth
                                    name="groupName"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.groupName}
                                    variant="outlined"
                                >
                                     {formState.groupNames.map(current =>(

                                        <MenuItem 
                                        value={current}
                                        name="group" 
                                        onChange={handleChange}
                                        >
                                        {current}
                                        </MenuItem>
                                     ))}
                                </Select>
                                <TextField
                                    className={classes.textField}
                                    fullWidth
                                    label="Price per hour"
                                    name="pricePerHour"
                                    onChange={handleChange}
                                    type="number"
                                    InputProps={{ inputProps: { min: 0 } }}
                                    value={formState.values.pricePerHour}
                                    variant="outlined"
                                />
                                <Button
                                className={classes.ButtonDelete}
                                color="primary"
                               disabled={formState.isValid && isEdit && formState.uvjetDel? false : true}
                                size="large"
                                type="button"
                                variant="contained"
                                onClick={handleDelete}
                                >
                                <Delete />
                                Delete
                            </Button>
                                <Button
                                    className={classes.Button}
                                    color="primary"
                                   disabled={formState.isValid ? false : true}
                                    size="large"
                                    type="button"
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

ServiceManagementForm.propTypes = {
    history: PropTypes.object
};

export default ServiceManagementForm;