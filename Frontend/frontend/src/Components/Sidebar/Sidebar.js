import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Drawer } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Profile from "./SidebarComponents/Profile";
import SidebarNav from "./SidebarComponents/SidebarNav";

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 240,
        [theme.breakpoints.up('lg')]: {
            marginTop: 64,
            height: 'calc(100% - 64px)'
        }
    },
    root: {
        backgroundColor: theme.palette.white,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: theme.spacing(2)
    },
    divider: {
        margin: theme.spacing(2, 0)
    },
    nav: {
        marginBottom: theme.spacing(2)
    }
}));

const Sidebar = props => {
    const { open, variant, onClose, className, ...rest } = props;

    const classes = useStyles();

    const pages = [
        {
            title: 'Tasks',
            href: '/taskTable',
            icon: <SettingsIcon/>
        },
        {
            title: 'Groups',
            href: '/groups',
            icon: <PeopleIcon/>
        },
        {
            title: 'Services',
            href: '/services',
            icon: <ShoppingBasketIcon/>
        },
        {
            title: 'Employees',
            href: '/employeeTable',
            icon: <AccountBoxIcon/>
        }
    ];

    const pages2 = [
        {
            title: 'Tasks',
            href: '/taskTable',
            icon: <SettingsIcon/>
        },
        {
            title: 'Groups',
            href: '/groups',
            icon: <PeopleIcon/>
        }
    ];

    function SidebarData(){
        if(sessionStorage.getItem('userRole') == 'ROLE_OWNER'){
            return (
                <SidebarNav
                    className={classes.nav}
                    pages={pages}
                />
            );
        }
        else{
            return (
                <SidebarNav
                    className={classes.nav}
                    pages={pages2}
                />
            );
        }
    }


    return (
        <Drawer
            anchor="left"
            classes={{ paper: classes.drawer }}
            onClose={onClose}
            open={open}
            variant={variant}
        >
            <div
                {...rest}
                className={clsx(classes.root, className)}
            >
                <Profile />
                <Divider className={classes.divider} />
                <SidebarData />
            </div>
        </Drawer>
    );
};

Sidebar.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired
};

export default Sidebar;