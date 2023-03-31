package com.example.games;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;
//    @GetMapping
//    public ResponseEntity<List<Transaction>> getAllTransactions(){
//        return new ResponseEntity<List<Transaction>>(playerService.allPlayers(), HttpStatus.OK);
//    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody CreateTransactionRequest reqBody) {
        return new ResponseEntity<Transaction>(transactionService.createTransaction(reqBody.getClientId(), reqBody.getUserAddress(),  reqBody.getTo(), reqBody.getContractAddress(), reqBody.getMetaData(), reqBody.getWebhookUrl(), reqBody.getAbi(), reqBody.getName()), HttpStatus.CREATED);
    }


    @GetMapping
    @CrossOrigin(origins = "*",methods = {RequestMethod.GET})
    public ResponseEntity<List<Transaction>> getAllTransactions(@RequestParam String userAddress) {
        return new ResponseEntity<List<Transaction>>(transactionService.getAllTransactions(userAddress), HttpStatus.OK);
    }

    @PutMapping("/{transactionId}")
    @CrossOrigin(origins = "*",methods = {RequestMethod.PUT})
    public ResponseEntity<Transaction> updateTransaction(@PathVariable String transactionId, @RequestParam String status, @RequestParam String txHash) {
        return new ResponseEntity<Transaction>(transactionService.updateTransaction(transactionId, status, txHash), HttpStatus.OK);
    }


//    @GetMapping("/{id}")
//    public ResponseEntity<Optional<Game>> getSinglePlayer(@PathVariable ObjectId id){
//        return new ResponseEntity<Optional<Game>>(playerService.singlePlayer(id), HttpStatus.OK);
//    }
}
