import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SearchExpenses = ({ setExpenses }) => {
    const [query, setQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${API_URL}/search?q=${query}`);
            setExpenses(response.data);
        } catch (error) {
            console.error('Error searching expenses', error);
        }
    };

    return (
        <div>
            <h2>Search Expenses</h2>
            <form onSubmit={handleSearch}>
                <div>
                    <label>Search:</label>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default SearchExpenses;
