/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.utils;

import java.util.HashMap;
import java.util.Map;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import ca.firstvoices.models.CustomPreferencesObject;

public class FVUserPreferencesSetup {

    public String createDefaultUserPreferencesWithDialectID(String dialectID) {
        CustomPreferencesObject userPreferencesObj = new CustomPreferencesObject();

        // Create general preferences
        Map<String, Object> generalPreferences = new HashMap<>();
        generalPreferences.put("primary_dialect", dialectID);

        // Create navigation preferences
        Map<String, Object> navigationPreferences = new HashMap<>();
        navigationPreferences.put("start_page", "my_dialect");

        // Create theme preferences
        Map<String, Object> themePreferences = new HashMap<>();
        themePreferences.put("font_size", "default");

        // Set general, navigation and theme preferences
        userPreferencesObj.setGeneralPreferences(generalPreferences);
        userPreferencesObj.setNavigationPreferences(navigationPreferences);
        userPreferencesObj.setThemePreferences(themePreferences);

        ObjectMapper mapper = new ObjectMapper();

        try {
            return mapper.writeValueAsString(userPreferencesObj);
        } catch (JsonProcessingException e) {
            throw new NuxeoException(e);
        }
    }

    public String createDefaultUserPreferencesWithRegistration(DocumentModel registration) throws Exception {
        String dialectID = (String) registration.getPropertyValue("fvuserinfo:requestedSpace");

        return createDefaultUserPreferencesWithDialectID(dialectID);
    }

    /**
     * @param existingUserObject
     * @param registration
     * @throws Exception
     */
    public DocumentModel updateUserPreferencesWithRegistration(DocumentModel existingUserObject,
            DocumentModel registration) throws Exception {
        String modifiedPreferencesString = createDefaultUserPreferencesWithRegistration(registration);
        existingUserObject.setPropertyValue("user:preferences", modifiedPreferencesString);

        return existingUserObject;
    }
}
