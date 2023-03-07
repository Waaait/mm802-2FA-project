package com.example.games;

import com.fasterxml.jackson.databind.util.JSONPObject;
import lombok.Getter;


public class CreateTransactionRequest {

    @Getter
    private String clientId;
    @Getter
    private String metaData;
    @Getter
    private String userAddress;
    @Getter
    private String to;
    @Getter
    private String contractAddress;
}
