import s from "./DepartmentEmployee.module.css";
import React, {Component} from "react";
import $ from "jquery";
import lodash from "lodash";


export default class DepartmentEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDepartmentNames: null,
            allEmployeeData: null,
            departmentForNewEmployee: "",
            departmentName: "",
            name: "",
            lastName: "",
            middleName: "",
            position: "",
            telephonenumber: "",
            email: "",
            birthdate: "",
            employeeId: null,
            isLoaded: false,
            isEditingEmployee: false,
            isAddDepartment: false,
            isAddEmployee: false,
            sort: 'asc',
            sortField: null
        };

        this.onClickSort = this.onClickSort.bind(this);
    };

    onClickGetAddDepartmentWindow = () =>{

        this.state.isAddDepartment = true;

        this.render();
        this.forceUpdate();
    }

    onClickAddDepartment = () =>{

        if(this.state.departmentName === ""){
            alert(" fill department name ");
            return;
        }

        let departmentData =
            {
                name: this.state.departmentName,
            }

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/addDepartment',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(departmentData),
            async: true,
            cache: false,
            success: function(data) {

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

        this.state.departmentName = "";
        this.state.isAddDepartment = false;

        this.getAllDepartmentNames();
        this.render();
        this.forceUpdate();
    }

    onClickCancelAddDepartment = () =>{
        this.state.isAddDepartment = false;

        this.render();
        this.forceUpdate();
    }

    onClickGetAddOrEditEmployeeWindow = (id) =>{
        if(typeof id === 'undefined') {
            this.state.isAddEmployee = true;
        }
        else{
            this.state.isEditingEmployee = true;

            this.state.allEmployeeData.map((item) => {
                if(item.id===id){
                    this.state.employeeId = item.id;
                    this.state.name = item.name;
                    this.state.lastName = item.lastname;
                    this.state.middleName = item.middlename;
                    this.state.telephonenumber = item.telephonenumber;
                    this.state.position = item.position;
                    this.state.birthdate = item.birthdate !== null ? (new Date(item.birthdate).toLocaleDateString("en-US")) : null;
                    this.state.email = item.email;
                    this.state.departmentName = item.department;
                }
            });
        }

        this.render();
        this.forceUpdate();
    }

    onClickAddEmployee = () =>{

        if(this.state.allDepartmentNames[0] == null) {
            alert("add at least one department");
            return;
        }

        if(this.state.name === "" || this.state.lastName === ""
            || this.state.telephonenumber === "" || this.state.email === ""){
            alert(" fill name, lastname, email, telephone ");
            return;
        }

        if(this.state.allDepartmentNames[0] !== null) {
            this.state.departmentName = this.state.allDepartmentNames[0];
        }

        let employeeData = {
            id: this.state.employeeId,
            name: this.state.name,
            lastname: this.state.lastName,
            position: this.state.position,
            middlename: this.state.middleName,
            telephonenumber: this.state.telephonenumber,
            birthdate: this.state.birthdate,
            email: this.state.email,
            department: this.state.departmentName
        }

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/addEmployee',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(employeeData),
            async: false,
            cache: false,
            success: function(data) {

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

        const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));

        delay(300);

        this.getAllEmployees();

        delay(300);

        this.state.isAddEmployee = false;

        this.onClickCancelAddOrEditEmployee();

        this.render();
        this.forceUpdate();
    }

    onClickUpdateEmployee =  () =>{

        if(this.state.name === "" || this.state.lastName === ""
            || this.state.telephonenumber === "" || this.state.birthdate === ""){
            alert(" fill name, lastname, email, telephone ");
            return;
        }

        let employeeData = {
            id: this.state.employeeId,
            name: this.state.name,
            lastname: this.state.lastName,
            position: this.state.position,
            middlename: this.state.middleName,
            birthdate: this.state.birthdate,
            telephonenumber: this.state.telephonenumber,
            email: this.state.email,
            department: this.state.departmentName
        }

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/updateemployee',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(employeeData),
            async: false,
            cache: false,
            success: function(data) {

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

        const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));

        delay(400);

        this.getAllEmployees();

        delay(400);

        this.state.isEditingEmployee = false;

        this.render();
        this.forceUpdate();
    }

    onClickCancelAddOrEditEmployee = () =>{
        this.state.isAddEmployee = false;
        this.state.isEditingEmployee = false;

        this.state.employeeId = "";
        this.state.name = "";
        this.state.lastName = "";
        this.state.middleName = "";
        this.state.telephonenumber = "";
        this.state.position = "";
        this.state.birthdate = "";
        this.state.email = "";
        this.state.departmentName = "";

        this.render();
        this.forceUpdate();
    }

    componentDidMount() {
        this.getAllDepartmentNames();
        this.getAllEmployees();
    }

    getAllDepartmentNames = () =>{

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/getAllDepartmens',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            cache: false,
            success: function(data) {
                this.setState({
                    allDepartmentNames: data
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    }

    getAllEmployees = () =>{

        return  $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/getallemployee',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            cache: false,
            success: function(data) {
                this.setState({
                    allEmployeeData: data,
                    isLoaded: true
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    }

    onClickDeleteEmployee = (id) => {

        let employeeData = {
            id: id
        }

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/deleteEmployee',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(employeeData),
            async: true,
            cache: false,
            success: function(data) {

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

        this.getAllDepartmentNames();
        this.getAllEmployees();

        this.render();
        this.forceUpdate();
    }

    onClickSort = (sortColumn) =>{
        console.log(sortColumn);
        const cloneData = this.state.allEmployeeData.concat();
        this.state.sortField = sortColumn;
        this.state.sort = this.state.sort === 'asc' ? 'desc' : 'asc';
        const orderedData = lodash.orderBy(cloneData, this.state.sortField, this.state.sort);
        this.state.allEmployeeData = orderedData;

        this.render();
        this.forceUpdate();
    }

    render() {
        const {allDepartmentNames,allEmployeeData,isLoaded} = this.state;

        if(!isLoaded) {
            return <p> Loading... </p>
        } else {
            return (
                <div>

                    <div className={s.addBlock}>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th onClick={this.onClickSort.bind(null,"lastname")}>Last name {
                                        this.state.sortField === "lastname" ? (this.state.sort==="asc" ? "^" : "˅") : "--"
                                    }</th>
                                    <th>Middle name</th>
                                    <th onClick={this.onClickSort.bind(null,"position")}>Position{
                                        this.state.sortField === "position" ? (this.state.sort==="asc" ? "^" : "˅") : "--"
                                    }</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                    <th>Birthdate</th>
                                    <th>Telephone</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allEmployeeData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.lastname}</td>
                                        <td>{item.middlename}</td>
                                        <td>{item.position}</td>
                                        <td>{item.department}</td>
                                        <td>{item.email}</td>
                                        <td>{item.birthdate !== null ? (new Date(item.birthdate).toLocaleDateString("en-US")) : null}</td>
                                        <td>{item.telephonenumber}</td>
                                        <button onClick={() => {
                                            this.onClickGetAddOrEditEmployeeWindow(item.id);
                                        }}>edit employee
                                        </button>
                                        <button onClick={() => {
                                            this.onClickDeleteEmployee(item.id);
                                        }}>delete employee
                                        </button>
                                    </tr>
                                ))}
                                </tbody>
                    </div>


                    {
                        (this.state.isAddDepartment ) ? (
                            <div className={s.editWindow}>
                                <span>Department name</span> <input onChange={(e) => {
                                this.state.departmentName = e.target.value
                            }}
                                                                    key={this.state.departmentName}
                                                                    defaultValue={this.state.departmentName}
                                                                    type="text"/>
                                <button onClick={(e) => {
                                    this.onClickAddDepartment(e)
                                }}>Add department
                                </button>
                                <button onClick={(e) => {
                                    this.onClickCancelAddDepartment()
                                }}>Cancel
                                </button>
                            </div>
                        ) : null
                    }
                    <button onClick={(e) => {
                        this.onClickGetAddDepartmentWindow()
                    }}>Add department
                    </button>




                    {
                        (this.state.isAddEmployee || this.state.isEditingEmployee) ? (
                    <div className={s.editWindow}>

                        <span>Department</span> <select onChange={(e) => {
                        this.state.departmentName = e.target.value
                    }}
                                                        defaultValue={this.state.departmentName}
                                                        key={this.state.departmentName}>
                        {allDepartmentNames.map(item => (
                            <option value={item}>{item}</option>
                        ))}
                    </select>

                        <span> Name </span> <input onChange={(e) => {
                        this.state.name = e.target.value
                    }}
                                                  key={this.state.name}
                                                  defaultValue={this.state.name}
                                                  type="text"/>

                        <span> Last Name </span> <input onChange={(e) => {
                        this.state.lastName = e.target.value
                    }}
                                                       key={this.state.lastName}
                                                       defaultValue={this.state.lastName}
                                                       type="text"/>

                        <span> Middle Name </span> <input onChange={(e) => {
                        this.state.middleName = e.target.value
                    }}
                                                       key={this.state.middleName}
                                                       defaultValue={this.state.middleName}
                                                       type="text"/>

                        <span> Position </span> <input onChange={(e) => {
                        this.state.position = e.target.value
                    }}
                                                          key={this.state.position}
                                                          defaultValue={this.state.position}
                                                          type="text"/>

                        <span> Birthdate </span> <input onChange={(e) => {
                        this.state.birthdate = e.target.value
                    }}
                                                       key={this.state.birthdate}
                                                       defaultValue={this.state.birthdate}
                                                       type="text"/> <span> birthdate in format dd/MM/yyyy e.g. 01/01/1990  </span>

                        <span> Telephone number </span> <input onChange={(e) => {
                        this.state.telephonenumber = e.target.value
                    }}
                                                              key={this.state.telephonenumber}
                                                              defaultValue={this.state.telephonenumber}
                                                              type="text"/>

                        <span> Email </span> <input onChange={(e) => {
                        this.state.email = e.target.value
                    }}
                                                    key={this.state.email}
                                                    defaultValue={this.state.email}
                                                    type="text"/>

                        {(this.state.isAddEmployee) ? (
                            <button onClick={(e) => {
                                this.onClickAddEmployee()
                            }}>Add employee
                            </button>
                        ) : null
                        }
                        {(this.state.isEditingEmployee) ?(
                            <button onClick={(e) => {
                                this.onClickUpdateEmployee()
                            }}>Update employee
                            </button>
                        ) : null
                        }

                        <button onClick={(e) => {
                            this.onClickCancelAddOrEditEmployee();
                        }}>cancel
                        </button>
                    </div>
                        ) : null
                    }
                    <button onClick={(e) => {
                        this.onClickGetAddOrEditEmployeeWindow()
                    }}>Add employee
                    </button>


                }
                </div>
            );
        }



    }


}
