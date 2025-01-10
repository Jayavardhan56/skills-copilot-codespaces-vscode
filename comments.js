// create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    const method = req.method;
    const urlParsed = url.parse(req.url, true);

    if (urlParsed.pathname === '/comments' && method === 'GET') {
        fs.readFile('./comments.json', 'utf-8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Server error');
                return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        });
    }

    if (urlParsed.pathname === '/comments' && method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const newComment = querystring.parse(body);

            fs.readFile('./comments.json', 'utf-8', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end('Server error');
                    return;
                }

                const comments = JSON.parse(data);

                comments.push(newComment);

                fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Server error');
                        return;
                    }

                    res.end('OK');
                });
            });
        });
    }
});

server.listen(3000, () => {
    console.log('Server is running');
});