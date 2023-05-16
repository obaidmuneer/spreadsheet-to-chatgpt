import { OpenAI } from "langchain/llms/openai";
import { loadQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { rows_to_json } from "../controllers/sheet.mjs";
import { RetrievalQAChain } from "langchain/chains";

const question_template = `You are an AI assistant. Analyze the user's question using the parameters and input mentioned within angle brackets. If you cannot find a relevant answer, politely state "It's not mentioned in the context." If the user's query matches a parameter and input from the given context, deliver the corresponding response enclosed within triple backticks as it is; do not modify the response.

Context examples:
<Parameter: Alcohol Level, Input: 1> Response: example 1
<Parameter: Alcohol Level, Input: 2> Response: example 2
<Parameter: First Time, Input: Yes> Response: example First Time Yes
<Parameter: Correct Level, Input: No> Response: example Correct Level No

If a user says:
"Alcohol level is 1" - LLM should respond with: "example 1"
"Alcohol level is 3" - LLM should respond with: "It's not mentioned in the context"

Context:{context}
Question:{question}
Your Answer:
`

export const makeChain = async (query) => {
    const docs = await rows_to_json()
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    const model = new OpenAI({ temperature: 0, verbose:true })

    const question_chain = loadQAChain(model, { prompt: PromptTemplate.fromTemplate(question_template) });
    // console.log(question_chain);

    const chain = new RetrievalQAChain({
        combineDocumentsChain: question_chain,
        retriever: vectorStore.asRetriever(),
    });
    // console.log(chain);
    const res = await chain.call({
        query,
    });
    return res
}

const res = await makeChain('alcohol level is 12')
console.log(res);


/// other working examples ///////////

/////////ConversationalRetrievalQAChain
// const docs = await rows_to_json()
// const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

import { ConversationalRetrievalQAChain } from "langchain/chains";

// const model = new OpenAI({ temperature: 0, verbose: true })

// const chain = ConversationalRetrievalQAChain.fromLLM(
//     model,
//     vectorStore.asRetriever(),
//     { qaTemplate: question_template }
// );
// console.log(chain);
// const res = await chain.call({ question: 'Alchohol level is 11', chat_history: [] });
// console.log(res);



//////////// ChatVectorDBQAChain
import { ChatVectorDBQAChain } from "langchain/chains";


// const model = new OpenAI({ temperature: 0, verbose: true })

// const question_chain = loadQAChain(model, { prompt: PromptTemplate.fromTemplate(question_template) });
// const vectorChain = new ChatVectorDBQAChain({
//     vectorstore: vectorStore,
//     combineDocumentsChain: question_chain,
//     // returnSourceDocuments: true,
// })
// console.log(vectorChain);
// const res = await vectorChain.call({
//     question: 'if parameter is Alcohol level and input is 12',
//     chat_history: []
// })
// console.log(res);
