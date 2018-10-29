import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(5);

    this.set("question", {
      slug: "question-1",
      label: "Test",
      __typename: "TextQuestion"
    });

    this.set("document", {
      id: 1,
      answers: {
        edges: [
          {
            node: {
              stringValue: "Test",
              question: {
                slug: "question-1"
              },
              __typename: "StringAnswer"
            }
          }
        ]
      }
    });

    await render(hbs`{{cf-field document=document question=question}}`);

    assert.dom(".uk-margin").exists();
    assert.dom(".uk-form-label").exists();
    assert.dom(".uk-form-controls").exists();

    assert.dom("label").hasText("Test");
    assert.dom("input[type=text]").hasValue("Test");
  });
});
