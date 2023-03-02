const {getSinceDate} = require("../utils/date");
const {sncf_token} = require("../config.json")
const axios = require("axios");

async function fetchVehicleJourneysWithDisruptions() {

    const time = getSinceDate()

    //Replace ##LINE## with the line id
    return await axios.get(`https://api.sncf.com/v1/coverage/sncf/lines/##LINE##/vehicle_journeys?count=50&since=${time}`, {
        auth: {
            username: sncf_token,
            password: ''
        }
    });

}

/*
 * Create a new array by combining vehicle journeys with their disruptions if they have one
 */
async function linkVehicleJourneysWithDisruptions(vehicleJourneys, disruptions) {

    return Array.from(new Set(vehicleJourneys.map(journey => journey.id)))
        .map(id => {
            const journey = vehicleJourneys.find(journey => journey.id === id);
            let disruption
            if (journey['disruptions'].length !== 0)
                disruption = disruptions.find(disruption => disruption['id'] === journey['disruptions'][0]['id']);
            else disruption = {}
            return { ...journey, disruption };
        });

}

module.exports = { fetchVehicleJourneysWithDisruptions, linkVehicleJourneysWithDisruptions }