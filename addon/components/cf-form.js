import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { ComponentQueryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import layout from "../templates/components/cf-form";

import getDocumentQuery from "ember-caluma-form/gql/queries/get-document";

/**
 * Component to display a form for a whole document.
 *
 * ```hbs
 * {{cf-form documentId="the-id-of-your-document"}}
 * ```
 *
 * You can disable the whole form by passing `disabled=true`.
 *
 * @class CfFormComponent
 * @argument {String} documentId The ID of the document to display
 */
export default Component.extend(ComponentQueryManager, {
  layout,
  tagName: "form",
  apollo: service(),

  willInsertElement() {
    this.data.perform();
  },

  data: task(function*() {
    return yield this.apollo.watchQuery(
      {
        query: getDocumentQuery,
        variables: { id: this.documentId },
        fetchPolicy: "network-only"
      },
      "allDocuments.edges"
    );
  })
});
