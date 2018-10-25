import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set("question", {
      slug: "question-1",
      label: "Test",
      isRequired: "true",
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
  });

  test("it renders", async function(assert) {
    assert.expect(5);

    await render(hbs`{{cf-field document=document question=question}}`);

    assert.dom(".uk-margin").exists();
    assert.dom(".uk-form-label").exists();
    assert.dom(".uk-form-controls").exists();

    assert.dom("label").hasText("Test");
    assert.dom("input[type=text]").hasValue("Test");
  });

  test("it renders disabled fields", async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{cf-field
        document=document
        question=question
        disabled=true
      }}
    `);

    assert.dom("input[type=text]").isDisabled();
  });
});
