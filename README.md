# IMVU: Bot (OpenAI)
<b>IMVU: Bot (OpenAI)</b> - is a browser extension designed to interact with the popular IMVU virtual chat service using artificial intelligence from OpenAI. 
This extension allows users to automate their chat processes using OpenAI's advanced language models such as gpt-3.5-turbo, gpt-3.5-turbo-0613, gpt-3.5-turbo-0301, gpt-4-0314, gpt-4-0314, gpt-4-32k-0314.

## How it looks like
The picture below shows the menu that appears when we click on the extension icon

![image](https://github.com/ncctcr/imvu-openai-bot/assets/37658170/e480574e-ee38-4b40-aa67-aff20ee4fe00)


|  Field | Description |
|---|---|
| Open AI API Key | This is a unique character string provided by OpenAI that allows your application or program to communicate with the OpenAI API (Application Programming Interface). Simply put, it is like a password or identifier that allows your code to send requests to the GPT (Generative Pre-trained Transformer) artificial intelligence on the OpenAI servers and receive responses. |
| Props (bot behavior) |  This is the field where we set the behavior of our bot. (For example: You are an IMVU user who wants to communicate. You like to joke around and try to make friends with people) |
| Model | Versions of models used for text generation in chat-like interfaces. The main component here is GPT (Generative Pre-trained Transformer), which is a type of neural network designed to generate text based on pre-training on large amounts of data. |
| Delayed response (in sec) | This field provides a number in seconds by which the bot will wait 5 seconds after the last message. If there is a new chat message within 5 seconds - the stopwatch resets and starts the report over again. If there is no new message within 5 seconds - we take all new messages and send them to the bot with one request |
| Bot text size | This field is responsible for the size of the message from the bot. If we specify for example 5 characters, then the message from the bot will be returned with 5 characters. |

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

## Bugs
- The START/STOP button sometimes does not show the current state because of this we can start the bot several times.
