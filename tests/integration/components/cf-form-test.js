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
      this.server.create("question", { formIds: [form.id], type: "FLOAT" })
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
    assert.expect(this.questions.length + 1);

    await render(hbs`{{cf-form documentId=document.id}}`);

    assert.dom("form").exists();

    this.questions.forEach(question => {
      const id = `Document:${this.document.id}:Question:${question.slug}`;
      const answer = this.server.db.answers.findBy({
        questionId: question.id,
        documentId: this.document.id
      });

      assert.dom(`[name="${id}"]`).hasValue(String(answer.value));
    });
  });
});
