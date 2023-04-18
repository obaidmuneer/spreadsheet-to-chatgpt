
const response = (msg, outputContext) => {
    let res = {}
    res.fulfillmentMessages = [{ "text": { "text": [msg] } }]
    if (outputContext && outputContext.length > 0) {
        res.outputContexts = outputContext;
    }
    return res;
}

export default { response }