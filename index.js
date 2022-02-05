const express = require('express');
const path = require('path');
const fs = require('fs');
const tools = require('./services/tools.js');
const data = require('./services/data.js');

// server instance
const app = express();

// port
const port = process.env.PORT || 3000;

// scrict routing (exact urls -> if no trailing slash then no trailing slash and vice versa)
app.enable('strict routing');

// static files
const host = 'https://game.kerkerpunk.repl.co';
const static_files = 'files';
app.use('/files/', express.static(path.join(__dirname, 'pages')));

// correcting the url (trailing slash)
app.all('*', (req, res, next) => {
    const url = req.url;
    var trailing_good = false;
    
    if(url != '/'){
        if(url.slice(-1) == '/'){
            res.redirect(url.slice(0, -1));
        }else{
            trailing_good = true;
        }
    }else{
        trailing_good = true;
    }

	if(['/favicon.ico'].includes(url)){
		res.send('');
	}
    
    if(trailing_good){
		tools.log('info', `got a request on: ${url}`);
        next();
    }else{
		res.status(404).render(path.join(__dirname, 'pages', data.pages['404'].directory, 'index.html'), {host: host, statics: static_files, page: data.pages['404'].directory});
	}
});

// setup engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// ----------- handle requests for pages -----------

// normal page
app.get('/', (req, res) => {
    res.redirect('/p/home');
});

// pages
app.get('/p/:page', (req, res) => {
	var page = req.params.page;

	try{
		if(fs.existsSync(path.join(__dirname, 'pages', data.pages[page].directory, 'index.html'))){/* file exists */}
	}catch(err){
		res.status(404).render(path.join(__dirname, 'pages', data.pages['404'].directory, 'index.html'), {host: host, statics: static_files, page: data.pages['404'].directory});
		return;
	}

	var password = req.query.password;
	var pass_on = false;

	if(data.pages[page].password == false){
		pass_on = true;
	}else if(data.pages[page].password == true){
		if(password == data.gen_password){
			pass_on = true;
		}
	}else{
		if(password == data.pages[page].password){
			pass_on = true;
		}
	}

	if(pass_on){
		var info = {};

		res.status(200).render(path.join(__dirname, 'pages', data.pages[page].directory, 'index.html'), {host: host, statics: static_files, page: data.pages[page].directory, info: info});
		
		if(req.url.startsWith('/p/uptime')){
			tools.log('uptime', 'uptime robot successfully monitored!');
		}
	}else{
		res.status(404).render(path.join(__dirname, 'pages', data.pages['restricted'].directory, 'index.html'), {host: host, statics: static_files, page: data.pages['restricted'].directory});
	}
});

// all other pages
app.get('*', (req, res) => {
	res.status(404).render(path.join(__dirname, 'pages', data.pages['404'].directory, 'index.html'), {host: host, statics: static_files, page: data.pages['404'].directory});
});

// listen to port / on start
app.listen(port, () => {
    console.log('\n\n______________________________________________________________\n');
    tools.log('good', `server started and is running on port ${port}`);
});