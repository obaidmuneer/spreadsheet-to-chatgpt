
const response = (msg, outputContext) => {
    res = {}
    res.fulfillmentMessages = [{ "text": { "text": [msg] } }]
    if (outputContext && outputContext.length > 0) {
        res.outputContexts = outputContext;
    }
}

export default { response }