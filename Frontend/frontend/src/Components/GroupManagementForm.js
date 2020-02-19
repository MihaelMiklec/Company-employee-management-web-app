import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import Save from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import Messages from './Messages/Messages';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
    },
    Fab: {
        marginLeft: '10px'
    }
}));

const GroupManagementForm = props => {

    const { history } = props;
    const classes = useStyles();
    const GID = window.localStorage.getItem("groupId");
    console.log(GID)
    var isEdit = false;
    if(GID!=="null") isEdit = true;
    else isEdit = false;

    const [formState, setFormState] = useState({
        isValid: true,
        members: [],
        membersToAdd: [],
        leaders: [],
        groupIds: [],
        groupId: null,
        values: { groupName: "",groupLeaderID: null,groupLeader: "",groupMembersIDs: [],memberToAdd: ""},
        touched: {},
        uvjetDel: true,
        uvjetMessage: false,
        errors: {},
        count: 0,
    });

    const validate = () =>{
        
        if(!formState.values.groupName=="" && !formState.values.groupLeader==""){
            return true;
        } 
        return false;
    }

    useEffect(() =>{

        //create group
        if(GID==="null"){
            if(formState.count===0){
                const uvjet = validate();
                setFormState(formState =>({
                    ...formState,
                    isValid: uvjet,
                    count: formState.count + 1
                }))
            axios.get('http://radno-vrijeme.herokuapp.com/employees')
            .then(res =>{
                //dohvacamo voditelje
                res.data.map(current =>{
                    if(current.roleId===40 || current.roleId===110){
                        setFormState(formState =>({
                            ...formState,
                            leaders:  [...formState.leaders,{id: current.id,firstName: current.firstName,lastName: current.lastName}]
                        }))
                    }
                    //dohvacamo sve djelatnike
                    if(current.roleId===98){
                        setFormState(formState =>({
                            ...formState,
                            membersToAdd: [...formState.membersToAdd,{id: current.id,firstName: current.firstName,lastName: current.lastName}],
                            values: {...formState.values,memberToAdd: current.id + " " + current.firstName + " " + current.lastName}
                        }))
                    }
                })
            })
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
        //edit group
        else{
            if(formState.count===0){
                setFormState(formState =>({
                    ...formState,
                    count: formState.count + 1,
                    uvjetDel: true
                }))
            var Ids = [];
            var leaderId = null;
            var groupName = "";
            axios.get("http://radno-vrijeme.herokuapp.com/groups/" + GID)
            .then(res =>{
                        setFormState(formState =>({
                            ...formState,
                            values: {groupName: res.data.name,groupLeaderID: res.data.leaderID,groupMembersIDs: res.data.memberIDs},
                        }))
                        for(let i = 0 ; i < res.data.memberIDs.length ; ++i){
                            Ids[i] = res.data.memberIDs[i];
                        }
                        leaderId = res.data.leaderID;
                })
            axios.get('http://radno-vrijeme.herokuapp.com/employees').
            then(result =>{
                result.data.map(current =>{
                    if(current.roleId===40 || current.roleId===110){
                        setFormState(formState =>({
                            ...formState,
                            leaders:  [...formState.leaders,{id: current.id,firstName: current.firstName,lastName: current.lastName}]
                        }))
                    }
                    if(current.id===leaderId){
                        setFormState(formState =>({
                            ...formState,
                            values: {...formState.values,groupLeader: current.id + " " + current.firstName + " " + current.lastName}
                        }))
                    }
                    Ids.map(id =>{
                        if(current.id===id){
                            setFormState(formState =>({
                                ...formState,
                                members:  [...formState.members,{id: current.id,firstName: current.firstName,lastName: current.lastName}]
                            })
                            )
                        }
                    })
                    var uvjet = true;
                    for(let i = 0 ; i < Ids.length ; ++i){
                        if(current.id===Ids[i]){
                            uvjet = false;
                        }
                    }
                    if(uvjet && current.roleId===98){
                        setFormState(formState =>({
                            ...formState,
                            membersToAdd: [...formState.membersToAdd,{id: current.id,firstName: current.firstName,lastName: current.lastName}],
                            values: {...formState.values,memberToAdd: current.id + " " + current.firstName + " " + current.lastName}
                        }))
                    }
                })
            })
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
},[formState.values])

    const handleDel = (id) =>{

        var group;
        var structure = {name: "",leaderID: null,memberIDs: [],id: null}
        const headers = {
            'Content-Type' : 'application/json'
        }
        //mijenjam polje membersIDs jer mičemo člana, tako da možemo napraviti put na api s novim vrijednostima
        //takoder mijenjamo members polje da se više izbrisani član ne ispisuje u tablici
        let membertoadd = formState.members.filter(member => member.id === id)
        console.log(membertoadd)
                setFormState(formState =>({
                    ...formState,
                    members: formState.members.filter(member => member.id !== id),
                    membersToAdd: [...formState.membersToAdd,membertoadd[0]],
                    values: {...formState.values,memberToAdd: membertoadd[0].id + " " + membertoadd[0].firstName + " " + membertoadd[0].lastName,groupMembersIDs: formState.values.groupMembersIDs.filter(member => id != member)}
                }))
            if(GID!=="null"){
               axios.get("http://radno-vrijeme.herokuapp.com/groups/" + GID)
                .then(res => {
                    group = res.data
                    structure = {name: group.name,leaderID: group.leaderID,memberIDs: group.memberIDs.filter(ide => ide!=id),id: GID}
                    axios.put('http://radno-vrijeme.herokuapp.com/groups/' + GID,structure,headers)
                    .then((response) =>{
                     console.log(response)
                    },(error) =>{
                    console.log(error)
                    }) 
                })
            }
        
    }
    const handleChange = event => {
        event.persist();

          setFormState(formState => ({
              ...formState,
              values: {
                  ...formState.values,
                  [event.target.name]: event.target.value
              },
              touched: {
                  ...formState.touched,
                  [event.target.name]: true
              },
              uvjetDel: false
          }));
      };

      //handling addition of a member to the group
    const handleAdd = (event) =>{
        event.preventDefault();

            if(typeof formState.values.memberToAdd.id !== "undefined"){
                if(formState.values.memberToAdd!==""){
                    console.log(formState.values.memberToAdd)
                    var group;
                    var structure = {name: "",leaderID: null,memberIDs: [],id: null}
                    const headers = {
                        'Content-Type' : 'application/json'
                    }
                        setFormState(formState =>({
                            ...formState,
                            membersToAdd: formState.membersToAdd.filter(member => member.id!==formState.values.memberToAdd.id),
                            members: [...formState.members,formState.values.memberToAdd],
                            values: {...formState.values,memberToAdd: ""}
                        }))
                        
                        if(GID){
                            axios.get("http://radno-vrijeme.herokuapp.com/groups/" + GID)
                                .then(res => {
                                    group = res.data
                                    structure = {name: group.name,leaderID: group.leaderID,memberIDs: [...group.memberIDs,formState.values.memberToAdd.id],id: GID}
                                    axios.put('http://radno-vrijeme.herokuapp.com/groups/' + GID,structure,headers)
                                    .then((response) =>{
                                    console.log(response)
                                    },(error) =>{
                                    console.log(error)
                                    })
                                    
                                })
                        }
                }
            }
    }

    const handleSave = (event) =>{
        event.preventDefault();

        setFormState(formState =>({
            ...formState,
            uvjetMessage: true
        }))

        let members = []
        formState.members.map(current =>{
            members = [...members,current.id];
        })
        let id = formState.values.groupLeader.split(" ");
        const params = {
            name: formState.values.groupName,
            leaderID: id[0],
            memberIDs: members
        }

        const params2 = {
            id: GID,
            name: formState.values.groupName,
            leaderID: formState.values.groupLeaderID,
            memberIDs: members
        }
        const headers = {
            'Content-Type' : 'application/json'
        }

        if(!(GID==="null")){
            axios.put('http://radno-vrijeme.herokuapp.com/groups/' + GID,params2,headers)
                .then((response) =>{
                    console.log(response)
                },(error) =>{
                    setFormState(formState =>({
                        ...formState,
                        uvjetMessage: false
                    }))
                console.log(error)
                })
        }
        else{
            axios.post('http://radno-vrijeme.herokuapp.com/groups',params)
                .then((response) =>{
                    console.log(response)
                },(error) =>{
                    setFormState(formState =>({
                        ...formState,
                        uvjetMessage: false
                    }))
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

        let members = []
        formState.members.map(current =>{
            members = [...members,current.id];
        })

        const params = {
            name: formState.values.groupName,
            leaderID: formState.values.groupLeaderID,
            memberIDs: members     
        }

         axios.delete('http://radno-vrijeme.herokuapp.com/groups/' + GID,params)
          .then((response) =>{
           console.log(response)
          },(error) =>{
            setFormState(formState =>({
                ...formState,
                uvjetMessage: false
            }))
          console.log(error)
          })
    }

    const handleBack = () => {
        window.location.href = '/groups';
    };
    //svg je ikona za brisanje clana grupe, na njen klik se brise taj clan iz liste tj mice se djelatnik iz grupe
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
                                    Group management
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                </Typography>
                                <TextField
                                    className={classes.textField}
                                    fullWidth
                                    label="Group name"
                                    name="groupName"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.groupName}
                                    variant="outlined"
                                />
                               <InputLabel 
                                    id="demo-simple-select-label1"
                                    className={classes.inputLabel}
                                >
                                    Select a leader for this group:
                                </InputLabel>
                                <Select
                                    //className={classes.textField}
                                    labelId="demo-simple-select-label1"
                                    fullWidth
                                    name="groupLeader"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.groupLeader}
                                    variant="outlined"
                                >
                                    {formState.leaders.map(current =>(
                                        <MenuItem 
                                        value={current.id + " " + current.firstName + " " + current.lastName}
                                        name="groupLeader" 
                                        onChange={handleChange}
                                        >
                                        {current.id + " " + current.firstName + " " + current.lastName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Typography
                                    className={classes.title}
                                    variant="h5"
                                >
                                    Group members:
                                </Typography>
                                <Paper>
                                <Table>
                                <TableHead>
                                    <TableRow >
                                        <TableCell >Id</TableCell>
                                        <TableCell >First name</TableCell>
                                        <TableCell >Last name</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formState.members.map(row => (
                                        <TableRow key={row.id}>
                                            <TableCell scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell >{row.firstName}</TableCell>
                                            <TableCell >{row.lastName}</TableCell>
                                            <TableCell onClick={() => handleDel(row.id)} >
                                            <svg class="svg-icon" viewBox="0 0 20 20">
			                                <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                                            </svg>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                                </Paper>
                                <InputLabel 
                                    id="demo-simple-select-label2"
                                    className={classes.inputLabel}
                                >
                                    Select employee that you want to add to this group:
                                </InputLabel>
                                <Select
                                    //className={classes.textField}
                                    id="Add"
                                    labelId="demo-simple-select-label2"
                                    fullWidth
                                    name="memberToAdd"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.memberToAdd}
                                    variant="outlined"
                                >
                                    {formState.membersToAdd.map(current =>(
                                        <MenuItem 
                                        //value={formState.values.groupLeader.id + " " + formState.values.groupLeader.firstName + " " + formState.values.groupLeader.lastName}
                                        name="memberToAdd"
                                        id={current.id}
                                        onChange={handleChange}
                                        value={current}
                                        >
                                        {current.id} {current.firstName + " " + current.lastName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Typography
                                    className={classes.title}
                                    variant="h6"
                                >
                                    Click to add selected member to the group:
                                    <Fab className={classes.Fab} onClick={handleAdd} color="primary" aria-label="add" size="small">
                                    <AddIcon />
                                    </Fab>
                                </Typography>
                                <Button
                                className={classes.ButtonDelete}
                                color="primary"
                              disabled={isEdit && formState.uvjetDel? false : true}
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

GroupManagementForm.propTypes = {
    history: PropTypes.object
};

export default GroupManagementForm;