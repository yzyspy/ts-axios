import * as readline from "readline";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, BaseMessage } from "@langchain/core/messages";
import {
    StateGraph,
    START,
    END,
    MessagesAnnotation,
    MemorySaver, // 1. 导入 MemorySaver
} from "@langchain/langgraph";

const StateAnnotation = MessagesAnnotation;

const llm = new ChatOpenAI({
    model: "deepseek-chat",
    apiKey: "sk-eaeb40d260ee4f61987036fafbd376d9",
    configuration: {
        baseURL: "https://api.deepseek.com",
    },
});

async function chatbot(state: typeof StateAnnotation.State) {
    const response = await llm.invoke(state.messages);
    return { messages: [response] };
}

// 2. 创建一个 MemorySaver 实例，作为图的检查点
const checkpointer = new MemorySaver();

const graphBuilder = new StateGraph(StateAnnotation)
    .addNode("chatbot", chatbot)
    .addEdge(START, "chatbot")
    .addEdge("chatbot", END);

// 3. 编译图时传入 checkpointer，使图具备记忆能力
const graph = graphBuilder.compile({ checkpointer });

// 4. 在流式运行函数中，通过 config 传入固定的 thread_id
async function streamGraphUpdates(userInput: string, threadId: string) {
    // 将 thread_id 放入 config 中
    const config = { configurable: { thread_id: threadId } };

    const events = await graph.stream(
        {
            messages: [new HumanMessage(userInput)],
        },
        config // 传入带有 thread_id 的配置
    );

    for await (const event of events) {
        for (const value of Object.values(event)) {
            const messages = (value as { messages?: BaseMessage[] }).messages;
            if (messages && messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                console.log("Assistant:", lastMessage.content);
            }
        }
    }
}

async function run() {
    console.log(
        "LangGraph + DeepSeek 聊天机器人启动（已启用短期记忆）！输入 'quit', 'exit' 或 'q' 退出。"
    );

    // 为本次命令行会话创建一个固定的 thread_id
    // 如果需要支持多个独立会话，可以在每次启动时生成不同的 ID
    const sessionThreadId = "cli-session-1";

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const askQuestion = (query: string): Promise<string> =>
        new Promise((resolve) => rl.question(query, resolve));

    while (true) {
        try {
            const userInput = await askQuestion("User: ");
            if (["quit", "exit", "q"].includes(userInput.toLowerCase())) {
                console.log("Goodbye!");
                break;
            }
            // 调用时传入同一个 thread_id
            await streamGraphUpdates(userInput, sessionThreadId);
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                console.log("\nGoodbye!");
                break;
            }
            console.error("发生错误:", error);
        }
    }

    rl.close();
}

const promise = run();
promise.catch(console.error);