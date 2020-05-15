package ca.firstvoices.listeners;

import static ca.firstvoices.utils.FVRegistrationConstants.CHECK_REGISTRATION_TIMEOUT_EVENT_NAME;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

import ca.firstvoices.workers.FVRegistrationTimeOutWorker;

/**
 *
 */
public class FVRegistrationTimeOutListener implements EventListener {
    private static final Log log = LogFactory.getLog(FVRegistrationTimeOutListener.class);

    @Override
    public void handleEvent(Event event) {
        if (CHECK_REGISTRATION_TIMEOUT_EVENT_NAME.equals(event.getName())) {
            FVRegistrationTimeOutWorker doCheckRegTimeOut = new FVRegistrationTimeOutWorker();
            Framework.getService(WorkManager.class).schedule(doCheckRegTimeOut, true);
        }
    }
}
