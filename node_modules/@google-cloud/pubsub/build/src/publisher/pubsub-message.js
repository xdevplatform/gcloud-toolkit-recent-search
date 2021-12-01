"use strict";
/*!
 * Copyright 2021 Google LLC
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMessageSize = void 0;
/**
 * Precisely calculates the size of a message with optional `data` and
 * `attributes` fields. If a `data` field is present, its {@link Buffer#length}
 * member will be used. If `attributes` are present, each attribute's
 * key and value will be calculated for byte length.
 *
 * When the calculation is complete, the result will be stored in
 * `calculatedSize`. Since this calculation is generally only done
 * after the message has been handed off to this library, there shouldn't
 * be an issue with it being updated after the fact.
 *
 * This should not be used outside of this library. Its implementation
 * may change.
 *
 * @private
 */
function calculateMessageSize(message) {
    // If it's not a PubsubMessage, we'll augment it into one.
    const msg = message;
    if (msg.calculatedSize !== undefined) {
        return msg.calculatedSize;
    }
    let size = 0;
    if (msg.data) {
        size += msg.data.length;
    }
    if (msg.attributes) {
        const attrs = msg.attributes;
        for (const key of Object.getOwnPropertyNames(attrs)) {
            const val = attrs[key] || '';
            size += Buffer.byteLength(key + val);
        }
    }
    msg.calculatedSize = size;
    return size;
}
exports.calculateMessageSize = calculateMessageSize;
//# sourceMappingURL=pubsub-message.js.map