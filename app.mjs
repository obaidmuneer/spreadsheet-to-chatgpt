import express from "express";
import sheet from "./controllers/sheet.mjs";
import utils from "./helpers/utils.mjs";

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        messege: 'This is the server',
    })
})

app.post('/webhook', async (req, res) => {
    const body = req.body
    const intentName = body.queryResult.intent.displayName
    console.log(intentName);
    const params = body.queryResult.parameters
    console.log(params);

    let response = {}

    try {
        switch (intentName) {
            case 'First time - yes':
                const output_yes = await sheet.get_output('First time', 'Yes')
                response = utils.response(`${output_yes} What was the alcohol level?`)
                break;
            case 'First time - no':
                const output_no = await sheet.get_output('First time', 'Yes')
                response = utils.response(`${output_no} What was the alcohol level?`)
                break;
            case 'Alchohol level':
            case 'Alchohol level followup':
                const output_level = await sheet.get_output('Alchohol level', params.level)
                response = utils.response(`${output_level}`)
                console.log(output_level);
                break;
            default:
                response = utils.response(`I could not undersatnd what you said please repeat again`)
                break;
        }
    } catch (error) {
        console.log(error);
        response('Something went wrong.')
    }
    res.send(response)

})

app.listen(PORT, () => console.log('server is running on port ' + PORT))