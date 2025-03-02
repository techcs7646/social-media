const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let mediaContent = [];

// Function to load media content from FakeStore API
const loadMediaContent = async () => {
    const fetch = (await import('node-fetch')).default; // Dynamic import
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();

        mediaContent = products.map(product => ({
            id: product.id,
            title: product.title,
            likes: 0,
            comments: [],
            image: product.image,
        }));

        console.log('Media content loaded from FakeStore API');
    } catch (error) {
        console.error('Error loading media content:', error);
    }
};

// Fetch media content on server start
loadMediaContent();

app.get('/media', (req, res) => {
    res.send(mediaContent);
});

app.post('/media/:id/like', (req, res) => {
    const mediaId = parseInt(req.params.id);
    const media = mediaContent.find(m => m.id === mediaId);

    if (media) {
        media.likes += 1;
        res.json({ message: 'Liked!', media });
    } else {
        res.status(404).json({ message: 'Media not found' });
    }
});

app.post('/media/:id/comment', (req, res) => {
    const mediaId = parseInt(req.params.id);
    const { comment } = req.body;
    const media = mediaContent.find(m => m.id === mediaId);

    if (media && comment) {
        media.comments.push(comment);
        res.json({ message: 'Comment added!', media });
    } else {
        res.status(404).json({ message: 'Media not found or comment missing' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
