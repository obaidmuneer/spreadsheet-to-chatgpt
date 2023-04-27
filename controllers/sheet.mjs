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

const parseNumber = (Input) => {
    let input = Input.replace(/[<>]/g, "")
    let arr = input.split('-')
    return { arr, input: +arr[0] }
}

const findBigNum = (rows) => {
    return rows.reduce((prevNum, row) => {
        const { input } = parseNumber(row.Input)
        if (!isNaN(input)) {
            return input > prevNum ? input : prevNum;
        } else {
            return prevNum;
        }
    }, 0);
}

const get_output = async (param, userInput) => {
    const rows = await sheet.getRows()
    const biggestNumber = findBigNum(rows)

    for (const row of rows) {
        const { Parameter, Input, Output } = row;

        if (Parameter === param && Parameter === 'Alchohol level') {
            const { arr, input } = parseNumber(Input)

            if (userInput <= arr[arr.length - 1]) {
                if (userInput === 0.5 && arr.length === 2) {
                    return Output
                } else if (userInput !== 0.5) {
                    return Output
                }
            } else if (userInput > arr[arr.length - 1] && input === biggestNumber) {
                console.log('2nd else');
                return Output
            }
        }
        if (['Correct level', 'Behind the wheel', 'First time'].includes(param) && Parameter === param && userInput === Input) {
            // console.log(Input);
            // console.log(Parameter);
            return Output
        }
    }
}

export default { get_output }

// console.log(await get_output('Alchohol level', 5))
// console.log(await get_output('First time', 'Yes'));

