package ca.firstvoices.listeners;

import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.platform.audit.listener.StreamAuditEventListener;

/*
 * Overrides the default StreamAuditEventListener to skip logging login for Guest user
 */
public class FVStreamAuditEventListener extends StreamAuditEventListener {

    @Override
    public void handleEvent(Event event) {

        NuxeoPrincipal principal = event.getContext().getPrincipal();
        if ((principal == null || principal.isAnonymous() || "Guest".equals(principal.getName()))
                && "loginSuccess".equals(event.getName())) {
            return;
        }
        super.handleEvent(event);
    }

}
