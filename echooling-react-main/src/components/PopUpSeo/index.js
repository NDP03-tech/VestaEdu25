import React from 'react';
import sampleImage from '../../assets/images/course/1.jpg'; // Thay bằng ảnh thực tế của bạn

const PopupMessage = ({ message, onClose }) => {
    return (
        // Overlay che toàn bộ màn hình
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[99999]" 
            onClick={onClose} // Đóng popup khi bấm vào overlay
        >
            {/* Chặn sự kiện click lan vào overlay */}
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative"
                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan ra ngoài
            >
                {/* Nút đóng (X) */}
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-black text-lg"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Nội dung pop-up */}
                <div className="flex flex-col items-center text-center">
                    <img src={sampleImage} alt="Promo" className="w-full rounded-md mb-4" />
                    <h2 className="text-2xl font-bold">{message.title}</h2>
                    <p className="text-gray-700 mt-2">{message.description}</p>

                    {/* Form nhập email */}
                    <input
                        type="email"
                        placeholder="Enter Email Address"
                        className="mt-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    
                    {/* Nút hành động */}
                    <button className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
                        Get My Coupon
                    </button>

                    <button className="mt-2 text-sm text-gray-600 underline" onClick={onClose}>
                        No thanks, just let me shop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupMessage;
