// discord.js import
const Discord = require('discord.js');

// cron job for scheduled messages
const cron = require('cron');

// node-fetch for making HTTP requests
const fetch = require('node-fetch');

const keepAlive = require('./server');
// standard https for api call
const https = require('https');

// initialize client
const client = new Discord.Client();

// WOTD API URL
const API_URL = `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${wordToken}`;

// general channel
let generalChannel = "886743182589689939";

// wordOfTheDay channel
let wordChannel = "891918810305667094";

let plum = '#c691e9';

function getWord(){
		return fetch(API_URL)
		.then(res => {
				return res.json();
		})
		.then(data => {
				return data;
		})
}

function getPronunciation(word){
		return fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}/pronunciation`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
				"x-rapidapi-key": rapidToken
			}
		})
		.then(res => {
				return res.json();
		})
		.then(data => {
				return data;
		})
}

let scheduledWordMessage = new cron.CronJob('00 14 * * *', () => {
			getWord().then( word => {
			getPronunciation(word.word).then( pronunciation => {
					let wordEmbed = new Discord.MessageEmbed();
					if(pronunciation.success){
							wordEmbed.setColor(plum)
							.setTitle('The word of the day is:  ' + word.word + ` ( ${pronunciation} )`)
							.setThumbnail('https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/1024/dictionary-icon.png')
							.addField('Part of Speech: ', word.definitions[0].partOfSpeech, false)
							.addField('Definition: ', word.definitions[0].text, true)
							.addField('Example: ', word.examples[0].text, false)
							.setFooter('Try to work this word into conversation at least 3 times today!')
					}else{
							wordEmbed.setColor(plum)
							.setTitle('The word of the day is:  ' + word.word + ` ( ${pronunciation} )`)
							.setThumbnail('https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/1024/dictionary-icon.png')
							.addField('Part of Speech: ', word.definitions[0].partOfSpeech, false)
							.addField('Definition: ', word.definitions[0].text, true)
							.addField('Example: ', word.examples[0].text, false)
							.setFooter('Try to work this word into conversation at least 3 times today!')
					}
					client.channels.cache.get(wordChannel).send(wordEmbed);
				})
			})
});

// log out some info
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', function(message) {
    // ignore messages from the bot itself
    if (message.author.bot) {
				return;
    }

		if(message.content == "!wotd"){
			getWord().then( word => {
				getPronunciation(word.word).then( pronunciation => {
					let wordEmbed = new Discord.MessageEmbed();
					if(pronunciation.success){
							wordEmbed.setColor(plum)
							.setTitle('The word of the day is:  ' + word.word + ` ( ${pronunciation} )`)
							.setThumbnail('https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/1024/dictionary-icon.png')
							.addField('Part of Speech: ', word.definitions[0].partOfSpeech, false)
							.addField('Definition: ', word.definitions[0].text, true)
							.addField('Example: ', word.examples[0].text, false)
							.setFooter('Try to work this word into conversation at least 3 times today!')
					}else{
							wordEmbed.setColor(plum)
							.setTitle('The word of the day is:  ' + word.word)
							.setThumbnail('https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/1024/dictionary-icon.png')
							.addField('Part of Speech: ', word.definitions[0].partOfSpeech, false)
							.addField('Definition: ', word.definitions[0].text, true)
							.addField('Example: ', word.examples[0].text, false)
							.setFooter('Try to work this word into conversation at least 3 times today!')
					}
					client.channels.cache.get(wordChannel).send(wordEmbed);
				})
			})
		}

		if(message.content == '!wotdHelp'){
				let embed = new Discord.MessageEmbed();
				embed.setColor(yellow)
				.setTitle('Here are the active commands for the WOTD Bot:  ')
				.setThumbnail('https://icon-library.com/images/help-icon-png/help-icon-png-26.jpg')
				.addField('!wotdHelp: ', 'displays the active commands and a link to the doccumentation.', false)
				.addField('!wotd: ', 'returns the word of the day and all available information about the word.', false)
				.setURL('https://wotdbot.xyz/documentation')
				.setFooter('Please refer to the documentation at "https://wotdbot.xyz" if you require further assistance.')
				client.channels.cache.get(wordChannel).send(wordEmbed);
		}
});
keepAlive();
scheduledWordMessage.start();
client.login(process.env.TOKEN);