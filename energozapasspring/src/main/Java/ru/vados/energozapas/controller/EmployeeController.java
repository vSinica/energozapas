package ru.vados.energozapas.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.vados.energozapas.model.Department;
import ru.vados.energozapas.model.Employee;
import ru.vados.energozapas.repository.DepartmentRepository;
import ru.vados.energozapas.repository.EmployeeRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Optional;

@RestController
public class EmployeeController {

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    ObjectMapper objectMapper = new ObjectMapper();

    @CrossOrigin
    @PostMapping("/addEmployee")
    public void addEmployee(@RequestBody(required = false) HashMap<String,String> newEmployeeData) throws ParseException {

        Department department = departmentRepository.findDepartmentByName(newEmployeeData.get("department"));

        Employee employee = new Employee();
        employee.setName(newEmployeeData.get("name"));
        employee.setLastname(newEmployeeData.get("lastname"));
        employee.setMiddlename(newEmployeeData.get("middlename"));
        employee.setPosition(newEmployeeData.get("position"));
        employee.setTelephonenumber(newEmployeeData.get("telephonenumber"));
        employee.setEmail(newEmployeeData.get("email"));

        if(!newEmployeeData.get("birthdate").equals("")) {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            java.util.Date utilDate = format.parse(newEmployeeData.get("birthdate"));
            java.sql.Date sqlDate = new java.sql.Date(utilDate.getTime());
            employee.setBirthdate(sqlDate);
        }else{}

        Boolean isEmployeeExist = employeeRepository.existsEmployeeByNameAndLastnameAndMiddlenameAndBirthdate(
                employee.getName(),employee.getLastname(),employee.getMiddlename(),employee.getBirthdate());

        if(isEmployeeExist){
            return;
        }

        department.addEmployee(employee);
        employee.setDepartment(department);
        departmentRepository.save(department);


    }

    @CrossOrigin
    @PostMapping("getallemployee")
    public String getAllEmployee() throws JsonProcessingException {
        return objectMapper.writeValueAsString(employeeRepository.findAll());
    }

    @CrossOrigin
    @PostMapping("updateemployee")
    public void updateEmployee(@RequestBody(required = false) HashMap<String,String> newEmployeeData) throws ParseException {

        Optional<Employee> optionalEmployee = employeeRepository.findById(Long.parseLong(newEmployeeData.get("id")));
        Employee employee = optionalEmployee.get();


        employee.setName(newEmployeeData.get("name"));
        employee.setLastname(newEmployeeData.get("lastname"));
        employee.setMiddlename(newEmployeeData.get("middlename"));
        employee.setPosition(newEmployeeData.get("position"));
        employee.setTelephonenumber(newEmployeeData.get("telephonenumber"));
        employee.setEmail(newEmployeeData.get("email"));

        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
        java.util.Date utilDate = format.parse(newEmployeeData.get("birthdate"));
        java.sql.Date sqlDate = new java.sql.Date(utilDate.getTime());
        employee.setBirthdate(sqlDate);


        if(employee.getDepartment().getName().equals(newEmployeeData.get("department"))){
            employeeRepository.save(employee);
        }
        else {
            Department oldDepartment = departmentRepository.findDepartmentByName(employee.getDepartment().getName());
            oldDepartment.getEmployees().remove(employee);
            departmentRepository.save(oldDepartment);

            Department newDepartment = departmentRepository.findDepartmentByName(newEmployeeData.get("department"));
            newDepartment.addEmployee(employee);
            departmentRepository.save(newDepartment);

            employeeRepository.save(employee);
        }

    }

    @CrossOrigin
    @PostMapping("deleteEmployee")
    public void deleteEmployee(@RequestBody(required = false) HashMap<String,String> employeeData){
        Employee employee = employeeRepository.findById(Long.parseLong(employeeData.get("id"))).get();
        Department department = departmentRepository.findDepartmentByName(employee.getDepartment().getName());

        department.removeEmployee(employee);
        departmentRepository.save(department);

        employeeRepository.delete(employee);
    }

}
