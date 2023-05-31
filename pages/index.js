import React, { useState } from "react"
import {
  Button,
  Col,
  Container,
  Grid,
  Input,
  Modal,
  Paper,
  Text,
} from "@mantine/core"
import {
  ConnectWallet,
  NATIVE_TOKEN_ADDRESS,
  useAddress,
  useBalance,
  useSDK,
} from "@thirdweb-dev/react"
import { IconCheck, IconX } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"

function WalletIntegration() {
  const contract_test = "0x0f489Dda333682909e60c27582901ad7A284cEed"
  const contract = "0xc748673057861a797275cd8a068abb95a902e8de"

  const [recipientAddress, setRecipientAddress] = useState("")
  const [amountToSend, setAmountToSend] = useState(0)
  const [modalShow, setModalShow] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)

  const address = useAddress()
  const { data: bnbBalance, refetch } = useBalance(NATIVE_TOKEN_ADDRESS)
  const { data: babyDogeBalance } = useBalance(contract)
  const sdk = useSDK()
  // Function to send BNB to another address
  const sendBNB = async () => {
    setBtnLoading(true)
    setModalShow(false)
    try {
      let result = await sdk.wallet.transfer(recipientAddress, amountToSend)
      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: "Success",
        message: "The transaction was successful",
        color: "teal",
        icon: <IconCheck />,
        loading: false,
      })
      console.log(result)
      await refetch()
    } catch (e) {
      let message = e?.reason || e?.data?.message
      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: "Something went wrong",
        message: message,
        color: "red",
        icon: <IconX />,
        loading: false,
      })
      window.abbas = e
    } finally {
      setBtnLoading(false)
    }
    // It should also handle the transaction confirmation and balance update
  }

  return (
    <Container size="xs" mt={16}>
      <Grid gutter="lg" justify="center">
        <ConnectWallet />
        <Col span={12}>
          <Paper
            p="16px"
            padding="lg"
            shadow="lg"
            radius="lg"
            style={{
              background: "linear-gradient(135deg, #222222 0%, #333333 100%)",
              color: "#FFFFFF",
            }}
          >
            <Text align="center" size="xl" style={{ marginBottom: "1.5rem" }}>
              Sample Project for <strong>Direlli</strong>
            </Text>

            <Text align="center" style={{ marginBottom: "1rem" }}>
              Connected Wallet: {address}
            </Text>
            <Text align="center" style={{ marginBottom: "1rem" }}>
              Account Balance:
            </Text>
            <Text align="center" style={{ marginBottom: "1rem" }}>
              <strong>BNB:</strong> {bnbBalance?.displayValue}
            </Text>
            <Text align="center" style={{ marginBottom: "1.5rem" }}>
              <strong>BabyDoge:</strong> {babyDogeBalance?.displayValue}
            </Text>

            <div style={{ marginBottom: "2.5rem" }}>
              <Input
                value={recipientAddress}
                onChange={(event) => setRecipientAddress(event.target.value)}
                placeholder="Recipient's Address"
                style={{ marginBottom: "0.75rem" }}
              />
              <Input
                value={amountToSend}
                onChange={(event) => setAmountToSend(event.target.value)}
                type="number"
                placeholder="Amount to Send"
                style={{ marginBottom: "0.75rem" }}
              />
              <Button
                onClick={() => setModalShow(true)}
                fullWidth
                style={{ background: "#bd7070", color: "#ffffff" }}
                loading={btnLoading}
              >
                Send BNB
              </Button>
            </div>

            <Modal
              opened={modalShow}
              onClose={() => setModalShow(false)}
              title="Confirm Transaction"
              size="sm"
              hideCloseButton
              padding="md"
              style={{ background: "#FFFFFF", color: "#667EEA" }}
            >
              <Text align="center" style={{ marginBottom: "1rem" }}>
                Please confirm the transaction details:
              </Text>
              <Text align="center" style={{ marginBottom: "1rem" }}>
                <strong>Recipient:</strong> {recipientAddress}
              </Text>
              <Text align="center" style={{ marginBottom: "1rem" }}>
                <strong>Amount:</strong> {amountToSend} BNB
              </Text>
              <Button
                onClick={sendBNB}
                fullWidth
                style={{ background: "#bd7070", color: "#ffffff" }}
                loading={btnLoading}
              >
                Confirm
              </Button>
            </Modal>
          </Paper>
        </Col>
      </Grid>
    </Container>
  )
}

export default WalletIntegration
