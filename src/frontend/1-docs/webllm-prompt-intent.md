const messages = [
  { role: 'system', content: systemPromptAbove },
  { role: 'user', content: userInput },
];

const result = await engine.chat.completions.create({ messages });
const raw = result.choices[0].message.content;
const parsed = JSON.parse(raw); // intent, arguments, answer_for_user

// Gọi hàm tương ứng
functionMap[parsed.intent]?.(parsed.arguments);

// Hiển thị parsed.answer_for_user trong UI chatbot
