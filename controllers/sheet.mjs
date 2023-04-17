import * as dotenv from 'dotenv';
import { GoogleSpreadsheet } from 'google-spreadsheet';

dotenv.config()

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS)
const PRIVATE_KEY = CREDENTIALS.private_key.split(String.raw`\n`).join('\n')

const doc = new GoogleSpreadsheet(process.env.SHEET_ID)

await doc.useServiceAccountAuth({
    client_email: CREDENTIALS.client_email,
    private_key: PRIVATE_KEY,
});

await doc.loadInfo();
const sheet = doc.sheetsByIndex[0];

const get_output = async (param, userInput) => {
    const rows = await sheet.getRows()

    for (const row of rows) {
        const { Parameter, Input, Output } = row;

        if (Parameter === param && Parameter === 'Alchohol level') {
            let input = Input.replace(/[<>]/g, "")
            let arr = input.split('-')
            input = +arr[0]
            if (userInput <= arr[arr.length - 1]) {
                console.log(input);
                return Output
            }
        } else if (['Correct level', 'Behind the wheel', 'First time'].includes(param) && Parameter === param && userInput === Input) {
            console.log(Input);
            console.log(Parameter);
            return Output
        }
    }
}

export default { get_output }

// await get_output('Alchohol level', 0.4)
// await get_output('First time', 'Yes')

