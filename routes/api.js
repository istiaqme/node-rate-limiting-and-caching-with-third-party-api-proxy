const express = require('express');
const router = express.Router();
const needle = require('needle');
const url = require('url');
const apicache = require('apicache');

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

// Setup Cache
let cache = apicache.middleware;


router.get('/', cache('2 minute') , async (req, res) => {
    try { 
        const queryParams = new URLSearchParams({
            [API_KEY_NAME] : API_KEY_VALUE,
            ...url.parse(req.url, true).query,
        });
        console.log(queryParams)
        const apiRes = await needle('get', `${API_BASE_URL}?${queryParams}`);
        const data = apiRes.body;
        if(process.env.NODE_ENV !== "production"){
            console.log(`Outer Request: ${API_BASE_URL}?${queryParams}`);
        }
        res.status(200).json(data); 
    }
    catch(error){
        console.log(error);
    }
});

module.exports = router;