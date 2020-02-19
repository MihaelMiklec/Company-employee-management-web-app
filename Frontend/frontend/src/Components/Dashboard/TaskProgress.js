import React, {useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Avatar,
    LinearProgress
} from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import axios from "axios";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%'
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: {
        fontWeight: 700
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    },
    progress: {
        marginTop: theme.spacing(3)
    }
}));

function TasksProgress(props) {
    const {className, ...rest} = props;

    const classes = useStyles();
    console.log(props.task.hour)
    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardContent>
                <Grid
                    container
                    justify="space-between"
                >
                    <Grid item>
                        <Typography
                            className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="h5"
                        >
                            {props.task.name}
                        </Typography>
                        <Typography variant="subtitle2">{"Hours planned: " + props.task.plannedHours}</Typography>
                        <Typography variant="subtitle2">{"Hours logged: " + props.task.loggedHours}</Typography>
                        <Typography variant="h6">{props.task.loggedHours ? parseFloat((props.task.loggedHours/props.task.plannedHours*100).toFixed(2)) : 0}%
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <InsertChartIcon className={classes.icon}/>
                        </Avatar>
                    </Grid>
                </Grid>
                <LinearProgress
                    className={classes.progress}
                    value={props.task.loggedHours ? props.task.loggedHours/props.task.plannedHours*100 : 0}
                    variant="determinate"
                />
            </CardContent>
        </Card>
    );
};

TasksProgress.propTypes = {
    className: PropTypes.string
};

export default TasksProgress