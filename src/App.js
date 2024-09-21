import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import './App.css';

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const TwoColumnLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  max-width: 1200px;
`;

const LeftSection = styled.div`
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const RightSection = styled.div`
  flex: 0 0 65%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 600px; // Set a fixed height
`;

const AgentLogo = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 24px;
  margin-bottom: 20px;
`;

const FeatureList = styled.ul`
  color: #ffffff;
  font-size: 18px;
  list-style-type: none;
  padding: 0;
  margin-bottom: 30px;
`;

const FeatureItem = styled.li`
  margin-bottom: 10px;
`;

const ConnectButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1873cc;
  }
`;

const WalletInfo = styled.div`
  color: #ffffff;
  font-size: 16px;
  margin-top: 20px;
`;

const ChatBox = styled.div`
  width: 90%;
  height: 400px; // Reduce the height
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  overflow-y: auto;
  color: white;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px; // Add some space between ChatBox and InputArea
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.sender === 'user' ? 'row-reverse' : 'row'};
  align-items: flex-start;
  margin-bottom: 10px;
`;

const Message = styled.div`
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 20px;
  background-color: ${props => props.sender === 'user' ? 'rgba(30, 144, 255, 0.6)' : 'rgba(255, 105, 180, 0.6)'};
  color: white;
  text-align: left;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    ${props => props.sender === 'user' ? 'right: -7px;' : 'left: -7px;'}
    width: 14px;
    height: 14px;
    background-color: ${props => props.sender === 'user' ? 'rgba(30, 144, 255, 0.6)' : 'rgba(255, 105, 180, 0.6)'};
    border-radius: 50%;
  }
`;

const AgentAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const InputArea = styled.div`
  display: flex;
  margin-top: 10px;
  width: 90%; // Match the width of ChatBox
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const OptionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
`;

const RoundLogoButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const LogoImage = styled.img`
  width: 30px;
  height: 30px;
`;

const WalletPopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const PopupButton = styled.button`
  margin: 10px;
  padding: 5px 10px;
  cursor: pointer;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  animation: ${fadeIn} 1s ease-in;
`;

const TypewriterEffect = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
`;

const SwapPopup = styled(WalletPopup)`
  // You can add any additional styles specific to the swap popup here
`;

const LoadingDots = styled.span`
  &::after {
    content: '...';
    animation: dots 1.5s steps(5, end) infinite;
  }

  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }
`;

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSwapPopup, setShowSwapPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const connectWallet = () => {
    setShowPopup(true);
  };

  const handleConnectConfirm = () => {
    const fakeAccount = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const fakeBalance = (Math.random() * 10).toFixed(4);

    setAccount(fakeAccount);
    setBalance(fakeBalance);
    setShowPopup(false);

    const initialMessage = "Hello Jade 👋, I'm your personal Web3 AI agent. How can I assist you today? You can transfer tokens, swap tokens, check your wallet balance, and more. Let's get started! 🚀";
    setIsTyping(true);
    typeWriter(initialMessage);
  };

  const typeWriter = (text, index = 0) => {
    if (index < text.length) {
      setTypingText((prev) => prev + text.charAt(index));
      setTimeout(() => typeWriter(text, index + 1), 50); // Slowed down to 50ms
    } else {
      setIsTyping(false);
      setMessages([{ text: text, sender: 'agent' }]);
      setTypingText('');
    }
  };

  const handleConnectCancel = () => {
    setShowPopup(false);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setMessages(prevMessages => [...prevMessages, { 
          text: "All right, let's swap $USDT to $ETH. Which aggregator would you like to use?", 
          sender: 'agent' 
        }]);
        setShowOptions(true);
      }, 2000); // 2 seconds loading time
    }
  };

  const handleOptionClick = (option) => {
    setShowOptions(false);
    setMessages(prevMessages => [...prevMessages, { 
      text: `You've chosen ${option}. Please sign to validate the transaction.`, 
      sender: 'agent' 
    }]);
    setTimeout(() => {
      setShowSwapPopup(true);
    }, 1000); // 1 second delay before showing the popup
  };

  const handleSwapConfirm = () => {
    setShowSwapPopup(false);
    setMessages(prevMessages => [...prevMessages, { 
      text: "The swap was successful!", 
      sender: 'agent' 
    }]);
  };

  const handleSwapCancel = () => {
    setShowSwapPopup(false);
    setMessages(prevMessages => [...prevMessages, { 
      text: "The swap was cancelled.", 
      sender: 'agent' 
    }]);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, typingText]);

  return (
    <AppWrapper>
      {!account ? (
        <CenteredContent>
          <AgentLogo src="/images/__avatar_url.png" alt="AI Agent Logo" />
          <Title>Your Personal Web3 AI Agent</Title>
          <FeatureList>
            <FeatureItem>☝️ Chat with your Agent</FeatureItem>
            <FeatureItem>✌️ The Agent takes care of your on-chain Actions</FeatureItem>
            <FeatureItem>👌 Sign and Validate in One Click</FeatureItem>
          </FeatureList>
          <ConnectButton onClick={connectWallet}>Connect Wallet</ConnectButton>
        </CenteredContent>
      ) : (
        <TwoColumnLayout>
          <LeftSection>
            <AgentLogo src="/images/__avatar_url.png" alt="AI Agent Logo" />
            <Title>Your Personal Web3 AI Agent</Title>
            <FeatureList>
              <FeatureItem>☝️ Chat with your Agent</FeatureItem>
              <FeatureItem>✌️ The Agent takes care of your on-chain Actions</FeatureItem>
              <FeatureItem>👌 Sign and Validate in One Click</FeatureItem>
            </FeatureList>
            <WalletInfo>
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
              <br />
              Balance: {balance} ETH
            </WalletInfo>
          </LeftSection>
          <RightSection>
            <ChatBox ref={chatBoxRef}>
              {messages.map((msg, index) => (
                <MessageContainer key={index} sender={msg.sender}>
                  {msg.sender === 'agent' && (
                    <AgentAvatar src="/images/__avatar_url.png" alt="AI Agent" />
                  )}
                  <Message sender={msg.sender}>{msg.text}</Message>
                </MessageContainer>
              ))}
              {isLoading && (
                <MessageContainer sender="agent">
                  <AgentAvatar src="/images/__avatar_url.png" alt="AI Agent" />
                  <Message sender="agent">
                    <LoadingDots />
                  </Message>
                </MessageContainer>
              )}
              {isTyping && (
                <MessageContainer sender="agent">
                  <AgentAvatar src="/images/__avatar_url.png" alt="AI Agent" />
                  <Message sender="agent">
                    <TypewriterEffect>{typingText}</TypewriterEffect>
                  </Message>
                </MessageContainer>
              )}
              {showOptions && (
                <OptionButtonsContainer>
                  <RoundLogoButton onClick={() => handleOptionClick("1inch")}>
                    <LogoImage src="/images/1inch-logo.png" alt="1inch" />
                  </RoundLogoButton>
                  <RoundLogoButton onClick={() => handleOptionClick("Uniswap")}>
                    <LogoImage src="/images/uniswap-uni-logo.png" alt="Uniswap" />
                  </RoundLogoButton>
                </OptionButtonsContainer>
              )}
            </ChatBox>
            <InputArea>
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
              />
              <SendButton onClick={handleSendMessage}>Send</SendButton>
            </InputArea>
          </RightSection>
        </TwoColumnLayout>
      )}
      {showPopup && (
        <WalletPopup>
          <h2>Connect Wallet</h2>
          <p>Do you want to connect your wallet?</p>
          <PopupButton onClick={handleConnectConfirm}>Connect</PopupButton>
          <PopupButton onClick={handleConnectCancel}>Cancel</PopupButton>
        </WalletPopup>
      )}
      {showSwapPopup && (
        <SwapPopup>
          <h2>Confirm Swap</h2>
          <p>Swap 200 USDT to 0.06549710667 ETH</p>
          <PopupButton onClick={handleSwapConfirm}>Confirm</PopupButton>
          <PopupButton onClick={handleSwapCancel}>Reject</PopupButton>
        </SwapPopup>
      )}
    </AppWrapper>
  );
}

export default App;
