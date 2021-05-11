package ru.vados.energozapas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.vados.energozapas.model.Employee;

import java.sql.Date;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findById(Long id);

    Boolean existsEmployeeByNameAndLastnameAndMiddlenameAndBirthdate(String name,String lastName,String middleName,Date birthdate);

}
