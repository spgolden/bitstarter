#!/usr/bin/env node
/* Automatically grade files for HTML tags*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksFile) {
    return JSON.parse(fs.readFileSync(checksFile));
}

var checkHtmlFile = function(htmlfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(CHECKSFILE_DEFAULT).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var checkHtmlURL = function(html) {
    $ = cheerio.load(html);
    var checks = loadChecks(CHECKSFILE_DEFAULT).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);
}

var checkURLFile = function (url){
    restler.get(url).on('complete', function(response) {
	if (response instanceof Error) {
	    console.log('Error: ' + response.message);
	    process.exit(1);
	} else {
	    checkHtmlURL(response);
	}
    });
};

var clone = function(fn) {
    return fn.bind({});
};

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'URL to parse')
	.parse(process.argv);
    //check if url or file
    if(program.url) {
	var checkJson = checkURLFile(program.url, program.checks);
    } else {
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }

} else {
    exports.checkHtmlFile = checkHtmlFile;
}
