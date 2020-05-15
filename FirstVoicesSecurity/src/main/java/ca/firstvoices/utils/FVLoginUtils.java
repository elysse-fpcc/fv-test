package ca.firstvoices.utils;

import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.platform.ui.web.rest.RestHelper;
import org.nuxeo.runtime.api.Framework;

public class FVLoginUtils {

    // this is configured with a property to be set easily in nuxeo.conf in different envs
    static String fvContextPath = Framework.getProperty("fv.contextPath", "app");

    public static String getBaseURL(RestHelper restHelper) {
        return removeNuxeoFromPath(restHelper.getBaseURL(), restHelper.getContextPath());
    }

    public static String removeNuxeoFromPath(String baseUrl, String contextPath) {
        // if we don't serve /app we don't need /nuxeo in the url either
        if (StringUtils.isEmpty(fvContextPath)) {
            baseUrl = baseUrl.replaceAll(contextPath, "");
        }

        return baseUrl;
    }
}
