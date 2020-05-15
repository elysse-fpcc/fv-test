package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

import java.io.Serializable;

/**
 * Service for user profile related information
 *
 * @author Daniel Yona
 * @author Kristof Subryan
 */
public interface FVUserProfileService extends Serializable {
    /**
     * Gets the user dialects the user is a member of. Normally, this would be 1 dialect.
     * For a user who is part of `hebrew_recorders`, `hebrew` would be returned.
     * There are some scenarios where multiple dialects could be returned, for example,
     * if a user is part of `hebrew_recorders` and `spanish_members`.
     * @param currentUser
     * @param session
     * @return List of FVDialect objects the user is a member of in some capacity
     */
    DocumentModelList getUserDialects(NuxeoPrincipal currentUser, CoreSession session);

    /**
     * Gets the path to redirect users to after login.
     * This will usually be a dialect path.
     * @param documentManager
     * @param currentUser
     * @param baseURL
     * @param defaultHome - whether to return the home page by default if no match found, or empty string
     * @return
     */
    String getDefaultDialectRedirectPath(CoreSession documentManager, NuxeoPrincipal currentUser, String baseURL, Boolean defaultHome);
}