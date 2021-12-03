import axios from 'axios';

const sendText = (senderPSID: string, text: string) => {
  axios.post(
    `https://graph.facebook.com/v12.0/me/messages?${new URLSearchParams({
      access_token: process.env.FB_MESSENGER_ACCESS_TOKEN!,
    })}`,
    {
      recipient: {
        id: senderPSID,
      },
      message: {
        text,
      },
    }
  );
};

export default { sendText };
