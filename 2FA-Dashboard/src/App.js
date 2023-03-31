import './App.css';
import {
  Avatar,
  Badge,
  Container,
  Heading,
  IconButton,
  Select,
  Tab,
  Table,
  TableCaption,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { ConnectWalletButton } from './ConnectWalletButtton';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
const ethers = require("ethers")

var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

function App() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const [transactions, setTransactions] = useState([
    {
      name: 'Receive 3 gems',
      client: {
        logo: 'https://media.licdn.com/dms/image/C560BAQH570LLby3QPg/company-logo_200_200/0/1644302187142?e=1685577600&v=beta&t=-SgK87HFGpICs_4N2PklXYXZspH6BiHFl5pg4olGFwE',
        name: 'Matrix Worlds',
      },
      date: dayjs().subtract(1, 'hour').toDate(),
      status: 'pending',
      metaData: {},
    },
  ]);


  const updateTransaction = async (transactionId, status, txHash) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://localhost:8080/api/v1/transactions/${transactionId}?txHash=${txHash}&status=${status}`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  const getTransactions = async (userAddress) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://localhost:8080/api/v1/transactions?userAddress=${userAddress}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        const prepared = result.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        setTransactions(prepared.map((f) => {
          return {
            name:f.name,
            client: {
              logo: 'https://media.licdn.com/dms/image/C560BAQH570LLby3QPg/company-logo_200_200/0/1644302187142?e=1685577600&v=beta&t=-SgK87HFGpICs_4N2PklXYXZspH6BiHFl5pg4olGFwE',
              name: 'Matrix Worlds',
            },
            id: f.id,
            key: f.id,
            date: dayjs(f.createdOn).toDate(), status: f.status, contractAddress: f.contractAddress,
            metaData: f.metaData,
            abi: f.abi,
            userAddress: f.userAddress,
            to: f.to,
          }
        }))
      })
      .catch(error => console.log('error', error));
  }
  useEffect(() => {
    window.ethereum
      .request({
        method: 'eth_requestAccounts',
      })
      .then((accounts) => {
        getTransactions(accounts[0]);
      });
  }, []);

  const onPressConnect = async () => {
    setLoading(true);

    try {
      if (window?.ethereum?.isMetaMask) {
        // Desktop browser
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        // const account = Web3.utils.toChecksumAddress(accounts[0]);
        setAddress(accounts[0]);

        // generateAndSignTransaction();
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const generateAndSignTransaction = async (tx) => {
    return new Promise(async (resolve, reject) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const walletAddress = tx.userAddress // first account in MetaMask

      console.log(tx)
      // var contract = new web3.eth.Contract(
      //   JSON.parse(tx.abi),
      //   tx.contractAddress,
      //   { gasPrice: '12345678', from: walletAddress }
      // );

      const signer = provider.getSigner();
      // This code tells ethers.js how to interact with your NFT contract
      const nftContractReadonly = new ethers.Contract(tx.contractAddress, JSON.parse(tx.abi), provider);
      // Connecting with a signer allows you to use all the methods of the contract
      const nftContract = nftContractReadonly.connect(signer);

      // Transfer
      try{
        const txRes = await nftContract.transferFrom(walletAddress, tx.to, 1000000000000000);
        console.log(txRes)
        resolve({ hash: txRes.hash })
      }catch(e){
        reject(e);
      }
    });
    //       contract.methods
    //         .transferFrom(
    //           walletAddress,
    //           tx.to,
    //           1
    //         )
    //         .send(
    //           { from: walletAddress, gasPrice: 1000000000, gas: 10000000 },
    //           function (error, txnHash) {
    //             if (error) { reject(error) };
    //             console.log(txnHash);
    //             resolve(txnHash)
    //           }
    //         );
    //     })
  };

  const handleApproveTransaction = async (tx) => {
    try {
      const txRes = await generateAndSignTransaction(tx); // TODO - Update the parameters
      await updateTransaction(tx.id, 'SUCCESSFUL', txRes.hash)
      setTransactions(transactions.map((t) => {
        if (t.id === tx.id) t.status = 'SUCCESSFUL'
        return t;
      }));
    } catch (e) {
      console.log("Error signing transaction.", e);
    }
  }

  const handleRejectTransaction = async (id) => {
    // console.log("Rejecting")
    try {
      // update local state
      await updateTransaction(id, "REJECTED", '');
      setTransactions(JSON.parse(JSON.stringify(transactions.map((t) => {
        if (t.id === id) t.status = 'REJECTED'
        return t;
      }))));
    } catch (e) {
      console.log("Error rejecting transaction", e)
    }
  }


  const onPressLogout = () => setAddress('');
  return (
    <div className="App">
      <div className="navbar">
        <Heading as="h4" size="md" className="logo-container">
          <img src="favicon-32x32.png" />
          <span className="logo-text">ChainTrack</span>
        </Heading>
        {address ? (
          <p className="logo-text">Hello, {address}</p>
        ) : (
          <p className="logo-text"> Web3 Transactions Dashboard</p>
        )}
        <ConnectWalletButton
          onPressConnect={onPressConnect}
          onPressLogout={onPressLogout}
          loading={loading}
          address={address}
        />
      </div>
      <Container maxW="4xl" className="body-container">
        {address ? (
          <Tabs
            variant="soft-rounded"
            colorScheme="purple"
            className="tab-container"
          >
            <div className="sub-menu">
              <TabList>
                <Tab className="tab-btn">Pending</Tab>
                <Tab className="tab-btn">All</Tab>
              </TabList>
              <div className="app-selector">
                <Select placeholder="Select App">
                  <option value="matrix-worlds">Matrix Worlds</option>
                  <option value="android-demo">Android Demo</option>
                  <option value="android-demo-2">iOS Demo</option>
                </Select>
              </div>
            </div>

            <TabPanels>
              <TabPanel>
                <TableContainer>
                  <Table variant="simple">
                    <TableCaption>Showing All Transactions</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>App</Th>
                        <Th>Transaction</Th>
                        <Th>Date</Th>
                        <Th>Status</Th>
                        <Th>action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {transactions &&
                        transactions.map((t) => {
                          return (
                            <Tr key={t.key}>
                              <Td>
                                <Avatar
                                  name={t.client.name}
                                  src={t.client.logo}
                                />
                              </Td>
                              <Td>{t.name}</Td>
                              <Td>{dayjs(t.date).fromNow()}</Td>
                              <Td>
                                {t.status === 'CREATED' && (
                                  <Badge colorScheme="purple">CREATED</Badge>
                                )}
                                {t.status === 'SUCCESSFUL' && (
                                  <Badge colorScheme="purple">SUCCESSFUL</Badge>
                                )}
                                {t.status === 'REJECTED' && (
                                  <Badge colorScheme="grey">REJECTED</Badge>
                                )}
                              </Td>
                              <Td>
                                {t.status === 'CREATED' && (
                                  <>
                                    <IconButton
                                      colorScheme="green"
                                      aria-label="Approve Transaction"
                                      icon={<CheckIcon />}
                                      onClick={() => handleApproveTransaction(t)}
                                    />
                                    <IconButton
                                      aria-label="Cancel Transaction"
                                      icon={<CloseIcon />}
                                      className="cancel-btn"
                                      onClick={() => handleRejectTransaction(t.id)}
                                    />
                                  </>
                                )}

                              </Td>
                            </Tr>
                          );
                        })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          'Please connect your wallet 😊'
        )}
      </Container>
    </div>
  );
}

export default App;
