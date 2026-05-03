package com.devi.project.model;

import java.math.BigDecimal;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//auto genaration
    private int id;
    private String name;
    private String description;
    private String brand;
    private BigDecimal price;
    private String category;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd")//to convert date to string in json format
    private Date releaseDate;
    private int quantity;

    private String imageType;//to store image type (e.g., "image/jpeg")
    private String imageName;//to store image name
    @Lob//to store large object (image data)
    private byte[] imageData;//to store image data as byte array

}
