import './App.css';
import React, {Component} from "react";
import DepartmentEmployee from "./components/DepartmentEmployee/DepartmentEmployee";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render(){
        return (
                <div className='app-wrapper'>
                    <DepartmentEmployee/>
                </div>
        );
    }
}





