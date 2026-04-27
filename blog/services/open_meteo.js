const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

const COORDINATES = {
    SuchyDwor: {
        name: 'Suchy Dwór (Pomorskie)',
        latitude: 54.5744,
        longitude: 18.466
    }
};

function formatHourLabel(isoDateTime) {
    const date = new Date(isoDateTime);

    return date.toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function findNextHourIndex(hourlyTimes) {
    const now = new Date();
    const idx = hourlyTimes.findIndex(function (t) {
        const parsed = new Date(t);
        return !Number.isNaN(parsed.getTime()) && parsed >= now;
    });
    return idx < 0 ? 0 : idx;
}

export async function getCityForecast24h() {
    const place = COORDINATES.SuchyDwor;

    const params = new URLSearchParams({
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        hourly: 'temperature_2m,weather_code',
        timezone: 'auto',
        forecast_days: '2'
    });

    const response = await fetch(OPEN_METEO_URL + '?' + params.toString());

    const data = await response.json();
    const hourlyTimes = data && data.hourly && data.hourly.time ? data.hourly.time : [];
    const hourlyTemps = data && data.hourly && data.hourly.temperature_2m ? data.hourly.temperature_2m : [];

    const startIndex = findNextHourIndex(hourlyTimes);

    const next24Times = hourlyTimes.slice(startIndex, startIndex + 24);
    const next24Temps = hourlyTemps.slice(startIndex, startIndex + 24);

    return {
        cityName: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        currentTemperature: Number(next24Temps[0]),
        times: next24Times.map(formatHourLabel),
        temperatures: next24Temps.map(function (v) { return Number(v); })
    };
}
