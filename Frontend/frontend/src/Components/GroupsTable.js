import React, {useState, useEffect} from 'react';
import {Link as RouterLink, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import {makeStyles} from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import Save from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import Messages from './Messages/Messages';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
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
    title2: {
        marginTop: theme.spacing(17)
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
        width: 140
    },
    Button2: {
        margin: theme.spacing(1, 0),
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

const GroupsTable = (props) => {


    const {history} = props;
    const classes = useStyles();

    const [formState, setFormState] = useState({
        isValid: true,
        members: [],
        leaders: [],
        groups: [],
        touched: {},
        uvjetDel: true,
        uvjetMessage: false,
        errors: {},
        count: 0,
    });

    useEffect(() => {

        axios.get("http://radno-vrijeme.herokuapp.com/groups")
            .then(res => {
                res.data.map(trenutni => {
                    if ((trenutni.leaderID == sessionStorage.getItem('userID')) || (sessionStorage.getItem('userRole') == 'ROLE_OWNER') || (trenutni.memberIDs.includes(parseInt(sessionStorage.getItem('userID'))))) {
                        console.log(trenutni.memberIDs, sessionStorage.getItem('userID'));
                        var members = [];
                        var leader = {};
                        axios.get("http://radno-vrijeme.herokuapp.com/employees").then(res => {
                            res.data.map(employee => {
                                if (employee.id === trenutni.leaderID) {
                                    leader = {
                                        id: employee.id,
                                        firstName: employee.firstName,
                                        lastName: employee.lastName
                                    }
                                }
                                trenutni.memberIDs.map(memberId => {
                                    if (employee.id === memberId) {
                                        members = [...members, {
                                            id: employee.id,
                                            firstName: employee.firstName,
                                            lastName: employee.lastName
                                        }]
                                    }
                                })
                            })
                            setFormState(formState => ({
                                ...formState,
                                groups: [...formState.groups, {id: trenutni.id, name: trenutni.name, members, leader}]
                            }))
                        })
                    }
                })
            })

    }, [])

    const handleCreate = (event) => {
        event.preventDefault();

        //trebalo bi ga linkati na upravljanje grupama bez poslanog propsa za id
        window.localStorage.setItem("groupId", null);
        props.history.push('/group_management');
    }

    const handleEdit = (rowId) => {
        //trebalo bi ga linkati na ekran upravljanje grupama sa propsom id koji ce biti jednak rowId argumentu funkcije
        window.localStorage.setItem("groupId", rowId);
        props.history.push('/group_management');

    }

    const handleBack = () => {
        history.goBack();
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
                                <ArrowBackIcon/>
                            </IconButton>
                            <div className={classes.contentBody}>
                                <form
                                    className={classes.form}
                                    //onSubmit={handleSignUp}
                                >
                                    <Typography
                                        className={classes.title}
                                        variant="h2"
                                    >
                                        List of groups
                                    </Typography>
                                    {sessionStorage.getItem("userRole") == 'ROLE_OWNER' ? (
                                        <Button className={classes.Button} variant="contained" color="primary"
                                                onClick={handleCreate}>
                                            Create new
                                        </Button>
                                    ) : (
                                        <div/>
                                    )}
                                    {formState.groups.map(group => (
                                        <div key={group.id}>
                                            <Typography
                                                className={classes.title2}
                                                variant="h4"
                                            >
                                                {group.name}
                                            </Typography>
                                            <Typography
                                                className={classes.title}
                                                variant="h6"
                                            >
                                                Group leader: {group.leader.firstName + " " + group.leader.lastName}
                                            </Typography>
                                            {((sessionStorage.getItem('userRole') === 'ROLE_OWNER') || (sessionStorage.getItem('userID') == group.leader.id)) ? (
                                                <Button className={classes.Button2} variant="contained" color="primary"
                                                        onClick={() => handleEdit(group.id)}>
                                                    <CreateIcon/>
                                                    Edit
                                                </Button>
                                            ) : (
                                              <div/>
                                            )}
                                            <Typography
                                                className={classes.title}
                                                variant="h6"
                                            >
                                                Group members:
                                            </Typography>
                                            <Paper>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Id</TableCell>
                                                            <TableCell align="left">First name</TableCell>
                                                            <TableCell align="left">Last name</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {group.members.map(member => (
                                                            <TableRow key={member.id}>
                                                                <TableCell component="th" scope="row">
                                                                    {member.id}
                                                                </TableCell>
                                                                <TableCell align="left">{member.firstName}</TableCell>
                                                                <TableCell align="left">{member.lastName}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Paper>
                                        </div>
                                    ))}
                                </form>
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
GroupsTable.propTypes = {
    history: PropTypes.object
};

export default GroupsTable;