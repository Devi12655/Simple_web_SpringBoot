package com.devi.project.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.devi.project.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.*;
import com.devi.project.model.Product;
@CrossOrigin
@RestController
@RequestMapping("/api")
public class ProductController {
    @Autowired
    private ProductService service;

    @RequestMapping("/")
    public String getProducts() {
        return "List of products";
    }
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        // Logic to retrieve all products from the database
        return new ResponseEntity<>(service.getAllProducts(),HttpStatus.OK);//responseentity
    }
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
    Product p= service.getProduct(id);
    if(p!=null){
        return new ResponseEntity<>(p,HttpStatus.OK);
    }
    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    
}
@PostMapping("/product")
public ResponseEntity<?> addProduct(@RequestPart Product product,@RequestPart MultipartFile image){
    try{
    Product p=service.addProduct(product,image);

    return new ResponseEntity<>(p,HttpStatus.CREATED);
}
catch(Exception e){
    return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
}
}
@GetMapping("/product/{id}/image")
public ResponseEntity<byte[]> getImageByProductId(@PathVariable int id) {

    Product p = service.getProduct(id);

    if (p == null || p.getImageData() == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    String type = p.getImageType();

    // 🔥 Fix: handle null MIME type
    if (type == null || type.isEmpty()) {
        type = "image/jpeg"; // default fallback
    }

    return ResponseEntity.ok()
            .contentType(MediaType.valueOf(type))
            .body(p.getImageData());
}
@PutMapping("/product/{id}")
public ResponseEntity<String> updateProduct(@PathVariable int id,@RequestPart Product product,@RequestPart(required = false) MultipartFile image){
    Product existingProduct = null;
    try{
    existingProduct = service.updateProduct(id,product,image);
    }
    catch(Exception e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (existingProduct == null) {
        return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
    }
    // Logic to update the product
    return new ResponseEntity<>("Product updated successfully", HttpStatus.OK);
}
@DeleteMapping("/product/{id}")
public ResponseEntity<String> deleteProduct(@PathVariable int id) {
    Product p= service.getProduct(id);
    if(p==null){
        return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
    }
    // Logic to delete the product
    service.deleteProduct(id);
    return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
}
@GetMapping("/products/search")
public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
    System.out.println("Searching for products with keyword: " + keyword); // Debug log which will show the keyword being searched
    List<Product> products = service.searchProducts(keyword);
    return new ResponseEntity<>(products, HttpStatus.OK);
}
}

