import { reads } from "@ember/object/computed";

export const lastValue = taskName => reads(`${taskName}.lastSuccessful.value`);

export default { lastValue };
