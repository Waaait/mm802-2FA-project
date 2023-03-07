package com.example.games;

import java.util.Timer;
import java.util.TimerTask;

public class TransactionTimer extends TimerTask {
    public String txHash;
    public TransactionStatus status;

    public  TransactionTimer (String txHash) {
        this.txHash = txHash;
    }

    public void run() {
        System.out.println("Running");
    }
}
