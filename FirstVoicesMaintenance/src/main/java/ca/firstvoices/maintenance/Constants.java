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

package ca.firstvoices.maintenance;

public class Constants {

  public static final String REQUIRED_JOBS_FRIENDLY_NAME = "Maintenance: Required Jobs";
  public static final String EXECUTE_REQUIRED_JOBS_EVENT_ID = "executeRequiredJobs";
  public static final String EXECUTE_REQUIRED_JOBS_QUEUED =
      EXECUTE_REQUIRED_JOBS_EVENT_ID + "_queued";
  public static final String EXECUTE_REQUIRED_JOBS_COMPLETE =
      EXECUTE_REQUIRED_JOBS_EVENT_ID + "_completed";
}
