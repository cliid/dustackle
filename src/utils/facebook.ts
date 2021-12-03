import axios from 'axios';

const send = (senderPSID: string, payload: string) => {
  axios.post(
    `https://graph.facebook.com/v2.6/me/messages?${new URLSearchParams({
      access_token: process.env.FB_MESSENGER_ACCESS_TOKEN!,
    })}`,
    {
      recipient: {
        id: senderPSID,
      },
      message: {
        text: payload,
      },
    }
  );
};

export default { send };
