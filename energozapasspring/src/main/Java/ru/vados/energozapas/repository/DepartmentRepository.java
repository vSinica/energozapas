package ru.vados.energozapas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.vados.energozapas.model.Department;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department,Long> {

    Boolean existsDepartmentByName(String name);

    Department findDepartmentByName(String name);

    @Query("select name from Department")
    List<String> getAllByName();
}
