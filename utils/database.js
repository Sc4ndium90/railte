const mysql = require('mysql2')
const _ = require('lodash')

const connection = mysql.createPool({
    host: 'HOST',
    user: 'USER',
    password: 'PASSWORD',
    database: 'DB',
    waitForConnections: true,
    connectionLimit: 25,
    queueLimit: 0
});

function checkAndUpdateDatabase(journeysWithDisruptions) {

    for (const journey of journeysWithDisruptions) {

        connection.query(
            `SELECT * FROM journeys WHERE id='${journey.codes[0]['value']}'`,
            (error, results) => {
                if (error) {
                    console.error('Error querying database:', error)
                    return
                }

                // If the table doesn't contain the info, insert it.
                if (results.length > 0) {
                    updateIfJourneyChanged(results[0], journey)
                } else {
                    insertJourney(journey)
                }
            }
        )


    }

}

function insertJourney(journey) {
    let query

    if (!_.isEmpty(journey.disruption)) { // if the journey have a disruption
        query =
            `INSERT INTO journeys SET id='${journey.codes[0].value}', disruption_id='${journey.disruptions[0].id}', severity_effect='${journey.disruption.severity.effect}',${journey.disruption.messages[0].text.length > 0 ? `message='${journey.disruption.messages[0].text}',`: ""}disruption_status='${journey.disruption.status}',journey='${JSON.stringify(journey)}'`
    } else {
        query =
            `INSERT INTO journeys SET id='${journey.codes[0].value}',journey='${JSON.stringify(journey).replace(/[\\$'"]/g, "\\$&")}'`
    }

    connection.query(
        query,
        (error, _) => {
            if (error) {
                console.error('Error inserting journey in database', error)
                return
            }

            console.log(`${journey.codes[0].value} ajouté à la base de données`)
        }
    )
}

function updateIfJourneyChanged(oldJourney, newJourney) {

    if (oldJourney.disruption_status != newJourney.disruption.status) {
        query =
            `UPDATE journeys SET disruption_id='${newJourney.disruptions[0].id}', severity_effect='${newJourney.disruption.severity.effect}',${newJourney.disruption.messages[0].text.length > 0 ? `message='${newJourney.disruption.messages[0].text}',`: ""}disruption_status='${newJourney.disruption.status}',journey='${JSON.stringify(newJourney).replace("'", "''")}' WHERE id='${oldJourney.id}'`

        connection.query(
            query,
            (error, _) => {
                if (error) {
                    console.error('Error updating journey in database', error)
                    return
                }

                console.log(`${oldJourney.id} mis à jour`)
            }
        )

    }



}

module.exports = { checkAndUpdateDatabase }