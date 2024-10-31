import React, { useState } from 'react';
import api from '../../config/axios';

function ConsignmentPage() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        type: '',
        name: '',
        gender: '',
        age: '',
        size: '',
        color: '',
        dailyFeedAmount: '',
        personality: '',
        origin: '',
        selectionRate: '',
        species: '',
        fosteringDays: '',
        image: null,
        originCertificate: null,
        healthCertificate: null,
        ownershipCertificate: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setErrorMessage('You must be logged in to consign.');
                return;
            }

            // Create FormData object for file upload
            const formDataObj = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataObj.append(key, value);
            });

            const response = await api.post('/Consignment/pending', formDataObj, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setSuccessMessage('Consignment submitted successfully and is pending approval.');
                setFormData({
                    type: '',
                    name: '',
                    gender: '',
                    age: '',
                    size: '',
                    color: '',
                    dailyFeedAmount: '',
                    personality: '',
                    origin: '',
                    selectionRate: '',
                    species: '',
                    fosteringDays: '',
                    image: null,
                    originCertificate: null,
                    healthCertificate: null,
                    ownershipCertificate: null,
                });
            }
        } catch (error) {
            console.error('Error consigning fish:', error);
            setErrorMessage('Failed to consign fish. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formFields = [
        { label: 'Type', name: 'type', type: 'select', options: [{ value: 0, label: 'Sell' }, { value: 1, label: 'Foster' }], required: true },
        { label: 'Foster Name', name: 'name', type: 'text', required: true },
        { label: 'Foster Gender', name: 'gender', type: 'text', required: true },
        { label: 'Foster Age', name: 'age', type: 'number', required: true },
        { label: 'Foster Size (cm)', name: 'size', type: 'number' },
        { label: 'Foster Color', name: 'color', type: 'text' },
        { label: 'Daily Feed Amount (grams)', name: 'dailyFeedAmount', type: 'number' },
        { label: 'Foster Personality', name: 'personality', type: 'text' },
        { label: 'Foster Origin', name: 'origin', type: 'text' },
        { label: 'Foster Species', name: 'species', type: 'text' ,required: true},
        { label: 'Fostering Days', name: 'fosteringDays', type: 'number' },
        { label: 'Upload Image', name: 'image', type: 'file', accept: 'image/*' },
        { label: 'Origin Certificate', name: 'originCertificate', type: 'file', accept: 'image/*' },
        { label: 'Health Certificate', name: 'healthCertificate', type: 'file', accept: 'image/*' },
        { label: 'Ownership Certificate', name: 'ownershipCertificate', type: 'file', accept: 'image/*' },
    ];

    return (
        <>
            <h1 className="text-5xl font-bold text-center text-gray-800 bg-gray-100">Consign Koi</h1>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {formFields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-left text-gray-700 font-medium mb-2">{field.label}:</label>
                                {field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required={field.required}
                                    >
                                        <option value="">Select {field.label}</option>
                                        {field.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        name={field.name}
                                        type={field.type}
                                        value={field.type === 'file' ? undefined : formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required={field.required}
                                        accept={field.accept}
                                    />
                                )}
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            {loading ? 'Consigning...' : 'Submit Consignment'}
                        </button>
                    </form>

                    {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
                    {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
                </div>
            </div>
        </>
    );
}

export default ConsignmentPage;
