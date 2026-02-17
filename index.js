import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const upload = multer();

// Store blogs in memory (or use a database)
let blogs = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(upload.none()); 

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs', { blogs });
});

app.post('/posts', (req, res) => {
    console.log(req.body);
    const newBlog = {
        content: req.body.content,
        timestamp: new Date()
    };
    console.log('New blog post received:', req.body.content);
    blogs.unshift(newBlog); // Add to beginning
    res.redirect('/');
});

app.put('/posts/:id', (req, res) => {
    const blogId = req.params.id;
    const updatedContent = req.body.content;
    const blogIndex = blogs.findIndex(blog => blog._id === blogId);
    if (blogIndex !== -1) {
        blogs[blogIndex].content = updatedContent;
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Blog post not found' });
    } 
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});