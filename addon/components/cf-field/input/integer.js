import Component from "@ember/component";

/**
 * Input component for the integer question type
 *
 * @class CfFieldInputIntegerComponent
 */
export default Component.extend({
  tagName: "input",
  classNames: ["uk-input"],
  attributeBindings: [
    "type",
    "step",
    "disabled",
    "field.id:name",
    "field.answer.integerValue:value",
    "field.question.integerMinValue:min",
    "field.question.integerMaxValue:max"
  ],
  type: "number",
  step: 1
});
