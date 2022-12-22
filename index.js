const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { drive } = require('googleapis/build/src/apis/drive');

require("dotenv").config();
const axios = require('axios');
const Telegraf = require('telegraf');
//const { Composer } = require('micro-bot');

const token = process.env.Token;

const bot = new Telegraf(token);
//const bot = new Composer
const answer = `
🔹🔹🔹🔹*Welcome to Anki-Bot*🔹🔹🔹🔹🔹

📥 *Download* Anki Decks that were sent by our own students *Or* 
⬆️ Send us your Anki Decks to make your contribution.

/start - To start the bot
🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹
`;
//const RestAPIurl = "https://script.google.com/macros/s/AKfycbwE0kSz-GE06Pgs-4CStv6B1l7JnKnel_NUNpgbwtcT-PyyTSHN/exec";
const RestAPIurl = process.env.RestApiUrl;

//https://brick-red-rattlesnake-yoke.cyclic.app

//On the start command, it sends two buttons - Upload and Download
bot.start((ctx) => {
  var id = ctx.chat.id;

  ctx.telegram.sendMessage(id, answer, {
    parse_mode: "markdown",
    reply_markup: {
      inline_keyboard: [
        //[{text: "Upload File", callback_data: "Upload"}],
        [{ text: "Upload File", web_app: { url: "https://script.google.com/macros/s/AKfycbw6fgnrC8pT2kpNtS9_VHHIAnS3XV8dObLW-vwieNUatW5FWaE6xYTW13qmz7s-dMcSNg/exec"} }],
        [{ text: "Download File", callback_data: "Download" }]
      ]
    }
  });

})


async function listFilesByYear(Year) {
  let res = await axios.get(RestAPIurl)
  result = res.data[0].data;
  //console.log(result); 

  //filesByYear = result.filter((elem) => {return elem.Year.toString().includes(Year) == true});
  filesByYear = result.filter((elem) => {return elem.Year.toString() == Year});

  fileDescription = filesByYear.map((elem, index) => (
    `
        Result ${index + 1}
📁 File Name: ${elem.FileName}
📁 Year: ${elem.Year}
📥 Download Link: ${elem.FileUrl}

                `
  )
  );

  console.log(fileDescription);
  return fileDescription;
}




bot.action('Download', (ctx) => {
  var id = ctx.chat.id;
  ctx.deleteMessage();

    ctx.telegram.sendMessage(id, "Choose Year", {
      reply_markup: {
        inline_keyboard: [
          [{text: "PC1", callback_data: "pc1"},{text: "PC2", callback_data:"pc2"}],
          [{text: "C1", callback_data: "c1"},{text: "C2", callback_data:"c2"}],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
})

bot.action('pc1', (ctx) => {
  var id = ctx.chat.id;
  ctx.deleteMessage();
  var Year = "PC1";

  listFilesByYear(Year)
  .then((result) =>{
    var NumOfResults = result.length;
    if(result.length > 20){
      result.length = 9;
    }
    
    ctx.telegram.sendMessage(id, "Available PC1 Anki Files" + "\n" + result, {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back to Year", callback_data: "Download" }],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });

  })   
})

bot.action('pc2', (ctx) => {
  var id = ctx.chat.id;
  ctx.deleteMessage();
  var Year = "PC2";

  listFilesByYear(Year)
  .then((result) =>{
    var NumOfResults = result.length;
    if(result.length > 20){
      result.length = 9;
    }
    
    ctx.telegram.sendMessage(id, "Available PC2 Anki Files" + "\n" + result, {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back to Year", callback_data: "Download" }],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
    
  })   
})

bot.action('c1', (ctx) => {
  var id = ctx.chat.id;
  ctx.deleteMessage();
  var Year = "C1";

  listFilesByYear(Year)
  .then((result) =>{
    var NumOfResults = result.length;
    if(result.length > 20){
      result.length = 9;
    }
    
    ctx.telegram.sendMessage(id, "Available C1 Anki Files" + "\n" + result, {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back to Year", callback_data: "Download" }],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
    
  })   
})

bot.action('c2', (ctx) => {
  var id = ctx.chat.id;
  ctx.deleteMessage();
  var Year = "C2";

  listFilesByYear(Year)
  .then((result) =>{
    var NumOfResults = result.length;
    if(result.length > 20){
      result.length = 9;
    }
    
    ctx.telegram.sendMessage(id, "Available C2 Anki Files" + "\n" + result, {
      reply_markup: {
        inline_keyboard: [
          [{text: "Back to Year", callback_data: "Download" }],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
    
  })   
})

bot.action('Main', (ctx) => {
  var id = ctx.chat.id;
  ctx.deleteMessage()
  ctx.telegram.sendMessage(id, answer, {
    parse_mode: "markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Upload File", web_app: { url: "https://script.google.com/macros/s/AKfycbw6fgnrC8pT2kpNtS9_VHHIAnS3XV8dObLW-vwieNUatW5FWaE6xYTW13qmz7s-dMcSNg/exec"} }],
        [{ text: "Download File", callback_data: "Download" }]
      ]
    }
  });
})

bot.launch({
  webhook: {
    domain: "https://brick-red-rattlesnake-yoke.cyclic.app",
      port: 3000 // I've seen 3000 is frequently used so let's use that
  }
})