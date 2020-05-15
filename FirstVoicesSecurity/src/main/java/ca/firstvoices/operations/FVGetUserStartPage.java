/*
 * (C) Copyright ${year} Nuxeo SA (http://nuxeo.com/) and contributors.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * Contributors:
 *     dyona
 */

package ca.firstvoices.operations;

import ca.firstvoices.services.FVUserProfileService;
import ca.firstvoices.utils.FVLoginUtils;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.ui.web.util.BaseURL;
import org.nuxeo.ecm.platform.web.common.vh.VirtualHostHelper;

import javax.servlet.ServletRequest;

/**
 * Operation returns the user start page for the current user
 */
@Operation(id=FVGetUserStartPage.ID, category=Constants.CAT_USERS_GROUPS, label="FVGetUserStartPage", description="")
public class FVGetUserStartPage {

    public static final String ID = "FVGetUserStartPage";

	@Context
	protected CoreSession session;

    @Context
    private FVUserProfileService fvUserProfileService;

    @Context
    protected OperationContext ctx;

    /**
     * Determines whether the home page is returned if no specific start page found or an empty string
     */
    @Param(name = "defaultHome")
    protected Boolean defaultHome = true;

    @OperationMethod
    public String run() {

        ServletRequest request = (ServletRequest) ctx.get("request");

        String baseURL = FVLoginUtils.removeNuxeoFromPath(
                BaseURL.getBaseURL(request),
                VirtualHostHelper.getContextPath(request));

    	NuxeoPrincipal currentUser = (NuxeoPrincipal) session.getPrincipal();
		return fvUserProfileService.getDefaultDialectRedirectPath(session, currentUser, baseURL, defaultHome);
    }

}
