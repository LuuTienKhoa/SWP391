import React, { useState, useEffect } from 'react';
import api from '../../config/axios';  // Assuming Axios is configured

function ConsignmentPage() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        type: '',  // Sell (0) or Foster (1)
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
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
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

            // Call the backend to submit the consignment
            const response = await api.post('/Consignment/Pending', null, {
                params: {
                    type: formData.type, // 0 sell ; 1 foster
                    name: formData.name,
                    gender: formData.gender,
                    age: formData.age,
                    size: formData.size,
                    color: formData.color,
                    dailyFeedAmount: formData.dailyFeedAmount,
                    personality: formData.personality,
                    origin: formData.origin,
                    selectionRate: formData.selectionRate,
                    species: formData.species,
                    fosteringDays: formData.fosteringDays,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setSuccessMessage('Consignment submitted successfully and is pending approval.');
                // Reset form after successful submission
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
        { label: 'Foster Species', name: 'species', type: 'text' },
        { label: 'Fostering Days', name: 'fosteringDays', type: 'number' },
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
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required={field.required}
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
