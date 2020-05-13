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

package ca.firstvoices.maintenance.services;

import ca.firstvoices.maintenance.Constants;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

public class MaintenanceLoggerImpl implements MaintenanceLogger {

  @Override
  public Set<String> getRequiredJobs(DocumentModel jobContainer) {

    if (jobContainer == null) {
      return new HashSet<>();
    }

    // Get current required jobs
    String[] requiredJobsRawList = (String[]) jobContainer
        .getPropertyValue("fv-maintenance:required_jobs");
    if (requiredJobsRawList != null) {
      return new HashSet<>(Arrays.asList(requiredJobsRawList));
    }

    return new HashSet<>();
  }

  @Override
  public void addToRequiredJobs(DocumentModel jobContainer, String job) {
    if (jobContainer != null) {
      // Use a SET to ensure we don't add duplicates
      Set<String> requiredJobs = getRequiredJobs(jobContainer);
      requiredJobs.add(job);
      jobContainer.setProperty("fv-maintenance", "required_jobs", requiredJobs);

      // Update dialect
      CoreSession session = jobContainer.getCoreSession();
      session.saveDocument(jobContainer);

      sendEvent("Job Queued", job + " queued for `" + jobContainer.getTitle() + "`",
          Constants.EXECUTE_REQUIRED_JOBS_QUEUED, session, jobContainer);
    }
  }

  @Override
  public void removeFromRequiredJobs(DocumentModel jobContainer, String job) {
    if (jobContainer != null) {
      Set<String> requiredJobs = getRequiredJobs(jobContainer);

      if (requiredJobs != null && requiredJobs.size() > 0) {
        requiredJobs.remove(job);
        jobContainer.setProperty("fv-maintenance", "required_jobs", requiredJobs);

        // Update dialect
        CoreSession session = jobContainer.getCoreSession();
        session.saveDocument(jobContainer);

        sendEvent("Job Complete", job + " completed for `" + jobContainer.getTitle() + "`",
            Constants.EXECUTE_REQUIRED_JOBS_COMPLETE, session, jobContainer);
      }
    }
  }

  @Override
  public void addToJobHistory() {

  }

  @Override
  public void logError() {

  }

  @Override
  public void logWarning() {

  }

  @Override
  public void logInsight() {

  }

  // This is sent for audit purposes at the moment
  // In the future Listeners could catch these events to send emails, and turn on features
  private void sendEvent(String status, String message, String eventId, CoreSession session,
      DocumentModel jobContainer) {
    DocumentEventContext ctx = new DocumentEventContext(session, session.getPrincipal(),
        jobContainer);
    ctx.setProperty("status", status);
    ctx.setComment(message);
    ctx.setCategory(Constants.REQUIRED_JOBS_FRIENDLY_NAME);
    Event event = ctx.newEvent(eventId);
    EventProducer eventProducer = Framework.getService(EventProducer.class);
    eventProducer.fireEvent(event);
  }
}
