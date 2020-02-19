import React, {useState, useEffect} from 'react';
import {Link as RouterLink, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import {makeStyles} from '@material-ui/core/styles';
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
        presence: {allowEmpty: true, message: 'is required'},
        length: {
            maximum: 32
        }
    },
    name: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            maximum: 32
        }
    },
    surname: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            maximum: 32
        }
    },
    group: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            maximum: 32
        }
    },
    serviceDescription: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            maximum: 256
        }
    },
    leader: {
        presence: {allowEmpty: false, message: 'is required'},
        length: {
            maximum: 32
        }
    },
    pricePerHour: {
        presence: {allowEmpty: false, message: 'is required'},
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

const EmployeesManagement = props => {
    const {history} = props;


    const helpSID = window.localStorage.getItem("employeeId");
    let SID = helpSID == "null" ? null : helpSID;

    const roles = [
        {value: '39', label: 'Leader'},
        {value: '40', label: 'Employee'}
    ]

    const classes = useStyles();

    const [formState, setFormState] = useState({
        isValid: false,
        isSaveValid: false,
        isDeleteValid: false,
        isRoleSelected: false,
        isCompanySelected: false,
        uvjetMessage: false,
        vrijednosti: [],
        values: {
            username: '',
            password: '',
            firstName: '',
            lastname: '',
            email: '',
            dateOfBirth: '',
            role: '',
            company: ''
        },
        touched: {},
        errors: {},
        groups: [],
        employees: [],
        roles: [],
        companies: [],
        selectedRole: {},
        selectedCompany: {}
    });

    let isNull = true;

    useEffect(() => {
        axios.get("http://radno-vrijeme.herokuapp.com/employees")
            .then(res => {
                const helpEmployees = res.data;
                if (SID != null) {
                    isNull = false;
                    helpEmployees.forEach(employee => {
                        if (employee.id == SID) {
                            axios.get("http://radno-vrijeme.herokuapp.com/roles")
                                .then(response => {
                                    const newRoles = response.data;
                                    newRoles.forEach(role => {
                                        if (role.id === employee.roleId) {
                                            setFormState(formState => ({
                                                ...formState,
                                                values: {
                                                    ...formState.values,
                                                    role: role.name
                                                },
                                                selectedRole: role.name
                                            }));
                                        }
                                    });
                                });

                            axios.get("http://radno-vrijeme.herokuapp.com/companies")
                                .then(response => {
                                    const newCompanies = response.data;
                                    newCompanies.forEach(company => {
                                        if (company.id === employee.companyId) {
                                            setFormState(formState => ({
                                                ...formState,
                                                values: {
                                                    ...formState.values,
                                                    company: company.name
                                                },
                                                selectedCompany: company.name
                                            }));
                                        }
                                    });
                                });

                            const dateString = employee.dateOfBirth;
                            const arrayDate = dateString.split("-");
                            const newFormatDate = arrayDate[2] + "-" + arrayDate[1] + "-" + arrayDate[0];

                            setFormState(formState => ({
                                ...formState,
                                values: {
                                    ...formState.values,
                                    username: employee.username,
                                    password: employee.password,
                                    firstName: employee.firstName,
                                    lastName: employee.lastName,
                                    email: employee.email,
                                    dateOfBirth: newFormatDate
                                }
                            }));

                        }
                    });
                }

                setFormState(formState => ({
                    ...formState,
                    vrijednosti: res.data,
                    employees: res.data,
                }))
            });

        axios.get("http://radno-vrijeme.herokuapp.com/groups")
            .then(res => {

                setFormState(formState => ({
                    ...formState,
                    groups: res.data
                }))
            });

        axios.get("http://radno-vrijeme.herokuapp.com/roles")
            .then(res => {
                const helpRoles = res.data;
                setFormState(formState => ({
                    ...formState,
                    roles: res.data
                }))
            });

        axios.get("http://radno-vrijeme.herokuapp.com/companies")
            .then(res => {
                setFormState(formState => ({
                    ...formState,
                    companies: res.data
                }))
            });


        if (SID != null) {
            setFormState(formState => ({
                ...formState,
                isSaveValid: true,
                isDeleteValid: true,
                isRoleSelected: true,
                isCompanySelected: true
            }));
        }

    }, []);

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


        if (document.getElementById('username').value === ''
            || document.getElementById('password').value === ''
            || document.getElementById('firstName').value === ''
            || document.getElementById('lastName').value === ''
            || document.getElementById('email').value === ''
            || document.getElementById('dateOfBirth').value === ''
            || document.getElementById('dateOfBirth').value === null
            || formState.isRoleSelected === false
            || formState.isCompanySelected === false) {
            setFormState(formState => ({
                ...formState,
                isSaveValid: false
            }));
        } else {
            setFormState(formState => ({
                ...formState,
                isSaveValid: true
            }));
        }


    };

    const handleBack = () => {
        history.goBack();
    };

    const handleRoleSelect = event => {
        setFormState(formState => ({
            ...formState,
            isRoleSelected: true,
            selectedRole: event.target.value,
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

        const isSelected1 = true;

        if (document.getElementById('username').value === ''
            || document.getElementById('password').value === ''
            || document.getElementById('firstName').value === ''
            || document.getElementById('lastName').value === ''
            || document.getElementById('email').value === ''
            || document.getElementById('dateOfBirth').value === ''
            || document.getElementById('dateOfBirth').value === null
            || isSelected1 === false
            || formState.isCompanySelected === false) {
            setFormState(formState => ({
                ...formState,
                isSaveValid: false
            }));
        } else {
            setFormState(formState => ({
                ...formState,
                isSaveValid: true
            }));
        }
    };

    const handleCompanySelect = event => {
        setFormState(formState => ({
            ...formState,
            isCompanySelected: true,
            selectedCompany: event.target.value,
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

        const isSelected2 = true;

        if (document.getElementById('username').value === ''
            || document.getElementById('password').value === ''
            || document.getElementById('firstName').value === ''
            || document.getElementById('lastName').value === ''
            || document.getElementById('email').value === ''
            || document.getElementById('dateOfBirth').value === ''
            || document.getElementById('dateOfBirth').value === null
            || formState.isRoleSelected === false
            || isSelected2 === false) {
            setFormState(formState => ({
                ...formState,
                isSaveValid: false
            }));
        } else {
            setFormState(formState => ({
                ...formState,
                isSaveValid: true
            }));
        }
    };

    const handleDelete = event => {
        event.preventDefault();

        setFormState(formState => ({
            ...formState,
            uvjetMessage: true
        }))


        if (SID != null) {
            axios.delete(`http://radno-vrijeme.herokuapp.com/employees/${SID}`)
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

        setFormState(formState => ({
            ...formState,
            uvjetMessage: true
        }));

        const dateString = document.getElementById('dateOfBirth').value.toString();
        const arrayDate = dateString.split("-");
        const newFormatDate = arrayDate[2] + "-" + arrayDate[1] + "-" + arrayDate[0];

        let helpRoleId = 0;
        formState.roles.forEach(role => {
            if (role.name === formState.selectedRole) {
                helpRoleId = role.id;
            }
        });

        let helpCompanyId = 0;
        formState.companies.forEach(company => {
            if (company.name === formState.selectedCompany) {
                helpCompanyId = company.id;
            }
        });

        if (SID == null) {

            const param = {
                id: null,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                dateOfBirth: newFormatDate,
                companyId: helpCompanyId,
                roleId: helpRoleId
            };
            console.log(param);
            axios.post('http://radno-vrijeme.herokuapp.com/employees', param)
                .then(res => {
                    console.log(res);
                }).catch(e => {
                console.log(e);
            });
            window.location.href = '/';
            return;
        }

        if (SID != null) {
            const param2 = {
                id: SID,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                dateOfBirth: newFormatDate,
                companyId: helpCompanyId,
                roleId: helpRoleId
            };

            axios.put(`http://radno-vrijeme.herokuapp.com/employees/${SID}`, param2)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                }).catch(e => {
                console.log(e);
            });
            window.location.href = '/';
            return;
        }
        window.location.href = '/';
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
                                <ArrowBackIcon/>
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
                                    Employee Management
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                >
                                </Typography>
                                <TextField
                                    className={classes.textField}
                                    id="username"
                                    error={hasError('username')}
                                    fullWidth
                                    helperText={
                                        hasError('username') ? formState.errors.username[0] : null
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
                                    id="password"
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
                                <TextField
                                    className={classes.textField}
                                    id="firstName"
                                    error={hasError('firstName')}
                                    fullWidth
                                    helperText={
                                        hasError('firstName') ? formState.errors.firstName[0] : null
                                    }
                                    label="First Name"
                                    name="firstName"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.firstName || ''}
                                    variant="outlined"
                                />
                                <TextField
                                    className={classes.textField}
                                    id="lastName"
                                    error={hasError('lastName')}
                                    fullWidth
                                    helperText={
                                        hasError('lastName') ? formState.errors.lastName[0] : null
                                    }
                                    label="Last Name"
                                    name="lastName"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.lastName || ''}
                                    variant="outlined"
                                />
                                <TextField
                                    className={classes.textField}
                                    error={hasError('email')}
                                    id="email"
                                    fullWidth
                                    helperText={
                                        hasError('email') ? formState.errors.email[0] : null
                                    }
                                    label="Email adress"
                                    name="email"
                                    onChange={handleChange}
                                    type="email"
                                    value={formState.values.email || ''}
                                    variant="outlined"
                                />
                                <InputLabel
                                    id="demo-simple-select-label"
                                    className={classes.inputLabel}
                                >
                                    Date of Birth:
                                </InputLabel>
                                <TextField
                                    className={classes.textField}
                                    id="dateOfBirth"
                                    error={hasError('dateOfBirth')}
                                    fullWidth
                                    helperText={
                                        hasError('dateOfBirth') ? formState.errors.dateOfBirth[0] : null
                                    }
                                    name="dateOfBirth"
                                    onChange={handleChange}
                                    type="date"
                                    value={formState.values.dateOfBirth || ''}
                                    variant="outlined"
                                /> <InputLabel
                                id="demo-simple-select-label"
                                className={classes.inputLabel}
                            >

                                Select a company:
                            </InputLabel>
                                <Select
                                    //className={classes.textField}
                                    labelId="demo-simple-select-label"
                                    id="company"
                                    error={hasError('company')}
                                    fullWidth
                                    helperText={
                                        hasError('company') ? formState.errors.company[0] : null
                                    }
                                    name="company"
                                    onChange={handleCompanySelect}
                                    type="text"
                                    value={formState.values.company}
                                    variant="outlined"
                                >
                                    {formState.companies.map(current => (
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

                                    Select a role:
                                </InputLabel>
                                <Select
                                    //className={classes.textField}
                                    labelId="demo-simple-select-label"
                                    id="role"
                                    error={hasError('role')}
                                    fullWidth
                                    helperText={
                                        hasError('role') ? formState.errors.role[0] : null
                                    }
                                    name="role"
                                    onChange={handleRoleSelect}
                                    type="text"
                                    value={formState.values.role}
                                    variant="outlined"
                                >
                                    {formState.roles.map(current => (
                                        <MenuItem
                                            value={current.name}
                                            id={current.id}
                                            onChange={handleChange}>
                                            {current.name}
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
                                    <Delete/>
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
                                    <Save/>
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

EmployeesManagement.propTypes = {
    history: PropTypes.object
};

export default EmployeesManagement;