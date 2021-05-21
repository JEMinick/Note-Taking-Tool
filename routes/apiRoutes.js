const { ENOENT } = require('constants');
const fs = require('fs');
const path = require('path');

// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information...
const sNotesFilename = '../db/db.json';
// const notesData = require(sNotesFilename);
let notesData = [];
let sNotesDB = path.join( __dirname, sNotesFilename );

const bDebugging = false;
let bError = false;

// ROUTING

const initApiRoutes = () => {
  
  fs.readFile( sNotesDB, 'utf8', (error, data) => {
    if ( error ) {
      if ( error.code === 'ENOENT' ) {
        // Create an empty notes list:
        notesData = [];
        fs.writeFile( sNotesDB, JSON.stringify(notesData), (error) => {
          if ( error ) {
            bError = true;
            console.error(error);
          } else {
            bError = false;
          }
        });
      } else {
      bError = true;
      console.error(error);
    }
    } else {
      notesData = JSON.parse(data);
      if ( bDebugging ) {
        console.log( `\nInitial NOTES data file:` );
        console.log( data );
        console.log( `Parsed NOTES data file:` );
        console.log( notesData );
      }
    }
  });

};

module.exports = (app) => {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/notes... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get('/api/notes', (req, res) => {
    if ( bDebugging ) {
      var sNotes = JSON.stringify(notesData);
      console.log( `/api/notes (GET) export: "${sNotes}"` );
    }
    res.json( notesData );
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a new note request... this data is then sent to the server...
  // Then the server saves the data to the notesData array)
  // ---------------------------------------------------------------------------
  //
  const getNextId = () => {
    let iLastId=0;
    for( let i=0; (i < notesData.length); i++ ) {
      var iID = notesData[i].id;
      if ( iID > iLastId )
        iLastId = iID;
    }
    return( ++iLastId );
  }
  
  app.post('/api/notes', (req, res) => {
    // Note the code here. Our "server" will respond to requests and let users know if 
    // the note is added to the array.
    if ( bDebugging ) {
      var sReqBody = JSON.stringify(req.body);
      console.log( `/api/notes (POST): "${sReqBody}"` );
    }
    req.body.id = ( req.body.id == 0 ? getNextId() : req.body.id );
    notesData.push( req.body );
    // console.log( `Total notes: [${notesData.length}]` );
    
    res.json( req.body );
  });
  
  // finds specific note by ID from notes array
  // const findNoteById = (id, notesArray) => {
  //   const result = notesArray.filter(note => note.id === id)[0];
  //   return result;
  // };

  const removeNote = ( note, notesArray ) => {
    // removes specific note from notes array
    const index = notesArray.indexOf( note );
    if ( bDebugging ) {
      console.log( `removeNote(): The index of the note to delete: ${index}` );
    }
    notesArray.splice( index, 1 );

    // rewrites db.json with new array
    // fs.writeFileSync(
    //     path.join(__dirname, '../db/db.json'),
    //     JSON.stringify({ notes: notesArray }, null, 2)
    // );
    fs.writeFile( sNotesDB, JSON.stringify(notesArray), (error) => {
      if ( error ) {
        bError = true;
        console.error(error);
      } else {
        if ( bDebugging ) {
          console.log( `\nNOTES after delete:` );
          fs.readFile( sNotesDB, 'utf8', (error, data) => {
            if ( error ) {
              bError = true;
              console.error(error);
            } else {
              console.log( data );
            }
          });
        }
      }
    });

  };

  app.delete( '/api/notes/:id', (req, res) => {
    let sReqBody = JSON.stringify(req.body);

    let iNoteID = req.params.id;
    let iTotalNotes = notesData.length;

    if ( bDebugging ) {
      console.log( `/api/notes/# (DELETE): "id:[${iNoteID}]", "Total Notes:[${iTotalNotes}]"` );
    }

    let bFound = false;
    for( let i=0; (!bFound) && (i < notesData.length); i++ ) {
        // if ( bDebugging ) {
        //   var sRecord = JSON.stringify(notesData[i]);
        //   console.log( `notesData[${i}] :: "${sRecord}"` );
        // }
        var iID = notesData[i].id;
        // if ( bDebugging ) {
        //   console.log( `notesData[${i}].id :: [${iID}]` );
        // }
        bFound = ( iID == iNoteID );
        if ( bFound ) {
          // if ( bDebugging ) {
          //   console.log( `Removing note# [${iNoteID}]` );
          // }
          removeNote( notesData[i], notesData );
        }
    }

    res.json();

  });

  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!

  app.post('/api/clear', (req, res) => {
    // Empty out the arrays of data
    if ( bDebugging ) {
      console.log( `/api/clear:` );
    }
    notesData.length = 0;
    res.json({ ok: true });
  });
  
};

initApiRoutes();
