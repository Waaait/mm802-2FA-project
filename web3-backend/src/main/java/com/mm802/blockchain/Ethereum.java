package com.mm802.blockchain;
//import com.example.games;
import org.springframework.transaction.TransactionStatus;
import org.web3j.crypto.RawTransaction;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.*;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Convert;
//import org.apache.commons.lang3.StringUtils;
import java.math.BigInteger;
import java.util.Optional;

public class Ethereum {

    private static Ethereum single_instance = null;
    private Web3j web3;

    public Ethereum() {
        try {
            this.web3 = Web3j.build(new HttpService("https://goerli.infura.io/v3/a4c06ab72bfb4a788d9a9317e2380c49"));
            EthBlockNumber result = web3.ethBlockNumber().sendAsync().get();
            System.out.println(" The Block Number is: " + result.getBlockNumber().toString());
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    // Static method
    // Static method to create instance of Singleton class
    public static Ethereum getInstance() {
        if (single_instance == null)
            single_instance = new Ethereum();

        return single_instance;
    }

    public RawTransaction createRawTransaction() throws Exception{
//        RawTransaction rawTransaction= RawTransaction.createEtherTransaction('', '', '', '', '');
        try {

            EthGetTransactionCount ethGetTransactionCount = web3.ethGetTransactionCount(
                    "0xCEc07BA02DCcFF5Bd8592AE42119b1A880eF439E", DefaultBlockParameterName.LATEST).sendAsync().get();

            BigInteger nonce = ethGetTransactionCount.getTransactionCount();

            // Recipient address
            String recipientAddress = "0x00029759591F96dB239b27B15EA7e37C58C42356";
            // Value to transfer (in wei)
            System.out.println("Enter Amount to be sent:");
            String amountToBeSent = "000000000100";
            BigInteger value = Convert.toWei(amountToBeSent, Convert.Unit.ETHER).toBigInteger();

            // Gas Parameter
            BigInteger gasLimit = BigInteger.valueOf(21000);
            BigInteger gasPrice = Convert.toWei("1", Convert.Unit.GWEI).toBigInteger();

            // Prepare the rawTransaction
            RawTransaction rawTransaction = RawTransaction.createEtherTransaction(nonce, gasPrice, gasLimit,
                    recipientAddress, value);
            System.out.println("Hashcode: " + rawTransaction.toString());
//            rawTransaction.toString()
            return rawTransaction;
        } catch (Exception e) {
            System.out.println(e);
            throw e;
        }
//            return rawTransaction;
        // Generate Raw Transaction
    }

//    public String getTransactionStatus(String txHash) {
//        try {
//            EthGetTransactionReceipt resp = this.web3.ethGetTransactionReceipt(txHash).send();
//            if(resp.getTransactionReceipt().isPresent()) {
//                TransactionReceipt receipt = resp.getTransactionReceipt().get();
//                String status = StringUtils.equals(receipt.getStatus(), "0x1") ?
//                        TransactionStatus.SUCCESSFUL:  TransactionStatus.PENDING;
//                return status;
//            }
//        }catch (Exception e){
//            System.out.println("txStatusFail "+e.getMessage()+e);
//        }
//        return "";
//    }
}
