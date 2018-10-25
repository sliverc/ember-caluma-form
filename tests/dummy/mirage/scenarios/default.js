export default function(server) {
  const form = server.create("form");

  const questions = [
    server.create("question", { formIds: [form.id], type: "TEXT" }),
    server.create("question", { formIds: [form.id], type: "TEXTAREA" }),
    server.create("question", { formIds: [form.id], type: "INTEGER" }),
    server.create("question", { formIds: [form.id], type: "FLOAT" }),
    server.create("question", { formIds: [form.id], type: "RADIO" })
  ];

  const document = server.create("document", { formId: form.id });

  questions.forEach(question => {
    server.create("answer", {
      questionId: question.id,
      documentId: document.id
    });
  });
}
