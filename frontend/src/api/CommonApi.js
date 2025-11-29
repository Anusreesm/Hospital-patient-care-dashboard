export const GetAllCountries = async () => {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json"
        );

        const data = await response.json();

        return data.map(country => ({
            name: country.name,
            states: country.states?.map(s => ({ name: s.name })) || []
        }));
    } catch (error) {
        console.error("Error fetching countries:", error);
        return [];
    }
};
