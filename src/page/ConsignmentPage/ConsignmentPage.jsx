import React, { useState } from 'react';

function ConsignmentPage() {
    const [fishName, setFishName] = useState('');
    
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to send data to backend
    };

    return (
        <div>
            <h1>Ký Gửi Cá Koi</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên Cá:</label>
                    <input type="text" value={fishName} onChange={(e) => setFishName(e.target.value)} />
                </div>
                <div>
                    <label>Kích Thước:</label>
                    <input type="text" value={size} onChange={(e) => setSize(e.target.value)} />
                </div>
                <div>
                    <label>Giá:</label>
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                    <label>Hình Ảnh:</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <button type="submit">Ký Gửi</button>
            </form>
        </div>
    );
}

export default ConsignmentPage;
