package com.example.games;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.BSONObject;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "transactions")
public class Transaction {
    @Id
    @JsonSerialize(using= ToStringSerializer.class)
    public ObjectId id;
    public String clientId;
    public TransactionStatus status;
    public Date createdOn;
    public String userAddress;

    public String to;
    public String contractAddress;
    public String metaData;
    public String txHash;
    public String webhookUrl;
    public String abi;

    public String name;

//    private BSONObject metaDta;

}
