"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRetry = exports.RETRY_CODES = void 0;
/*!
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const google_gax_1 = require("google-gax");
/*!
 * retryable grpc.status codes
 */
exports.RETRY_CODES = [
    google_gax_1.grpc.status.DEADLINE_EXCEEDED,
    google_gax_1.grpc.status.RESOURCE_EXHAUSTED,
    google_gax_1.grpc.status.ABORTED,
    google_gax_1.grpc.status.INTERNAL,
    google_gax_1.grpc.status.UNAVAILABLE,
    google_gax_1.grpc.status.CANCELLED,
];
/**
 * Used to track pull requests and determine if additional requests should be
 * made, etc.
 *
 * @class
 * @private
 */
class PullRetry {
    constructor() {
        this.failures = 0;
    }
    /**
     * Generates a timeout that can be used for applying a backoff based on the
     * current number of failed requests.
     *
     * @see {@link https://cloud.google.com/iot/docs/how-tos/exponential-backoff}
     * @private
     * @returns {number}
     */
    createTimeout() {
        if (this.failures === 0) {
            return 0;
        }
        return Math.pow(2, this.failures) * 1000 + Math.floor(Math.random() * 1000);
    }
    /**
     * Determines if a request grpc.status should be retried.
     *
     * Deadlines behave kind of unexpectedly on streams, rather than using it as
     * an indicator of when to give up trying to connect, it actually dictates
     * how long the stream should stay open. Because of this, it is virtually
     * impossible to determine whether or not a deadline error is the result of
     * the server closing the stream or if we timed out waiting for a connection.
     *
     * @private
     * @param {object} grpc.status The request grpc.status.
     * @returns {boolean}
     */
    retry(err) {
        if (err.code === google_gax_1.grpc.status.OK ||
            err.code === google_gax_1.grpc.status.DEADLINE_EXCEEDED) {
            this.failures = 0;
        }
        else {
            this.failures += 1;
        }
        if (err.code === google_gax_1.grpc.status.UNAVAILABLE &&
            err.details &&
            err.details.match(/Server shutdownNow invoked/)) {
            return true;
        }
        return exports.RETRY_CODES.includes(err.code);
    }
}
exports.PullRetry = PullRetry;
//# sourceMappingURL=pull-retry.js.map