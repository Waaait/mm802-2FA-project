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
import Web3 from 'web3';
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
  useEffect(() => {
    window.ethereum
      .request({
        method: 'eth_requestAccounts',
      })
      .then((accounts) => {
        getTransactions(accounts[0]);
      });
  });

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

        generateAndSignTransaction();
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const generateAndSignTransaction = async (contractAddress) => {
    const ethereum = window.ethereum;
    let web3 = new Web3(ethereum);
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    const walletAddress = accounts[0]; // first account in MetaMask

    const abi = [
      { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'approved',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'bool',
            name: 'approved',
            type: 'bool',
          },
        ],
        name: 'ApprovalForAll',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'previousOwner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'player', type: 'address' },
          { internalType: 'string', name: 'tokenURI', type: 'string' },
        ],
        name: 'awardItem',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'getApproved',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'operator', type: 'address' },
        ],
        name: 'isApprovedForAll',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'ownerOf',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'operator', type: 'address' },
          { internalType: 'bool', name: 'approved', type: 'bool' },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' },
        ],
        name: 'supportsInterface',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    var contract = new web3.eth.Contract(
      abi,
      contractAddress || '0xe010eB986E89d5aa36A8dfF89b9E6807827450fe',
      { gasPrice: '12345678', from: walletAddress }
    );

    // const estimatedGas = await contract.methods
    //   .transferFrom(
    //     walletAddress,
    //     '0x585B95073e8B51FcCC8FFa3415cD1a3B5618aB14',
    //     1
    //   )
    //   .estimateGas({ from: accounts[0], maxFeesPerGas: 13854680832 });
    // console.log(estimatedGas);

    // console.log(
    //   await contract.methods
    //     .transferFrom(
    //       walletAddress,
    //       '0x585B95073e8B51FcCC8FFa3415cD1a3B5618aB14',
    //       1
    //     )
    //     .estimateGas({
    //       from: accounts[0],
    //       maxFeePerGas: 100000000,
    //       gasPrice: 1000000000,
    //       gas: 100000000000,
    //     })
    // );

    console.log(accounts);

    contract.methods
      .transferFrom(
        walletAddress,
        '0x585B95073e8B51FcCC8FFa3415cD1a3B5618aB14',
        1
      )
      .send(
        { from: accounts[0], gasPrice: 1000000000, gas: 10000000 },
        function (error, txnHash) {
          if (error) throw error;
          console.log(txnHash);
        }
      );

    // // using the event emitter
    // contract.methods
    //   .transferFrom(
    //     walletAddress,
    //     '0x585B95073e8B51FcCC8FFa3415cD1a3B5618aB14',
    //     1
    //   )
    //   .send({ from: walletAddress })
    //   .on('transactionHash', function (hash) {
    //     console.log(hash);
    //   })
    //   .on('confirmation', function (confirmationNumber, receipt) {
    //     console.log('confirmationNumber', confirmationNumber);
    //   })
    //   .on('receipt', function (receipt) {
    //     // receipt example
    //     console.log(receipt);
    //   })
    //   .on('error', console.error); // If there's an out of gas error the second parameter is the receipt.
  };

  const getTransactions = async (userAddress) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      crossDomain: true,
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      'http://144.202.89.42:8080/api/v1/transactions?userAddress=' +
        userAddress,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  };

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
                            <Tr>
                              <Td>
                                <Avatar
                                  name={t.client.name}
                                  src={t.client.logo}
                                />
                              </Td>
                              <Td>{t.name}</Td>
                              <Td>{dayjs(t.date).fromNow()}</Td>
                              <Td>
                                {t.status === 'pending' && (
                                  <Badge colorScheme="purple">Pending</Badge>
                                )}
                                {t.status === 'completed' && (
                                  <Badge colorScheme="purple">Completed</Badge>
                                )}
                                {t.status === 'canceled' && (
                                  <Badge colorScheme="grey">Canceled</Badge>
                                )}
                              </Td>
                              <Td>
                                <IconButton
                                  colorScheme="green"
                                  aria-label="Approve Transaction"
                                  icon={<CheckIcon />}
                                />
                                <IconButton
                                  aria-label="Cancel Transaction"
                                  icon={<CloseIcon />}
                                  className="cancel-btn"
                                />
                              </Td>
                            </Tr>
                          );
                        })}

                      {/* <Tr>
                        <Td>
                          <Avatar
                            name="Android Demo"
                            src="https://media.licdn.com/dms/image/C560BAQH570LLby3QPg/company-logo_200_200/0/1644302187142?e=1685577600&v=beta&t=-SgK87HFGpICs_4N2PklXYXZspH6BiHFl5pg4olGFwE"
                          />
                        </Td>
                        <Td>Receive 3 gems</Td>
                        <Td>30 min ago</Td>
                        <Td>
                          <Badge colorScheme="purple">Pending</Badge>
                        </Td>
                        <Td>
                          <IconButton
                            colorScheme="green"
                            aria-label="Approve Transaction"
                            icon={<CheckIcon />}
                          />
                          <IconButton
                            aria-label="Cancel Transaction"
                            icon={<CloseIcon />}
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Avatar
                            name="iOS Demo"
                            src="https://media.idownloadblog.com/wp-content/uploads/2018/07/Apple-logo-black-and-white-768x895.png"
                          />
                        </Td>
                        <Td>Receive exclusive NFTs</Td>
                        <Td>1 day ago</Td>
                        <Td>
                          <Badge colorScheme="purple">Pending</Badge>
                        </Td>
                        <Td>
                          <IconButton
                            colorScheme="green"
                            aria-label="Approve Transaction"
                            icon={<CheckIcon />}
                          />
                          <IconButton
                            aria-label="Cancel Transaction"
                            icon={<CloseIcon />}
                          />
                        </Td>
                      </Tr> */}
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
