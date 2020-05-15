package ca.firstvoices.marshallers;

import ca.firstvoices.models.CustomPreferencesObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonParser;

import org.nuxeo.ecm.core.io.marshallers.json.AbstractJsonReader;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

import java.io.IOException;

@Setup(mode = Instantiations.SINGLETON, priority = Priorities.REFERENCE)
public class CustomPreferencesJSONReader extends AbstractJsonReader<CustomPreferencesObject> {
    @Override
    public CustomPreferencesObject read(JsonNode jn) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonParser jsonParser = mapper.getFactory().createParser(jn.asText());

        return mapper.readValue(jsonParser, CustomPreferencesObject.class);
    }
}