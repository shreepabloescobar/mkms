import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Navbar from "./Navbar";
import GroupIcon from "@material-ui/icons/Group";
import FaceIcon from "@material-ui/icons/Face";
//
import { ChatMessages } from "./ChatMessages";
import { ChatInQueue } from "./ChatInQueue";
import { CHAT_HISTORY, CHAT_IN_PROGRESS, QUEUED_CHATS } from "fileConstants";
import ChatContext from "store/ChatContext";
import { getAgentInformation } from "api";
import { getUserData } from "helperFucntions";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    "& .MuiTab-root": {
      minWidth: 120,
    },
  },
}));

export const ChatTabs = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [roomId, setRoomId] = useState(null);
  const [roomToken, setRoomToken] = useState(null);
  const chatContext = useContext(ChatContext);
  const { isAuthenticated, userLoginHandler } = chatContext;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onChatClickHandler = async (roomId, roomToken) => {
    setRoomId(roomId);
    setRoomToken(roomToken);
    setValue(4);
  };

  useEffect(() => {
    if (localStorage.getItem("authToken") && !isAuthenticated) {
      getAgentInformation()
        .then((res) => {
          const user = getUserData(res);
          userLoginHandler(user);
        })
        .catch((error) => console.log(error));
    }
  }, [isAuthenticated]);

  return (
    <Box className={classes.root}>
      <Navbar />
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <div {...a11yProps(0)} />
          <Tab
            label="Queued chats"
            icon={<AccountCircleIcon />}
            {...a11yProps(1)}
          />
          <Tab label="Chat In Progress" icon={<FaceIcon />} {...a11yProps(2)} />
          <Tab label="Chat History" icon={<GroupIcon />} {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={1}>
        <ChatInQueue chatType={QUEUED_CHATS} chatClick={onChatClickHandler} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ChatInQueue
          chatType={CHAT_IN_PROGRESS}
          chatClick={onChatClickHandler}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ChatInQueue chatType={CHAT_HISTORY} chatClick={onChatClickHandler} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ChatMessages roomId={roomId} roomToken={roomToken} />
      </TabPanel>
    </Box>
  );
};
