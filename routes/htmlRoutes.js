// DEPENDENCIES
// We need to include the path package to get the correct file path for our html

const path = require('path');

const bDebugging = false;

// ROUTING

module.exports = (app) => {
  // => HTML GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases the user is shown an HTML page of content

  app.get('/notes', (req, res) => {
    var sFile = path.join( __dirname, '../public/notes.html' );
    if ( bDebugging ) {
      // console.log( "app.get(/notes dir): [" + __dirname + "]" );
      console.log( `app.get(/notes): ${sFile}` );
    }
    res.sendFile( sFile );
  });

  app.get('/', (req, res) => {
    var sFile = path.join( __dirname, '../public/index.html' );
    if ( bDebugging )
      console.log( `app.get(/): ${sFile}` );
    res.sendFile( sFile );
  });

  // If no matching route is found default to home
  // app.get( '*', (req, res) => {
  //   var sParam = req.params[0];
  //   console.log( "   __dirname: [" + __dirname + "]" );
  //   console.log( `   app.get(*): ${sParam}` );

  //   var sFile = path.join( __dirname, sParam );
  //   console.log( `   app.get(*): ${sFile}` );
  //   res.sendFile( sFile );

  //   // res.sendFile( path.join( __dirname, '../public/index.html') );
  //   // res.sendFile( sParam );
  // });

};
