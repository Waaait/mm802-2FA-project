package com.example.games;

import okhttp3.Request;
import okhttp3.*;
import org.bson.BSONObject;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction createTransaction( String clientId, String userAddress, String to, String contractAddress, String metaData, String webhookUrl, String abi, String name) {
        Transaction transaction = new Transaction(new ObjectId(),clientId, TransactionStatus.CREATED, new Date(), userAddress, to, contractAddress, metaData,null, webhookUrl, abi, name);
        return transactionRepository.insert(transaction);
    }

    public List<Transaction> getAllTransactions(String userAddress) {
        return transactionRepository.findAll();
    }

    public Transaction updateTransaction(String transactionId, String status, String txHash) {
        Optional<Transaction> txOptional = transactionRepository.findById(new ObjectId(transactionId));
        if(!txOptional.isPresent()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Invalid transaction id",new Exception());
        Transaction tx = txOptional.get();
        tx.status = TransactionStatus.valueOf(status);
        tx.txHash = txHash;
        transactionRepository.save(tx);
        try {

            OkHttpClient client = new OkHttpClient.Builder()
                    .build();

            String json = String.format("{\"id\":\"%s\",\"status\":\"%s\",\"txHash\":\"%s\"}", tx.id, tx.status,tx.txHash);
            System.out.println(json);
            System.out.println(tx.webhookUrl);
            RequestBody body = RequestBody.create(
                    MediaType.parse("application/json"), json);

            Request request = new Request.Builder()
                    .url(tx.webhookUrl)
                    .method("POST", body)
                    .addHeader("Content-Type", "application/json")
                    .build();


            Call call = client.newCall(request);
            Response response = call.execute();

        } catch (Exception e) {
            System.out.println(e);
        }
        return tx;
    }
//    public List<Game> allPlayers(){
//        return playerRepository.findAll();
//    }
//
//    public Optional<Game> singlePlayer(ObjectId id){
//        return playerRepository.findById(id);
//    }
}
