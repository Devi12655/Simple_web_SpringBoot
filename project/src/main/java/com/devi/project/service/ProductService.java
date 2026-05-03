package com.devi.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.devi.project.repository.ProductRepo;

import java.io.IOException;
import java.util.*;
import com.devi.project.model.Product;

@Service
public class ProductService {
    @Autowired
    private ProductRepo repo;
    public List<Product> getAllProducts() {
        // Logic to retrieve all products from the database
        return repo.findAll(); // Placeholder for actual product list
    }
   public Product getProduct(int id){
    return repo.findById(id).orElse(null);
}
public Product addProduct(Product product,MultipartFile image) throws IOException{
    product.setImageType(image.getContentType());
    product.setImageName(image.getOriginalFilename());
    product.setImageData(image.getBytes());
    return repo.save(product);
    
}
// public Product updateProduct(int id,Product product,MultipartFile image) throws IOException{
//     product.setImageData(image.getBytes());
//     product.setImageType(image.getContentType());
//     product.setImageName(image.getOriginalFilename());
//     return repo.save(product);
// }
public Product updateProduct(int id, Product product, MultipartFile image) throws IOException {

    Product existing = repo.findById(id).orElse(null);

    if (existing == null) return null;

    // ✅ update normal fields
    existing.setName(product.getName());
    existing.setBrand(product.getBrand());
    existing.setCategory(product.getCategory());
    existing.setPrice(product.getPrice());
    existing.setQuantity(product.getQuantity());
    existing.setDescription(product.getDescription());
    existing.setReleaseDate(product.getReleaseDate());

    // 🔥 ONLY update image if new one is provided
    if (image != null && !image.isEmpty()) {
        existing.setImageData(image.getBytes());
        existing.setImageType(image.getContentType());
        existing.setImageName(image.getOriginalFilename());
    }

    return repo.save(existing);
}
public void deleteProduct(int id){
    repo.deleteById(id);
}
public List<Product> searchProducts(String keyword){
    return repo.searchProducts(keyword);
}
}
