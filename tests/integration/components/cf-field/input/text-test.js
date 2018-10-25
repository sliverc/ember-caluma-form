import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field/input/text", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(5);

    await render(hbs`
      {{cf-field/input/text
        field=(hash
          id="test"
          answer=(hash
            stringValue="Test"
          )
          question=(hash
            textMaxLength=5
          )
        )
      }}
    `);

    assert.dom("input").hasClass("uk-input");
    assert.dom("input").hasAttribute("name", "test");
    assert.dom("input").hasAttribute("type", "text");
    assert.dom("input").hasAttribute("maxlength", "5");
    assert.dom("input").hasValue("Test");
  });
});
