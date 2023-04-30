const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { drive } = require('googleapis/build/src/apis/drive');
const { HttpsProxyAgent } = require {'https-proxy-agent'}

require("dotenv").config();
const axios = require('axios');

const Telegraf = require('telegraf');
//const { Composer } = require('micro-bot');

const token = process.env.Token;

const bot = new Telegraf(token, {
  telegram: {
    agent: new HttpsProxyAgent('http://127.0.0.1:3333')
  }
});

//const bot = new Composer
const answer = `
🔹🔹🔹🔹*Welcome to Anki-Bot*🔹🔹🔹🔹🔹

📥 *Download* Anki Decks that were sent by our own students *Or* 
⬆️ Send us your Anki Decks to make your contribution.

This bot is made by the SCOME National team. The cards didn't go under any reviewing system yet so if you get any uncertain information please text or email the owner of the deck (address is found along with the deck) for correction.

/start - To start the bot
🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹
`;
//const RestAPIurl = "https://script.google.com/macros/s/AKfycbwE0kSz-GE06Pgs-4CStv6B1l7JnKnel_NUNpgbwtcT-PyyTSHN/exec";
const RestAPIurl = process.env.RestApiUrl;

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})


//On the start command, it sends two buttons - Upload and Download
bot.start((ctx) => {
  var id = ctx.chat.id;
  //let currentPage = 1;
  //let res = axios.get(RestAPIurl)
  //let result = res.data[0].data;
  //console.log(result[1]);
  //handlePagination(msg, result, currentPage);

  
  ctx.telegram.sendMessage(id, answer, {
    parse_mode: "markdown",
    reply_markup: {
      inline_keyboard: [
        //[{text: "Upload File", callback_data: "Upload"}],
        [{ text: "Upload File", web_app: { url: "https://script.google.com/macros/s/AKfycbyXLPN_7_6FhzrysLYwQQjlFj9wPl9jTZLG4HRgduZxN5mJRi3lURK-neTu6e2IdttdEw/exec"} }],
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
        <i>Result ${index + 1}</i>
📑 <b>Topic:</b> ${elem.Topic}
📚 <b>Subject:</b> ${elem.Subject}
📁 <b>File Name:</b> ${elem.FileName}
🧑 <b>Uploaded By:</b> ${elem.Telegram_Username} (${elem.Email})
📥 <b>Download Link:</b> ${elem.FileUrl}

                `
  )
  );

  //console.log(fileDescription);
  return fileDescription;
}


async function resultsByPage(Year) {
  let res = await axios.get(RestAPIurl)
  result = res.data[0].data;
 
  const filesByYear = result.filter((elem) => {return elem.Year.toString() == Year});
  const firstPage = filesByYear.slice(0, 10);
  const secondPage = filesByYear.slice(10,20);
  const thirdPage = filesByYear.slice(20,30);

  console.log(secondPage);
  
      const fileDescription = secondPage.map((elem, index) => (
          `
              <i>Result ${index + 1}</i>
      📑 <b>Topic:</b> ${elem.Topic}
      📚 <b>Subject:</b> ${elem.Subject}
      📁 <b>File Name:</b> ${elem.FileName}
      🧑 <b>Uploaded By:</b> ${elem.Telegram_Username} (${elem.Email})
      📥 <b>Download Link:</b> ${elem.FileUrl}
      
                      `
        )
        );
        
      console.log(fileDescription);
      return filesByYear;

}

//Pagination function
function paginationButtons(currentPage, totalPages, callback) {
  let buttons = [];

  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 0 && i <= totalPages) {
      buttons.push({
        text: `${i}`,
        callback_data: `page-${i}`
      });
    }
  }

  if (currentPage > 3) {
    buttons.unshift({
      text: "<<",
      callback_data: `page-${1}`
    });
  }

  if (currentPage < totalPages - 2) {
    buttons.push({
      text: ">>",
      callback_data: `page-${totalPages}`
    });
  }

  let keyboard = [];
  keyboard.push(buttons);

  return {
    inline_keyboard: keyboard
  };
}

function handlePagination(msg, data, currentPage) {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const end = currentPage * itemsPerPage;

  const items = data.slice(start, end);

  const keyboard = paginationButtons(currentPage, totalPages, handlePagination);

  const options = {
    reply_markup: keyboard
  };

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `Page ${currentPage}\\n\\n${items.join("\\n")}`, options);
}

//resultsByPage("Preclinical");

const downloadAnswer = `
🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹

🔎 <b>Search</b>
      Search for Anki files by topic or subject

📖 <b>Year</b>
      To see available Anki Files under the selected year

🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹
`


bot.action('Download', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };

    ctx.telegram.sendMessage(id, downloadAnswer, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "Search", switch_inline_query_current_chat: ""}],
          [{text: "Preclinical", callback_data: "Preclinical"},{text: "Clinical", callback_data: "Clinical"}],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
})

bot.on('inline_query', async ctx => {
    var query = ctx.inlineQuery.query;  
    console.log(ctx.update);
    
    
    await axios.get(RestAPIurl)
        .then(d => d.data[0])
        .then(d => {
            var result = d.data;

            var filtered = result.filter(item => item.Topic.toString().toLowerCase().includes(query)
            || item.FileName.toString().toLowerCase().includes(query) == true);
            
            var results = filtered.map((elem, index) => (
                {
                type:'article', 
                id: String(index),
                title: elem.Topic, 
                description: elem.Subject ,
                parse_mode: "HTML",
                message_text:   `
                📌<u><b>${elem.Topic}</b> (${elem.Year})</u>
                                
📚 <b>Subject</b> - ${elem.Subject}
📑 <b>Filename</b> - ${elem.FileName}
🧑 <b>Uploaded By:</b> ${elem.Telegram_Username} (${elem.Email})
📥 <b>Download Link</b> - ${elem.FileUrl}

                        ` 
                })
            );


            if (results.length > 20){
                results.length = 15
                console.log(results);
                ctx.answerInlineQuery(results, {cache_time: 300});
            }else if(results.length = 0){

              console.log(results);
              ctx.answerInlineQuery({
                  type:'article', 
                  id: 1000,
                  title: "Results Not found", 
                  description: "No results",
                  parse_mode: "HTML"
                  }, 
                  {cache_time: 300}
                );
            }
          
        })
    console.log(query);
})

bot.action('Preclinical', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  }
  
  var Year = "Preclinical";
  
  listFilesByYear(Year)
  .then((result) =>{
    var NumOfResults = result.length;
    if(result.length > 20){
      result.length = 5;
    }
    
    ctx.telegram.sendMessage(id, "Available Pre-Clinical Anki Files" + "\n" + result, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "🟩1🟩", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
          [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
          [{text: "Back to Year", callback_data: "Download" }],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
    
  })   
 
})


bot.action('Next2P', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Preclinical";

  listFilesByYear(Year)
  .then((result) =>{
    var secondPage = result.slice(5,10);
    var NumOfResults = secondPage.length;
    console.log(secondPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 2 - Pre-Clinical Anki Files" + "\n" + secondPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "🟩2🟩", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 2 - Pre-Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "🟩2🟩", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
    
  })   

})


bot.action('Next3P', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Preclinical";

  listFilesByYear(Year)
  .then((result) =>{
    var thirdPage = result.slice(10,15);
    var NumOfResults = thirdPage.length;

    console.log(NumOfResults);
    console.log(thirdPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 3 - Pre-Clinical Anki Files" + "\n" + thirdPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "🟩3🟩", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 3 - Pre-Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "🟩3🟩", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next4P', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Preclinical";

  listFilesByYear(Year)
  .then((result) =>{
    var fourthPage = result.slice(15,20);
    var NumOfResults = fourthPage.length;

    console.log(NumOfResults);
    console.log(fourthPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 4 - Pre-Clinical Anki Files" + "\n" + fourthPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "🟩4🟩", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 4 - Pre-Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "🟩4🟩", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next5P', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Preclinical";

  listFilesByYear(Year)
  .then((result) =>{
    var fifthPage = result.slice(20,25);
    var NumOfResults = fifthPage.length;

    console.log(NumOfResults);
    console.log(fifthPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 5 - Pre-Clinical Anki Files" + "\n" + fifthPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "🟩5🟩", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 5 - Pre-Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "🟩5🟩", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next6P', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Preclinical";

  listFilesByYear(Year)
  .then((result) =>{
    var sixthPage = result.slice(25,30);
    var NumOfResults = sixthPage.length;

    console.log(NumOfResults);
    console.log(sixthPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 6 - Pre-Clinical Anki Files" + "\n" + sixthPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "🟩6🟩", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 6 - Pre-Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "🟩6🟩", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next7P', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Preclinical";

  listFilesByYear(Year)
  .then((result) =>{
    var seventhPage = result.slice(30,35);
    var NumOfResults = seventhPage.length;

    console.log(NumOfResults);
    console.log(seventhPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 7 - Pre-Clinical Anki Files" + "\n" + seventhPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "🟩7🟩", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 7 - Pre-Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "🟩7🟩", callback_data: "Next7P"}, {text: "Page 8", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next8P', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Preclinical";

  listFilesByYear(Year)
  .then((result) =>{
    var eighthPage = result.slice(35,40);
    var NumOfResults = eighthPage.length;

    console.log(NumOfResults);
    console.log(eighthPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 8 - Pre-Clinical Anki Files" + "\n" + eighthPage + "\n" + "\n" + "For more results, use the <b>Search</b> button", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "🟩8🟩", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 8 - Pre-Clinical Anki Files" + "\n" + "No Results" + "\n" + "For more results, use the <b>Search</b> button", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Preclinical"}, {text: "Page 2", callback_data: "Next2P"},{text: "Page 3", callback_data: "Next3P"}, {text: "Page 4", callback_data: "Next4P"}],
            [{text: "Page 5", callback_data: "Next5P"},{text: "Page 6", callback_data: "Next6P"}, {text: "Page 7", callback_data: "Next7P"}, {text: "🟩8🟩", callback_data: "Next8P"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }

  })   

})


bot.action('Clinical', (ctx) => {
  var id = ctx.chat.id;
  var messageId = ctx.update.callback_query.message.message_id;
  //console.log(messageId);
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Clinical";

  listFilesByYear(Year)
  .then((result) =>{
    var NumOfResults = result.length;
 
    if(result.length > 20){
      result.length = 5;
    }
    
    ctx.telegram.sendMessage(id, "Available Clinical Anki Files" + "\n" + result, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "🟩1🟩", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
          [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
          [{text: "Back to Year", callback_data: "Download" }],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
    
  })   
})


bot.action('Next2C', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Clinical";

  listFilesByYear(Year)
  .then((result) =>{
    var secondPage = result.slice(5,10);
    var NumOfResults = secondPage.length;
    console.log(secondPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 2 - Clinical Anki Files" + "\n" + secondPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "🟩2🟩", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 2 - Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "🟩2🟩", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
    
  })   

})


bot.action('Next3C', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Clinical";

  listFilesByYear(Year)
  .then((result) =>{
    var thirdPage = result.slice(10,15);
    var NumOfResults = thirdPage.length;

    console.log(NumOfResults);
    console.log(thirdPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 3 - Clinical Anki Files" + "\n" + thirdPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "🟩3🟩", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 3 - Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "🟩3🟩", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next4C', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Clinical";

  listFilesByYear(Year)
  .then((result) =>{
    var fourthPage = result.slice(15,20);
    var NumOfResults = fourthPage.length;

    console.log(NumOfResults);
    console.log(fourthPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 4 - Clinical Anki Files" + "\n" + fourthPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "🟩4🟩", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 4 - Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "🟩4🟩", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next5C', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Clinical";

  listFilesByYear(Year)
  .then((result) =>{
    var fifthPage = result.slice(20,25);
    var NumOfResults = fifthPage.length;

    console.log(NumOfResults);
    console.log(fifthPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 5 - Clinical Anki Files" + "\n" + fifthPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "🟩5🟩", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 5 - Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "🟩5🟩", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next6C', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Clinical";

  listFilesByYear(Year)
  .then((result) =>{
    var sixthPage = result.slice(25,30);
    var NumOfResults = sixthPage.length;

    console.log(NumOfResults);
    console.log(sixthPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 6 - Clinical Anki Files" + "\n" + sixthPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "🟩6🟩", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 6 - Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "🟩6🟩", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next7C', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Clinical";

  listFilesByYear(Year)
  .then((result) =>{
    var seventhPage = result.slice(30,35);
    var NumOfResults = seventhPage.length;

    console.log(NumOfResults);
    console.log(seventhPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 7 - Clinical Anki Files" + "\n" + seventhPage, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "🟩7🟩", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 7 - Clinical Anki Files" + "\n" + "No Results", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "🟩7🟩", callback_data: "Next7C"}, {text: "Page 8", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }
  })   

})

bot.action('Next8C', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  };
  var Year = "Clinical";

  listFilesByYear(Year)
  .then((result) =>{
    var eighthPage = result.slice(35,40);
    var NumOfResults = eighthPage.length;

    console.log(NumOfResults);
    console.log(eighthPage);

    if(result.length > 20){
      result.length = 9;
    }
    
    if (NumOfResults != 0){
      ctx.telegram.sendMessage(id, "Page 8 - Clinical Anki Files" + "\n" + eighthPage + "\n" + "\n" + "For more results, use the <b>Search</b> button", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "🟩8🟩", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }else {
      ctx.telegram.sendMessage(id, "Page 8 - Clinical Anki Files" + "\n" + "No Results" + "\n" + "For more results, use the <b>Search</b> button", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Page 1", callback_data: "Clinical"}, {text: "Page 2", callback_data: "Next2C"},{text: "Page 3", callback_data: "Next3C"}, {text: "Page 4", callback_data: "Next4C"}],
            [{text: "Page 5", callback_data: "Next5C"},{text: "Page 6", callback_data: "Next6C"}, {text: "Page 7", callback_data: "Next7C"}, {text: "🟩8🟩", callback_data: "Next8C"}],
            [{text: "Back to Year", callback_data: "Download" }],
            [{text: "Back to MainMenu", callback_data: "Main"}]
          ]
        }
      });
    }

  })   

})


bot.action('Main', (ctx) => {
  var id = ctx.chat.id;
  try {
    ctx.deleteMessage()
  }catch(error){
    console.log(error);
  }
  ctx.telegram.sendMessage(id, answer, {
    parse_mode: "markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Upload File", web_app: { url: "https://script.google.com/macros/s/AKfycbyXLPN_7_6FhzrysLYwQQjlFj9wPl9jTZLG4HRgduZxN5mJRi3lURK-neTu6e2IdttdEw/exec"} }],
        [{ text: "Download File", callback_data: "Download" }]
      ]
    }
  });
})

bot.launch();

