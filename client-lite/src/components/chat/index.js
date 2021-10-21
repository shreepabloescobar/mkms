import Navbar from "components/navbar";
import Navigation from "components/chat/navigation/navigation";

const Chat = (props) => {
  console.log("Chat", props);
  return (
    <>
      <Navbar />
      <Navigation rocketWebSocket={props.rocketWebSocket} />
    </>
  );
};

export default Chat;
