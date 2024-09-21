import Api from '../reducers/api';
export function ChatBar(props: any) {
  const chainId = props.chainId;
  const api = new Api();
  const handleSendButton = () => {
      api.talk("Hello, world!");
  }
  return <>
    <input type="text" placeholder="Type a message..." />;
    <button onClick={handleSendButton}>Send</button>
  </>
}