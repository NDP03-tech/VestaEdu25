const Post = require('../models/Blog');

// Tạo bài viết mới
exports.createPost = async (req, res) => {
    try {
        const { title, content, author, authorImg, image, bannerImg } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!title || !content || !author || !authorImg || !image || !bannerImg) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const newPost = await Post.create({
            title,
            content,
            author,
            authorImg,
            image,
            bannerImg
        });
        res.status(201).json({ message: 'Bài viết đã được tạo thành công', post: newPost });
    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
        res.status(500).json({ message: 'Lỗi khi tạo bài viết', error: error.message });
    }
};

// Lấy bài viết theo ID
exports.getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        res.status(500).json({ message: 'Lỗi khi lấy bài viết', error: error.message });
    }
};

// Lấy tất cả bài viết
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        res.status(500).json({ message: 'Lỗi khi lấy bài viết', error: error.message });
    }
};

// Cập nhật bài viết
exports.updatePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        const updatedPost = await post.update(req.body);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.status(200).json({ message: 'Bài viết đã được cập nhật thành công', updatedPost });
    } catch (error) {
        console.error('Lỗi khi cập nhật bài viết:', error);
        res.status(400).json({ message: 'Lỗi khi cập nhật bài viết', error: error.message });
    }
};

// Xóa bài viết
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        const deletedPost = await post.destroy();
        if (!deletedPost) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.status(200).json({ message: 'Bài viết đã được xóa thành công', deletedPost });
    } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
        res.status(500).json({ message: 'Lỗi khi xóa bài viết', error: error.message });
    }
};
