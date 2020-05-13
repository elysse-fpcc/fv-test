/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.nuxeo.enrichers;


import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import ca.firstvoices.services.UnpublishedChangesService;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.Arrays;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;
import org.nuxeo.ecm.core.schema.DocumentType;
import org.nuxeo.runtime.api.Framework;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class UnpublishedChangesEnricher extends AbstractJsonEnricher<DocumentModel> {

  public static final String NAME = "unpublished_changes";
  private static final Log log = LogFactory.getLog(UnpublishedChangesEnricher.class);
  protected UnpublishedChangesService service = Framework
      .getService(UnpublishedChangesService.class);

  public UnpublishedChangesEnricher() {
    super(NAME);
  }

  // Method that will be called when the enricher is asked for
  @Override
  public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
    // We use the Jackson library to generate Json
    ObjectNode unpublishedChangesJsonObject = constructUnpublishedChangesJSON(doc);
    jg.writeFieldName(NAME);
    jg.writeObject(unpublishedChangesJsonObject);
  }

  private ObjectNode constructUnpublishedChangesJSON(DocumentModel doc) throws IOException {
    ObjectMapper mapper = new ObjectMapper();

    // JSON object to be returned
    ObjectNode jsonObj = mapper.createObjectNode();

    log.debug("Constructing unpublished changes for doc: " + doc.getId());

    // First create the parent document's Json object content
    CoreSession session = doc.getCoreSession();

    // If the document is the correct type then check for unpublished changes using the service.
    if (checkType(doc)) {
      boolean unpublishedChanges = service.checkUnpublishedChanges(session, doc);

      jsonObj.put("unpublished_changes_exist", unpublishedChanges);
    }

    return jsonObj;
  }

  // Helper method to check that the new document is one of the types below
  private boolean checkType(DocumentModel inputDoc) {
    DocumentType currentType = inputDoc.getDocumentType();

    String[] types = {"FVAlphabet", "FVAudio", "FVBook", "FVBookEntry", "FVBooks", "FVCategories",
        "FVCategory", "FVCharacter", "FVContributor", "FVContributors", "FVDialect", "FVDictionary",
        "FVGallery", "FVLanguage", "FVLanguageFamily", "FVLink", "FVLinks", "FVPhrase", "FVPicture",
        "FVPortal", "FVResources", "FVVideo", "FVWord",};
    return Arrays.stream(types).parallel().anyMatch(currentType.toString()::contains);
  }

}
