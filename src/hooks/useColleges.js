import { useState, useEffect } from 'react';
import api from '../utils/api';
import { COLLEGE_DATA as STATIC_DATA } from '../data/colleges';

const useColleges = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                // Try fetching from API
                const response = await api.get('/colleges');
                if (response.data && response.data.length > 0) {
                    setColleges(response.data);
                } else {
                    // Fallback if API returns empty (e.g. fresh DB before seed)
                    // But we seeded, so it should be fine.
                    // For safety, fallback to static?
                    // Let's fallback only if error.
                    setColleges([]);
                }
            } catch (err) {
                console.warn("API fetch failed, falling back to static data", err);
                // Fallback to static data
                setColleges(STATIC_DATA);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchColleges();
    }, []);

    return { colleges, loading, error };
};

export default useColleges;
