import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CreateIcon from '@material-ui/icons/Create';
import {
    Grid,
    Input,
    Button,
    InputLabel,
    Fab,
    IconButton,
    TableContainer,
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
    contentHeader2: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing(1),
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
        alignItems: 'center'
    },
    form: {
        paddingLeft: 100,
        paddingBottom: 125,
        flexBasis: 900,
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
         width: 130
    },
    ButtonDelete: {
        margin: theme.spacing(2, 0),
        width: 100,
        marginRight: 30,
        backgroundColor: 'red'
    },
    Fab: {
        marginLeft: '10px'
    }
}));

const EmployeeTable = (props) =>{

    const { history } = props;
    const classes = useStyles();

    const [formState, setFormState] = useState({
        isValid: false,
        services: [],
        values: {
            id: null,
            firstName: "",
            lastName: "",
            username: "",
            roleName: ""
        },
        touched: {},
        uvjetMessage: false,
        errors: {},
        count: 0,
        employees:[]
    });

    const handleCreate = (event) =>{
    event.preventDefault();

        //trebalo bi ga linkati na upravljanje djelatnostima bez poslanog propsa za id
        window.localStorage.setItem("employeeId", null);
        window.location.href = '/employeesManagement';
    }

    useEffect(() =>{

        axios.get("http://radno-vrijeme.herokuapp.com/employees")
        .then(res =>{
            res.data.map(current =>{

                axios.get("http://radno-vrijeme.herokuapp.com/roles")
                .then(response=>{
                    response.data.forEach(element => {
                        if(element.id===current.roleId){
                            setFormState(formState =>({
                                ...formState,
                                employees: [...formState.employees,
                                    { 
                                        id: current.id,
                                        firstName: current.firstName,
                                        lastName: current.lastName,
                                        username: current.username,
                                        roleName: element.name}]
                            }));
                        }
                    });
                });
            })
        })

    },[])

    const handleEdit = (rowId) =>{
        
        //trebalo bi ga linkati na ekran upravljanje djelatnostima sa propsom id koji ce biti jednak rowId argumentu funkcije
        window.localStorage.setItem("employeeId", rowId);
        window.location.href = '/employeesManagement';

    }

    const handleDelete = (rowId) =>{
        
        //brisanje clana iz baze podataka, slicno kao kod GroupManagementForm-a za delete u tablici
        setFormState(formState =>({
            ...formState,
            employees: formState.employees.filter(current => current.id !== rowId)
        }))

        axios.delete(`http://radno-vrijeme.herokuapp.com/employees/${rowId}`)
        .then(res => {
          console.log(res);
          console.log(res.data);
        }).catch(e => {
            console.log(e);
        });
    
    }

    const handleChange = (event) =>{
    event.persist();

    }


    const handleBack = () => {
        window.location.href = '/';
    };

    return(
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
                                    Employee list
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                </Typography>
                                <Button className={classes.Button} variant="contained" color="primary" onClick={handleCreate}>
                                Create new
                                </Button>
                            <Paper>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell align="left">First Name</TableCell>
                                            <TableCell align="left">Last Name</TableCell>
                                            <TableCell align="left">Username</TableCell>
                                            <TableCell align="left">Role Id</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formState.employees.map(row => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    {row.id}
                                                </TableCell>
                                                <TableCell align="left">{row.firstName}</TableCell>
                                                <TableCell align="left">{row.lastName}</TableCell>
                                                <TableCell align="left">{row.username}</TableCell>
                                                <TableCell align="left">{row.roleName}</TableCell>
                                                <TableCell align="left" onClick={() => handleEdit(row.id)}>
                                                <CreateIcon />
                                                </TableCell>
                                                <TableCell align="right" onClick={() => handleDelete(row.id)}>
                                                <svg class="svg-icon" viewBox="0 0 20 20">
			                                    <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                                                </svg>
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
    )

}

EmployeeTable.propTypes = {
    history: PropTypes.object
};

export default EmployeeTable;