package com.example.games;

import com.mm802.blockchain.Ethereum;
import org.bson.BSONObject;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Timer;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction createTransaction( String clientId, String userAddress, String to, String contractAddress, String metaData) {
        Transaction transaction = new Transaction(new ObjectId(),clientId, TransactionStatus.CREATED, new Date(), userAddress, to, contractAddress, metaData,null);
        return transactionRepository.insert(transaction);
    }

    public List<Transaction> getAllTransactions(String userAddress) {
        return transactionRepository.findAll();
    }

    public Transaction updateTransaction(String transactionId, String status, String txHash){
        Optional<Transaction> txOptional = transactionRepository.findById(new ObjectId(transactionId));
        if(!txOptional.isPresent()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Invalid transaction id",new Exception());
        Transaction tx =txOptional.get();
        tx.status = TransactionStatus.valueOf(status);
        tx.txHash = txHash;
        transactionRepository.save(tx);

        // And From your main() method or any other method
        Timer timer = new Timer();
        timer.schedule(new TransactionTimer(txHash),3000,3000);

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
