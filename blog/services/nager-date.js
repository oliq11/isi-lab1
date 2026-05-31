import axios from 'axios';

const API_URL = 'https://date.nager.at/api/v3';

export const getHolidaysData = async (year = 2026, countryCode = 'PL') => {
    const response = await axios.get(`${API_URL}/PublicHolidays/${year}/${countryCode}`);
    const holidays = response.data;

    const globalHolidays = holidays.filter(h => h.global === true);

    const stats = globalHolidays.reduce((acc, h) => {
        const month = new Date(h.date).getMonth() + 1;
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    return {
        total: holidays.length,
        globalTotal: globalHolidays.length,
        holidays: globalHolidays,
        monthlyStats: stats
    };
};