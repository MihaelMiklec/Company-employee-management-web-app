import React, {Component} from 'react';

export default class Messages extends Component{

    constructor(props){
        super(props)
    }


    render(){
            
           if(this.props.uvjet)
                return(
                    <div className="alert alert-success" role="alert">
                    Successfully done!
                     </div>
                )
            else{
                return(
                    <div>

                    </div>
                )
            }
    }
}

