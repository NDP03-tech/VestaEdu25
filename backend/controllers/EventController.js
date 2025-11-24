const Event = require('../models/Event');
const cloudinary = require('../utils/cloudinaryConfig');

// Upload ảnh lên Cloudinary
const uploadImageToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
        });
        uploadStream.end(fileBuffer);
    });
};

// Tạo sự kiện mới
exports.createEvent = async (req, res) => {
    try {
        const eventData = req.body;

        // Upload ảnh nếu có
        if (req.file) {
            const imageUrl = await uploadImageToCloudinary(req.file.buffer);
            if (!imageUrl) return res.status(400).json({ message: 'Lỗi khi upload ảnh' });
            eventData.image = imageUrl;
        }

        // Kiểm tra bắt buộc
        if (!eventData.image) {
            return res.status(400).json({ message: 'Trường image là bắt buộc' });
        }

        const newEvent = await Event.create(eventData);

        res.status(201).json({ message: 'Sự kiện đã được tạo thành công', event: newEvent });
    } catch (error) {
        console.error('Lỗi khi tạo sự kiện:', error);
        res.status(400).json({ message: 'Lỗi khi tạo sự kiện', error: error.message });
    }
};

// Lấy sự kiện theo ID
exports.getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);
        if (!event) return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        res.status(200).json(event);
    } catch (error) {
        console.error('Lỗi khi lấy sự kiện:', error);
        res.status(500).json({ message: 'Lỗi khi lấy sự kiện', error: error.message });
    }
};

// Lấy tất cả sự kiện
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(events);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sự kiện:', error);
        res.status(500).json({ message: 'Lỗi khi lấy sự kiện', error: error.message });
    }
};

// Cập nhật sự kiện
exports.updateEvent = async (req, res) => {
    const { id } = req.params;

    try {
        let updatedData = req.body;

        if (req.file) {
            updatedData.image = await uploadImageToCloudinary(req.file.buffer);
        }

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        }

        const updatedEvent = await event.update(updatedData);

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        }

        res.status(200).json({ message: 'Sự kiện đã được cập nhật thành công', updatedEvent });
    } catch (error) {
        console.error('Lỗi khi cập nhật sự kiện:', error);
        res.status(400).json({ message: 'Lỗi khi cập nhật sự kiện', error: error.message });
    }
};

// Xóa sự kiện
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        }

        const deletedEvent = await event.destroy();
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Sự kiện không tồn tại' });
        }

        res.status(200).json({ message: 'Sự kiện đã được xóa thành công', deletedEvent });
    } catch (error) {
        console.error('Lỗi khi xóa sự kiện:', error);
        res.status(500).json({ message: 'Lỗi khi xóa sự kiện', error: error.message });
    }
};
