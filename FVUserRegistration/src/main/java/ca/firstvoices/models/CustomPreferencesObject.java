package ca.firstvoices.models;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomPreferencesObject {

    @JsonProperty(value = "General", required = false)
    private Map<String, Object> general = new HashMap<>();

    @JsonProperty(value = "Navigation", required = false)
    private Map<String, Object> navigation = new HashMap<>();

    @JsonProperty(value = "Theme", required = false)
    private Map<String, Object> theme = new HashMap<>();

    @JsonProperty(value = "generalPreferences", required = false)
    private Map<String, Object> generalPreferences = new HashMap<>();

    @JsonProperty(value = "navigationPreferences", required = false)
    private Map<String, Object> navigationPreferences = new HashMap<>();

    @JsonProperty(value = "themePreferences", required = false)
    private Map<String, Object> themePreferences = new HashMap<>();

    public Map<String, Object> getGeneralPreferences() {
        return general.isEmpty() ? generalPreferences : general;
    }

    public void setGeneralPreferences(Map<String, Object> generalPreferences) {
        this.generalPreferences = generalPreferences;
    }

    public Map<String, Object> getNavigationPreferences() {
        return navigation.isEmpty() ? navigationPreferences : navigation;
    }

    public void setNavigationPreferences(Map<String, Object> navigationPreferences) {
        this.navigationPreferences = navigationPreferences;
    }

    public Map<String, Object> getThemePreferences() {
        return theme.isEmpty() ? themePreferences : theme;
    }

    public void setThemePreferences(Map<String, Object> themePreferences) {
        this.themePreferences = themePreferences;
    }

    public Map<String, Object> getGeneral() {
        return general;
    }

    public void setGeneral(Map<String, Object> general) {
        this.general = general;
    }

    public Map<String, Object> getNavigation() {
        return navigation;
    }

    public void setNavigation(Map<String, Object> navigation) {
        this.navigation = navigation;
    }

    public Map<String, Object> getTheme() {
        return theme;
    }

    public void setTheme(Map<String, Object> theme) {
        this.theme = theme;
    }
}