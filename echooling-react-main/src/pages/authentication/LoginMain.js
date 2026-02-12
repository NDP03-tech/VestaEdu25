import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import config from '../../config';
const LoginMain = ({ onLogin, setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [redirectToDashboard, setRedirectToDashboard] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await axios.post(`${config.API_URL}/api/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setIsLoggedIn(true);
            onLogin();
            setRedirectToDashboard(true); // <-- Trigger redirect
        } catch (err) {
            console.log('Lỗi đăng nhập:', err);
            setMessage(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    if (redirectToDashboard) {
        const role = localStorage.getItem('role');
        return <Navigate to={role === 'admin' ? '/admin' : '/user'} />;
    }

    return (
        <div className="react-login-page react-signup-page pt---120 pb---120">
            <div className="container">
                <div className="row">                            
                    <div className="col-lg-12">
                        <div className="login-right-form">
                            <form onSubmit={handleLogin}>
                                <div className="login-top">
                                    <h3>Đăng Nhập</h3>
                                    <p>Chưa có tài khoản? </p>
                                </div>
                                <div className="mb-3">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        placeholder="Email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Mật Khẩu</label>
                                    <input 
                                        type="password" 
                                        placeholder="Mật Khẩu" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Đăng Nhập</button>
                                {message && <p className="text-danger">{message}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginMain;
