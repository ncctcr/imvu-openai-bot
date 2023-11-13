# IMVU: Bot (OpenAI)
<b>IMVU: Bot (OpenAI)</b> - is a browser extension designed to interact with the popular IMVU virtual chat service using artificial intelligence from OpenAI. 
This extension allows users to automate their chat processes using OpenAI's advanced language models such as gpt-3.5-turbo and gpt-4.

## How it works
1. Open IMVU in a browser
2. Go to some room
3. Click on the extension (after that the bot menu should appear)
4. Specify OpenAI API Key
5. Click on the <b>'START'</b> button
6. Wait for someone to write to the chat room
7. After someone has written to the chat room, the script will start waiting for new messages, which will be expected within %delayed response% seconds. If there are no new messages for %delayed response% then we send a request (This is to avoid spam)
8. Once the script receives the response from the request, it will automatically insert it into the input and send the message in chat
9. To stop the bot we open the bot menu and press the 'STOP' button

## Requirements
- <b>API Key</b> from [OpenAI](https://platform.openai.com/) 

## Install
1. Download project
2. Got to <code>chrome://extentions</code> page 
3. Switch to <b>'Developer mode'</b>
4. Click on <b>'Download the unpacked extension'</b>
5. Select folder with that project
6. Enjoy
