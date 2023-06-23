const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Set the response headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Handle requests for the HTML file
    if (req.url === '/Flagv3.html') {
        const filePath = path.join(__dirname, 'Flagv3.html');
        fs.readFile(filePath, 'utf8', (err, html) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading HTML file');
                return;
            }
            res.statusCode = 200;
            res.end(html);
        });
    } else if (req.url === '/leader.html') {
        const leaderboardPath = path.join(__dirname, 'leader.html');
        fs.readFile(leaderboardPath, 'utf8', (err, html) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading HTML file');
                return;
            }
            res.statusCode = 200;
            res.end(html);
        });
    } else if (req.url === '/get_leaderboard') {
        const filePath = path.join(__dirname, 'leaderboard/leaderboard.txt');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error reading leaderboard file');
                return;
            }
            const lines = data.split('|');
            const leaderboard = lines.map(line => {
                const [username, score] = line.split(':');
                return { username, score };
            });

            // Sort leaderboard by score in descending order
            leaderboard.sort((a, b) => b.score - a.score);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(leaderboard.map(entry => `${entry.username}: ${entry.score}`).join('\n'));
        });
    } else if (req.method === 'POST' && req.url === '/submit_score') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const jsonData = JSON.parse(body);
            const user_name = jsonData.user_name;
            const user_score = jsonData.user_high_score;
            const dataToWrite = `|${user_name}:${user_score}`;
            // Write the received data to the file
            fs.appendFile('leaderboard/leaderboard.txt', dataToWrite, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    res.statusCode = 500;
                    res.end('Error writing to file');
                } else {
                    console.log('File written successfully');
                    res.statusCode = 200;
                    res.end('File written successfully');
                }
            });
        });
    } else {
        // Handle other requests (e.g., CSS, JS files)
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end('File not found');
                return;
            }
            // Set the appropriate Content-Type header based on the file extension
            const ext = path.extname(filePath);
            let contentType = 'text/html';
            if (ext === '.css') {
                contentType = 'text/css';
            } else if (ext === '.js') {
                contentType = 'text/javascript';
            }

            res.setHeader('Content-Type', contentType);
            res.statusCode = 200;
            res.end(data);
        });
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
