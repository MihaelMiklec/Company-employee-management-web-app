import React, { useState } from 'react';
import {BrowserRouter, Switch, Route, Redirect, Link} from 'react-router-dom';
import './App.css';
import clsx from 'clsx';
import Navbar from "./Components/Navbar";
import ServiceList from './Components/ServiceList';
import LoginForm from "./Components/LoginForm";
import EmployeesManagement from "./Components/EmployeesManagement";
import TaskManagement from "./Components/TaskManagement";
import EmployeeTable from './Components/EmployeeTable';
import TaskTable from './Components/TaskTable';
import ServiceManagementForm from "./Components/ServiceManagementForm";
import GroupManagementForm from "./Components/GroupManagementForm";
import ServiceTable from "./Components/ServiceTable";
import GroupsTable from "./Components/GroupsTable";
import Sidebar from "./Components/Sidebar/Sidebar";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import WorkHourForm from "./Components/WorkHourForm";
import TaskDetails from "./Components/TaskDetails";
import Dashboard from "./Components/Dashboard/Dashboard";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        [theme.breakpoints.up('sm')]: {
            paddingTop: 64
        }
    },
    shiftContent: {
        paddingLeft: 240
    },
    content: {
        height: '100%'
    }
}));


function App() {
    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
        defaultMatches: true
    });

    const [openSidebar, setOpenSidebar] = useState(false);

    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    const shouldOpenSidebar = isDesktop ? true : openSidebar;

    function PrivateRoute({ children, ...rest }) {
        return (
            <Route
                {...rest}
                render={({ location }) =>
                    (sessionStorage.getItem('isLogged') == 'true') ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
                }
            />
        );
    }

        if((sessionStorage.getItem('isLogged') == 'false') || (sessionStorage.getItem('isLogged') == null)){
            console.log('Bok');
            return (
                <BrowserRouter>
                        <Navbar />
                        <Switch>
                            <Route path={"/"} exact component={ServiceList}/>
                            <Route path={"/login"} exact component={LoginForm}/>
                        </Switch>
                </BrowserRouter>
            );
        }

        else{
            return(
                <BrowserRouter>
                    <div
                        className={clsx({
                            [classes.shiftContent]: isDesktop
                        })}
                    >
                        <Navbar onSidebarOpen={handleSidebarOpen} />
                        <Sidebar
                            onClose={handleSidebarClose}
                            open={shouldOpenSidebar}
                            variant={isDesktop ? 'persistent' : 'temporary'}
                        />
                        <Switch>
                            <Route path={"/"} exact component={ServiceList}/>
                            <Route path={"/employeesManagement"}  render={(props) => <EmployeesManagement {...props} id={null}/>}/>
                            <Route path={"/taskManagement"}  render={(props) => <TaskManagement {...props} id={null}/>}/>
                            <PrivateRoute path={"/employeeTable"}>
                                <EmployeeTable />
                            </PrivateRoute>
                            <PrivateRoute path={"/dashboard"} exact component={Dashboard}/>
                            <PrivateRoute path={"/taskTable"} exact component={TaskTable}/>
                            <PrivateRoute path={"/service_management"}  exact component={ServiceManagementForm}/>
                            <PrivateRoute path={"/group_management"}  exact component={GroupManagementForm}/>
                            <PrivateRoute path={"/services"} exact component={ServiceTable}/>
                            <PrivateRoute path={"/groups"} exact component={GroupsTable}/>
                            <Route path={"/taskDetails"} exact component={TaskDetails}/>
                            <Route path={"/workHours"}  render={(props) => <WorkHourForm {...props} id={null}/>}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            );
        }
}

export default App;
