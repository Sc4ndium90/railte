const {fetchVehicleJourneysWithDisruptions, linkVehicleJourneysWithDisruptions} = require("./api/sncf");
const { checkAndUpdateDatabase } = require("./utils/database");

console.info("Start updating..")

fetchVehicleJourneysWithDisruptions()
    .then(res => {

        const journeys = res.data['vehicle_journeys'];
        const disruptions = res.data['disruptions'];

        linkVehicleJourneysWithDisruptions(journeys, disruptions)
            .then(r => {
                checkAndUpdateDatabase(r)

                setTimeout(function () {
                    console.info("Update done")
                    process.exit()
                }, 5000)
            })

    })