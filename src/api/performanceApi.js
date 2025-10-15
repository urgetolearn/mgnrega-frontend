import axios from "axios";

export const fetchPerformance = async (state, district, year) => {
    try {
        const res = await axios.get(
            `http://localhost:5000/api/mgnrega/${state}/${district}/${year}`
        );
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
