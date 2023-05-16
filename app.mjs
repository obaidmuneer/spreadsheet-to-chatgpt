import express from "express";
import * as sheet from "./controllers/sheet.mjs";
import utils from "./helpers/utils.mjs";
import { makeChain } from "./helpers/make-chain.mjs";
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
    const session = body.session
    const intentName = body.queryResult.intent.displayName
    const query = body.queryResult.queryText
    const params = body.queryResult.parameters
    console.log(intentName);
    console.log(query);
    console.log(params);

    let response = {}

    try {
        switch (intentName) {
            case 'Default Fallback Intent':
                response = {
                    "followupEventInput": {
                        "name": "chat",
                    }
                }
                break;
            case 'chat':
                // const res = await makeChain('alcohol level is 2.3')
                response = utils.response('hi')
                // console.log(res.text);
                break;
            default:
                response = utils.response(`I could not undersatnd what you said please repeat again`)
                break;
        }
    } catch (error) {
        console.log(error);
        response('Something went wrong.')
    }

    // try {
    //     switch (intentName) {
    //         case 'First time - yes':
    //             const output_yes = await sheet.get_output('First time', 'Yes')
    //             response = utils.response(`${output_yes} What was the alcohol level?`)
    //             break;
    //         case 'First time - no':
    //             const output_no = await sheet.get_output('First time', 'No')
    //             response = utils.response(`${output_no} What was the alcohol level?`)
    //             break;
    //         case 'Alchohol level':
    //         case 'Alchohol level followup':
    //             const output_level = await sheet.get_output('Alchohol level', params.level)
    //             response = utils.response(`${output_level}`)
    //             console.log(output_level);
    //             break;
    //         default:
    //             response = utils.response(`I could not undersatnd what you said please repeat again`)
    //             break;
    //     }
    // } catch (error) {
    //     console.log(error);
    //     response('Something went wrong.')
    // }
    res.send(response)

})

app.listen(PORT, () => console.log('server is running on port ' + PORT))