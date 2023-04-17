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
        if (intentName === 'IntenName') {
            const output = await sheet.get_output(params.Parameter, params.Input)
            response = utils.response(`${output}`)
        }
    } catch (error) {
        console.log(error);
        response('Something went wrong.')
    }
    res.send(response)

})

app.listen(PORT, () => console.log('server is running on port ' + PORT))