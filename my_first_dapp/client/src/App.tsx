import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Network, Provider } from "aptos";

// type TransactionPayload = {
//   type: string;
//   function: string;
//   type_arguments: any[]; // Adjust this based on your actual data structure
//   arguments: any[];      // Adjust this based on your actual data structure
// };

export const provider = new Provider(Network.DEVNET);
// change this to be your module account address
export const moduleAddress = "0x2834ba14a635f0ea0010b7f771208ce5a7fada2a184bea4e72cc14d494afc3fc";

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [counter, setCounter] = useState<number>(0);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  
  //Runs one Time
  useEffect(() => {
    fetch();
  }, [account?.address]);

  const timer = () => { setInterval(() => { fetch() }, 5000); }
  
  //Runs every 5 second
  useEffect(() => {
    timer();
  }, [account?.address]);

  const fetch = async () => {
    if (!account) return;
    try {
      const todoListResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::mycounter::CountHolder`,
      );
      let data = JSON.parse((todoListResource?.data as any).count);
      setCounter(data);
      console.log(data);
    }
    catch (e: any) {
      initialize();
    }
  }

  const initialize = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::mycounter::initialize`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      console.log(response);
      // setAccountHasList(true);
    } catch (error: any) {
      console.log(error);
      // setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // const fetchList = async () => {
  //   if (!account) return [];
  //   setTransactionInProgress(true);
  //   // build a transaction payload to be submited
  //   // const payload = {
  //   //   type: "entry_function_payload",
  //   //   function: `${moduleAddress}::mycounter::initialize`,
  //   //   type_arguments: [],
  //   //   arguments: [],
  //   // };
  //   // console.log(payload);
  //   // try {
  //   //   // sign and submit transaction to chain
  //   //   // const response = await signAndSubmitTransaction(payload);
  //   //   // wait for transaction
  //   //   // await provider.waitForTransaction(response.hash);
  //   //   // setAccountHasList(true);
  //   // } catch (error: any) {
  //   //   console.log(error);
  //   //   // setAccountHasList(false);
  //   // } finally {
  //   //   setTransactionInProgress(false);
  //   // }

  //   // const counterResource = await provider["aptosClient"].getAccountResources(moduleAddress);
  //   // const resource = counterResource.find((r) => r.type === `${moduleAddress}::counter::CountHolder`);
  //   // console.log(counterResource);
  //   // const data = parseInt((resource?.data as any).count);
  //   // console.log(data);
  //   // if (data > 0) {
  //   //   setCounter(data);
  //   // }
  //   // else {
  //   //   setCounter(0);
  //   // }
  // }
  // //   catch (e: any) {
  // //   setCounter(0);
  // // }

  const incrementCounter = async () => {
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::mycounter::increment`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      // setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <>
      <Layout>
        <Row align="middle" justify="space-between">
          <Col>
            <h1>Our Counter</h1>
          </Col>
          <Col style={{ textAlign: "right" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
        <Spin spinning={transactionInProgress}>
          <Row style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <Col>
              <Button
                disabled={!account}
                block
                onClick={incrementCounter}
                type="primary"
                style={{ margin: "0 auto", borderRadius: "50%", height: "200px", width: "200px", backgroundColor: "#3f67ff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
              >
                <PlusCircleFilled style={{ fontSize: "80px" }} />
                <p style={{ fontSize: "20px" }}>Click Me!</p>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <p style={{ fontSize: "80px" }}>Count: {counter}</p>
            </Col>
          </Row>
        </Spin >
      </div>

    </>
  );
}

export default App;
