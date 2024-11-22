import { useState } from 'react';
import { Form, Input, Button, Select, Upload, InputNumber, message, DatePicker, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../config/axios';

const ConsignmentPage = () => {
    const [loading, setLoading] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedType, setSelectedType] = useState(null); // State to track the selected type
    const dailyCostOptions = {
        1: 100000,
        2: 150000,
        3: 250000,
        5: 500000
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    const [selectedPricePerDay, setSelectedPricePerDay] = useState(0);
    const [selectedPriceListId, setSelectedPriceListId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const calculateTotalCost = (start, end, pricePerDay) => {
        if (start && end && pricePerDay) {
            const days = end.diff(start, 'days') + 1;
            setTotalCost(days * pricePerDay);
        } else {
            setTotalCost(0);
        }
    };
    const handlePriceListChange = (value) => {
        const pricePerDay = dailyCostOptions[value] || 0;
        setSelectedPricePerDay(pricePerDay);
        calculateTotalCost(startDate, endDate, pricePerDay);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        calculateTotalCost(date, endDate, selectedPricePerDay);
    };

    const handleEndDateChange = (date) => {
        if (startDate && date.isBefore(startDate)) {
            message.error('End date cannot be earlier than the start date');
        } else {
            setEndDate(date);
            calculateTotalCost(startDate, date, selectedPricePerDay);
        }
    };

    const handleTypeChange = (value) => {
        setSelectedType(value);
    };

    const handleSubmit = async (values) => {
        if (startDate && endDate && endDate.isBefore(startDate)) {
            message.error('End date cannot be earlier than the start date');
            return;
        }
        if (selectedType === 1) {
            values.price = 0;
        }
        setLoading(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key === 'image' || key === 'originCertificate' || key === 'healthCertificate' || key === 'ownershipCertificate') {
                formData.append(key, value?.file);
            } else {
                formData.append(key, value);
            }
        });

        formData.append('priceListId', selectedPriceListId);
        formData.append('startDate', startDate ? startDate.toISOString() : '');
        formData.append('endDate', endDate ? endDate.toISOString() : '');
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                message.error('You must be logged in to consign.');
                return;
            }

            const response = await api.post('/Consignment/pending', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Consignment submitted successfully and is pending approval.');
            setTotalCost(0); // Reset total cost

            // Redirect to payment URL if available
            if (response.data && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            }
        } catch (error) {
            console.log(error)
            message.error('Failed to consign fish. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '2rem',
                background: 'linear-gradient(to bottom, #1a202c, #2d3748, #4a5568)',
            }}
        >
            <Form
                size="large"
                onFinish={handleSubmit}
                layout="vertical"
                style={{
                    width: '100%',
                    maxWidth: 1000,
                    backgroundColor: '#ffffff', // Form background color
                    padding: '2rem',
                    borderRadius: '8px', // Rounded corners
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for contrast
                }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please select a type' }]}>
                            <Select placeholder="Select type" onChange={handleTypeChange}>
                                <Select.Option value={0}>Sell</Select.Option>
                                <Select.Option value={1}>Foster</Select.Option>
                            </Select>
                        </Form.Item>
                        {selectedType === 0 && (
                            <Form.Item label="Desired Price (VND)" name="price" rules={[{ required: true, type: 'number', message: 'Please input a valid price' }]}>
                                <InputNumber placeholder="Enter price" style={{ width: '100%' }} />
                            </Form.Item>
                        )}
                        <Form.Item label="Foster Name" name="name" rules={[{ required: true, message: 'Please input the name' }]}>
                            <Input placeholder="Enter name" />
                        </Form.Item>

                        <Form.Item label="Foster Gender" name="gender" rules={[{ required: true, message: 'Please input the gender' }]}>
                            <Input placeholder="Enter gender" />
                        </Form.Item>

                        <Form.Item label="Foster Age" name="age" rules={[{ required: true, type: 'number', message: 'Please input a valid age' }]}>
                            <InputNumber placeholder="Enter age" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item label="Foster Size (cm)" name="size" rules={[{ required: true, type: 'number', message: 'Please input a valid size' }]}>
                            <InputNumber placeholder="Enter size" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item label="Price Per Day Option" name="priceListId" rules={[{ required: true, message: 'Please select a price per day option' }]}>
                            <Select placeholder="Select price per day option" onChange={handlePriceListChange}>
                                <Select.Option value={1}>100,000 VND/day</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Daily Feed Amount (grams)" name="dailyFeedAmount" rules={[{ required: true, type: 'number', message: 'Please input the daily feed amount' }]}>
                            <InputNumber placeholder="Enter daily feed amount" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item label="Foster Personality" name="personality" rules={[{ required: true, message: 'Please input the personality' }]}>
                            <Input placeholder="Enter personality" />
                        </Form.Item>

                        <Form.Item label="Foster Origin" name="origin" rules={[{ required: true, message: 'Please input the origin' }]}>
                            <Input placeholder="Enter origin" />
                        </Form.Item>

                        <Form.Item label="Foster Species" name="species" rules={[{ required: true, message: 'Please input the species' }]}>
                            <Input placeholder="Enter species" />
                        </Form.Item>

                        <Form.Item label="Foster Color" name="color" rules={[{ required: true, message: 'Please input the color' }]}>
                            <Input placeholder="Enter color" />
                        </Form.Item>

                        <Form.Item label="Foster Selection Rate" name="selectionRate">
                            <Input placeholder="Enter rate" />
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please select a start date' }]}>
                            <DatePicker onChange={handleStartDateChange} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item label="End Date" name="endDate" rules={[{ required: true, message: 'Please select an end date' }]}>
                            <DatePicker onChange={handleEndDateChange} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item label="Estimated Total Cost" colon={false}>
                            <span>{formatCurrency(totalCost)}</span>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Upload Image"
                                    name="image"
                                    valuePropName="file"
                                    rules={[{ required: true, message: 'Please upload an image' }]}
                                >
                                    <Upload beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label="Origin Certificate"
                                    name="originCertificate"
                                    valuePropName="file"
                                    rules={[{ required: true, message: 'Please upload the origin certificate' }]}
                                >
                                    <Upload beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Health Certificate"
                                    name="healthCertificate"
                                    valuePropName="file"
                                    rules={[{ required: true, message: 'Please upload the health certificate' }]}
                                >
                                    <Upload beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label="Ownership Certificate"
                                    name="ownershipCertificate"
                                    valuePropName="file"
                                    rules={[{ required: true, message: 'Please upload the ownership certificate' }]}
                                >
                                    <Upload beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Submit Consignment
                    </Button>
                </Form.Item>
            </Form>
        </div>

    );
};

export default ConsignmentPage;
