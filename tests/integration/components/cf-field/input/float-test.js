import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field/input/float", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(7);

    await render(hbs`
      {{cf-field/input/float
        field=(hash
          id="test"
          answer=(hash
            floatValue=1.045
          )
          question=(hash
            floatMinValue=0.4
            floatMaxValue=1.4
          )
        )
      }}
    `);

    assert.dom("input").hasClass("uk-input");
    assert.dom("input").hasAttribute("name", "test");
    assert.dom("input").hasAttribute("type", "number");
    assert.dom("input").hasAttribute("step", "0.001");
    assert.dom("input").hasAttribute("min", "0.4");
    assert.dom("input").hasAttribute("max", "1.4");
    assert.dom("input").hasValue("1.045");
  });
});
