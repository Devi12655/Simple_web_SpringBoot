package com.devi.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.devi.project.model.Product;
@Repository
public interface ProductRepo extends JpaRepository<Product,Integer> {// //Entity class ,primary key
    //JPQL for writing query sql like pattern search
     @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")//converting every text into lower case and then comparing
     List<Product> searchProducts(String keyword);//The LOWER() function converts both the database values and the search keyword into lowercase, ensuring case-insensitive comparison
    
}
