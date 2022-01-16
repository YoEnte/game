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
    
    if(trailing_good){
		if(url == '/uptime'){
        	tools.log('uptime', `uptime robot monitored`);
		}else{
			tools.log('info', `got a request on: ${url}`);
		}
        next();
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
		res.status(404).render(path.join(__dirname, 'pages', data.pages['404'].directory, 'index.html'), {host: host, statics: static_files, page: data.pages['404'].directory, info: info});
	}

	var password = req.query.password;
	if(Object.keys(data.pages).includes(page)){
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
			if(page == 'launcher'){
				
			}

			res.status(200).render(path.join(__dirname, 'pages', data.pages[page].directory, 'index.html'), {host: host, statics: static_files, page: data.pages[page].directory, info: info});
		}else{
			res.status(404).render(path.join(__dirname, 'pages', data.pages['restricted'].directory, 'index.html'), {host: host, statics: static_files, page: data.pages['restricted'].directory, info: info});
		}
	}else{
		res.status(404).render(path.join(__dirname, 'pages', data.pages['404'].directory, 'index.html'), {host: host, statics: static_files, page: data.pages['404'].directory, info: info});
	}
});

// favicon
app.get('/favicon.ico', (req, res) => {
	res.send('');
});

// all other pages
app.get('*', (req, res) => {
	res.status(404).render(path.join(__dirname, 'pages', data.pages['404'].directory, 'index.html'), {host: host, statics: static_files, page: data.pages['404'].directory, info: info});
});

// listen to port / on start
app.listen(port, () => {
    console.log('\n\n______________________________________________________________\n');
    tools.log('good', `server started and is running on port ${port}`);
});