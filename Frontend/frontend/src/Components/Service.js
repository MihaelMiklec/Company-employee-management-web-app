import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {CardHeader} from "@material-ui/core";

const Service = (props) => {
    return (
        <div>
            {props.service ? (
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant={"h4"}>
                            {props.service.name}
                        </Typography>
                        <Typography gutterBottom variant={"subtitle1"}>
                            {props.service.description}
                        </Typography>
                        <Typography >
                            {"Price per hour : " + props.service.pricePerHour + "€"}
                        </Typography>
                    </CardContent>
                </Card>
            ): null}
        </div>
    )
}
export default Service