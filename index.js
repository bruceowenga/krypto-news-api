const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const articles = [];

const sources = [
    // {
    //     name: 'coindesk',
    //     address: 'https://www.coindesk.com/',
    // },
    {
        name: 'cnbc',
        address: 'https://www.cnbc.com/cryptoworld/',
        base: ''
    },
    {
        name: 'cointelegraph',
        address: 'https://cointelegraph.com/',
        base: ''
    }
]

sources.forEach(source => {
    axios.get(source.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("crypto")', html).each(function(){
                const title = $(this).text();
                const url = $(this).attr('href');

                articles.push({ 
                    title, 
                    url: source.base + url, 
                    source: source.name });
            })
        })
})



app.get('/', (req, res) => {
    res.json("Welcome to Kryoto News Api")});

app.get('/news', (req, res) => {
    res.json(articles)});

app.get('/news/:sourceId', async (req, res) => {
    const sourceId = req.params.sourceId;

    const articleAddress = sources.filter(source => source.name == sourceId)[0].address
    const articelBase = sources.filter(source => source.name == sourceId)[0].base
    
    axios.get(articleAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificArticles = [];

            $('a:contains("crypto")', html).each(function(){
                const title = $(this).text();
                const url = $(this).attr('href');

                specificArticles.push({ 
                    title, 
                    url: articelBase + url, 
                    source: sourceId 
                });
            })
            res.json(specificArticles)
        }).catch(err => console.log(err)) 
            
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
