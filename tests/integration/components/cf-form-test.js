import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | cf-form", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    const form = this.server.create("form");

    const questions = [
      this.server.create("question", { formIds: [form.id], type: "TEXT" }),
      this.server.create("question", { formIds: [form.id], type: "TEXTAREA" }),
      this.server.create("question", { formIds: [form.id], type: "INTEGER" }),
      this.server.create("question", { formIds: [form.id], type: "FLOAT" }),
      this.server.create("question", { formIds: [form.id], type: "RADIO" }),
      this.server.create("question", { formIds: [form.id], type: "CHECKBOX" })
    ];

    const document = this.server.create("document", { formId: form.id });

    questions.forEach(question => {
      this.server.create("answer", {
        questionId: question.id,
        documentId: document.id
      });
    });

    this.set("questions", questions);
    this.set("document", document);
  });

  test("it renders", async function(assert) {
    await render(hbs`{{cf-form documentId=document.id}}`);

    assert.dom("form").exists();

    this.questions.forEach(question => {
      const id = `Document:${this.document.id}:Question:${question.slug}`;
      const answer = this.server.db.answers.findBy({
        questionId: question.id,
        documentId: this.document.id
      });

      if (question.type === "RADIO") {
        assert.dom(`[name="${id}"][value="${answer.value}"]`).isChecked();
      } else if (question.type === "CHECKBOX") {
        answer.value.forEach(v => {
          assert.dom(`[name="${id}"][value="${v}"]`).isChecked();
        });
      } else {
        assert.dom(`[name="${id}"]`).hasValue(String(answer.value));
      }
    });
  });

  test("it renders in disabled mode", async function(assert) {
    await render(hbs`{{cf-form disabled=true documentId=document.id}}`);

    assert.dom("form").exists();

    this.questions.forEach(question => {
      const id = `Document:${this.document.id}:Question:${question.slug}`;
      const options = this.server.db.options.filter(({ questionIds }) =>
        questionIds.includes(question.id)
      );

      if (["RADIO", "CHECKBOX"].includes(question.type)) {
        options.forEach(({ slug }) => {
          assert.dom(`[name="${id}"][value="${slug}"]`).isDisabled();
        });
      } else {
        assert.dom(`[name="${id}"]`).isDisabled();
      }
    });
  });
});
