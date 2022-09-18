const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');
const { drive } = require('googleapis/build/src/apis/drive');

const axios = require('axios');
const Telegraf = require('telegraf');
//const { Composer } = require('micro-bot');

const bot = new Telegraf('5415929895:AAFFslLBQoeMWzDavZA3HYtMX3wVNDKlq9c');
//const bot = new Composer

const RestAPIurl = "https://script.google.com/macros/s/AKfycbwE0kSz-GE06Pgs-4CStv6B1l7JnKnel_NUNpgbwtcT-PyyTSHN/exec";

//On the start command, it sends two buttons - Upload and Download
bot.start((ctx) => {
    var id = ctx.chat.id; 

    ctx.telegram.sendMessage(id, "Welcome to Anki-Bot!!" + "\n" + "Click on the buttons below to send or download anki files." , {
        reply_markup: {
            inline_keyboard: [
                //[{text: "Upload File", callback_data: "Upload"}],
                [{text: "Upload File", web_app: {url: "https://script.google.com/macros/s/AKfycbxXrOi3DNIUUSrrXBZYGaX9_QE0JUs0OidHq8_PhTbbU20vtVM/exec"}}],
                [{text: "Download File", callback_data: "Download"}]
            ]
        }
    });

})


async function listDownloadFiles(){
  let res = await axios.get(RestAPIurl)  

      result = res.data[0].data;
      //console.log(result); 
      fileDescription = result.map((elem, index) => (
        `
        Result ${index + 1}
File Name: ${elem.FileName}
Download Link: ${elem.FileUrl}

                `
          )
      );

      console.log(fileDescription); 
      return fileDescription;
}

listDownloadFiles();


bot.action('Download', (ctx) => {
  var id = ctx.chat.id; 
  ctx.deleteMessage();

  listDownloadFiles().then(async (result) => {
    var NumOfResults = result.length;
   
    ctx.telegram.sendMessage(id, "Available Anki Files" +  "\n"  + result, {
              reply_markup: {
                  inline_keyboard: [
                      [{text: "Back to MainMenu", callback_data: "Main"}]
                  ]
              }
          });
  });

})

bot.action('Main', (ctx) => {
  var id = ctx.chat.id; 
  ctx.deleteMessage()
  ctx.telegram.sendMessage(id, "Welcome to Anki-Bot!!" + "\n" + "Click on the buttons below to send or download anki files." , {
      parse_mode: "markdown",
      reply_markup: {
          inline_keyboard: [
            [{text: "Upload File", web_app: {url: "https://script.google.com/macros/s/AKfycbxXrOi3DNIUUSrrXBZYGaX9_QE0JUs0OidHq8_PhTbbU20vtVM/exec"}}],
            [{text: "Download File", callback_data: "Download"}]
          ]
      }
  });
})


//Displays Name, Type & Size of the file sent by the user
bot.on('document', (ctx) => {
    let file = ctx.update.message.document;
    let fileName = file.file_name;
    let Type = file.mime_type;
    let username = ctx.from.username;
    let id = ctx.chat.id;

   
    fileDescription = {
        data:   "Name: " + String(file.file_name) + "\n" + 
                "type: " + String(file.mime_type) + "\n" +
                "Size: " + String(file.file_size) + "\n"
    };

    //fileData = fileDescription.data;
    //console.log(fileData)
    return ctx.reply("Document received." + "\n" + "Document information: " + "\n" + "\n" + fileData)

}
);

bot.launch()
//module.exports = bot

//web: micro-bot -p $PORT => tried to change it to worker dyno => 
//Please work on this!!!! 


//Server ID - aqueous-cove-61595
//Server URL - https://aqueous-cove-61595.herokuapp.com/

//Windows git "warning: LF will be replaced by CRLF", is that warning tail backward?
//=>Paste this in Terminal: "git config --global core.autocrlf false"

/*
//createAndUploadFile(auth).catch(console.error)

async function googleDriveFilesList () {
    // Create a new JWT client using the key file downloaded from the Google Developer Console
    return google.auth.getClient({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/drive'
    }).then(client => {
        // Obtain a new drive client, making sure you pass along the auth client
        const drive = google.drive({
          version: 'v3',
          auth: client
        });
      
        //trial
            const res = drive.drives.get({
                // The ID of the shared drive.
                driveId: '1agtikqPvyUrHgm9m_tMO63mv3uhRlrZE',
                // Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs.
                useDomainAdminAccess: 'true',
            });
            console.log(res.data);
        

        // Make an authorized request to list Drive files.
        var FolderId = "1agtikqPvyUrHgm9m_tMO63mv3uhRlrZE";
        var listRequest = drive.files.list(PageSize = 5, fields='files(id, name)');

        return listRequest;
    }).then(res => {
        var filesList = res.data.files;
        console.log(filesList)
        return filesList;
    });
  
  }

  //Another trial for drive list using ankibot2@gmail.com instead of my gmail
  async function googleDriveFilesList () {
    // Create a new JWT client using the key file downloaded from the Google Developer Console
    return google.auth.getClient({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/drive'
    }).then(client => {
        // Obtain a new drive client, making sure you pass along the auth client
        const drive = google.drive({
          version: 'v3',
          auth: client
        });
      
        //trial
            const res = drive.drives.get({
                // The ID of the shared drive.
                driveId: '1Yx9_nMc-UWFHlvdzqlXt-2QdGzKidL5h',
                // Issue the request as a domain administrator; if set to true, then the requester will be granted access if they are an administrator of the domain to which the shared drive belongs.
                useDomainAdminAccess: 'true',
            });
            //console.log(res);
            //console.log(res.data);

        // Make an authorized request to list Drive files.
        const FolderId = "1Yx9_nMc-UWFHlvdzqlXt-2QdGzKidL5h";
        const listRequest = drive.files.list({
            'pageSize': 5,
            'fields': "files(id, name)",
            'q': `parents in "${FolderId}"`
          });
        
        //"'1Yx9_nMc-UWFHlvdzqlXt-2QdGzKidL5h'in parents"
        console.log(listRequest);
        
        return listRequest;
    }).then(res => {
        //var filesList = res.data.files;
        //console.log(filesList)
        //return filesList;
        console.log(res);
    });
  
  }

googleDriveFilesList(); //works well and perfectly

  async function createAndUploadFile() {
    // Create a new JWT client using the key file downloaded from the Google Developer Console
    return google.auth.getClient({
      keyFile: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/drive'
    }).then(client => {
        // Obtain a new drive client, making sure you pass along the auth client
        const drive = google.drive({
          version: 'v3',
          auth: client
        });


        //metadata for the new file on the google drive
        //application/vnd.google-apps.spreadsheet
        let fileMetaData = {
            name: "Test txt 1",
            parents: ['1agtikqPvyUrHgm9m_tMO63mv3uhRlrZE'],
            description: "txt file",
            mimeType: 'text/plain'
        };

        //media definition of the file
        let media = {
            mimeType: "text/plain",
            body: fs.createReadStream("test.txt")
        };

        //create the request
        let response = drive.files.create({params: {
            resource: fileMetaData,
            media: media,
            fields: 'id'
        }
        })
        

        // Make an authorized request to create file.
        return response;
    
    }).then(res => {
        //console.log(res)
        console.log(res.data, "File added.")
        return res.data;
    });
    
  }

  //googleDriveFilesList(); //works well and perfectly
  //createAndUploadFile(); //Try using fetch or XHTML

    //Solved the "Could not load the default credentials. Browse 
    //to https://cloud.google.com/docs/authentication/getting-started for more information." by installing
    //google cloud sdk and adding it to Env PATH(system). 
    //Then signed in with "gcloud auth login" to add the project id
    // Now we need to solve => Unable to load endpoint drive("undefined"): ctr is not a constructor
    // Solved by getting client &  using new function script

    //Solved filesList => now when creating new file in the drive, it includes it in the list
    //Create & upload file not solved!!
*/