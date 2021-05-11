package ru.vados.energozapas.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.vados.energozapas.model.Department;
import ru.vados.energozapas.repository.DepartmentRepository;

import java.util.HashMap;

@RestController
public class DepartmentController {

    @Autowired
    DepartmentRepository departmentRepository;

    ObjectMapper objectMapper = new ObjectMapper();


    @CrossOrigin
    @PostMapping("/addDepartment")
    public String addDepartment(@RequestBody(required = false) HashMap<String,String> newDepartmentData){
        Department department = new Department();
        department.setName(newDepartmentData.get("name"));

        departmentRepository.save(department);

        return null;
    }

    @CrossOrigin
    @PostMapping("/getAllDepartmens")
    public String getAllDepartmens() throws JsonProcessingException {
        return objectMapper.writeValueAsString(departmentRepository.getAllByName());
    }

}
