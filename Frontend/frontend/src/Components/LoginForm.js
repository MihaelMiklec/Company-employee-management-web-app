import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Button,
    IconButton,
    TextField,
    Link,
    Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from "axios";

const schema = {
    username: {
        presence: { allowEmpty: false, message: 'is required' },
    },
    password: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 128
        }
    }
};

const useStyles = makeStyles(theme => ({
    error: {
      color: "red"
    },
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
        alignItems: 'center'
    },
    form: {
        paddingLeft: 100,
        paddingRight: 100,
        paddingBottom: 125,
        flexBasis: 700
    },
    title: {
        marginTop: theme.spacing(3)
    },
    suggestion: {
       marginTop: theme.spacing(2)
    },
    textField: {
        marginTop: theme.spacing(2)
    },
    signInButton: {
        margin: theme.spacing(2, 0)
    }
}));

const LoginForm = props => {
    const { history } = props;

    const classes = useStyles();

    const [formState, setFormState] = useState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
    });

    useEffect(() => {
        const errors = validate(formState.values, schema);

        setFormState(formState => ({
            ...formState,
            isValid: errors ? false : true,
            errors: errors || {}
        }));
    }, [formState.values]);

    const handleBack = () => {
        window.location.href = '/';
    };

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
    };

    const [error, setError] = React.useState("");

    function handleSignIn(e) {
        e.preventDefault();
        setError("");
        const body = `username=${formState.values.username}&password=${formState.values.password}`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        };
        fetch("http://radno-vrijeme.herokuapp.com/login", options).then(
            responses => {
                if (responses.status == 401) {
                    setError("Invalid username or password!")
                } else{
                    console.log("Login")
                    axios.get("http://radno-vrijeme.herokuapp.com/user").then((res) => {
                        console.log(res.data);
                    });
                    sessionStorage.setItem('username', formState.values.username);
                    sessionStorage.setItem('isLogged', true);
                    axios.get("http://radno-vrijeme.herokuapp.com/employees").then((res) => {
                        res.data.forEach(element => {
                            if(element.username == formState.values.username){
                                console.log('Bok');
                                console.log(element.id);
                                sessionStorage.setItem('userID', element.id);
                                sessionStorage.setItem('userRoleID', element.roleId);
                                axios.get("http://radno-vrijeme.herokuapp.com/roles/" + element.roleId).then((res) => {
                                    sessionStorage.setItem('userRole', res.data.name);
                                    console.log(res.data.name);
                                    window.location.href = '/';
                                });
                            }
                        });
                    });
                }
            }
        );
    }

    // function onLogin() {
    //     fetch("http://radno-vrijeme.herokuapp.com/logout").then(() => {
    //         props.onLogin();
    //     });
    // }

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
                                onSubmit={handleSignIn}
                            >
                                <Typography
                                    className={classes.title}
                                    variant="h2"
                                >
                                    Sign in
                                </Typography>
                                <Typography
                                    align="center"
                                    className={classes.suggestion}
                                    color="textSecondary"
                                    variant="body1"
                                    gutterBottom
                                >
                                </Typography>
                                <TextField
                                    className={classes.textField}
                                    error={hasError('username')}
                                    fullWidth
                                    helperText={
                                        hasError('username') ? formState.errors.username : null
                                    }
                                    label="Username"
                                    name="username"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.username || ''}
                                    variant="outlined"
                                />
                                <TextField
                                    className={classes.textField}
                                    error={hasError('password')}
                                    fullWidth
                                    helperText={
                                        hasError('password') ? formState.errors.password[0] : null
                                    }
                                    label="Password"
                                    name="password"
                                    onChange={handleChange}
                                    type="password"
                                    value={formState.values.password || ''}
                                    variant="outlined"
                                />
                                <Grid className={classes.error}>{error}</Grid>
                                <Button
                                    className={classes.signInButton}
                                    color="primary"
                                    disabled={!formState.isValid}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    Sign in
                                </Button>
                            </form>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

LoginForm.propTypes = {
    history: PropTypes.object
};

export default LoginForm;