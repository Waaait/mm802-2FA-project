package com.example.games;

import com.mm802.blockchain.Ethereum;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class TransactionApplication {

    public static void main(String[] args) {

        Ethereum ethereumClient = Ethereum.getInstance();
        SpringApplication.run(TransactionApplication.class, args);
    }

    @GetMapping("/root")
    public String apiRoot() {
        return "Hello world!";
    }
}