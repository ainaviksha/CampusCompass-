import { useState, useEffect } from 'react';
import api from '../utils/api';
import { COLLEGE_DATA as STATIC_DATA } from '../data/colleges';

const useColleges = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        let ignore = false;

        const fetchColleges = async () => {
            try {
                const response = await api.get('/colleges', {
                    signal: controller.signal,
                });
                if (!ignore) {
                    if (response.data && response.data.length > 0) {
                        setColleges(response.data);
                    } else {
                        setColleges([]);
                    }
                }
            } catch (err) {
                if (!ignore && err.name !== 'CanceledError') {
                    console.warn("API fetch failed, falling back to static data", err);
                    setColleges(STATIC_DATA);
                    setError(err);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchColleges();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, []);

    return { colleges, loading, error };
};

export default useColleges;
