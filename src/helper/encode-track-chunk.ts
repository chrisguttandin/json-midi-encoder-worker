import { encode as encodeMessage } from 'json-midi-message-encoder';
import { TMidiEvent } from 'midi-json-parser-worker';
import { createArrayBufferWithDataView } from './create-array-buffer-with-data-view';
import { joinArrayBuffers } from './join-array-buffers';
import { writeVariableLengthQuantity } from './write-variable-length-quantity';

export const encode = (track: TMidiEvent[]) => {
    const { arrayBuffer, dataView } = createArrayBufferWithDataView(8);

    const arrayBuffers = [ arrayBuffer ];

    let byteLength = 0;

    // Write MTrk as number.
    dataView.setUint32(0, 1297379947);

    for (const message of track) {
        const deltaArrayBuffer = writeVariableLengthQuantity(message.delta);

        try {
            const messageArrayBuffer = encodeMessage(message);

            byteLength += deltaArrayBuffer.byteLength + messageArrayBuffer.byteLength;

            arrayBuffers.push(deltaArrayBuffer, messageArrayBuffer);
        } catch (err) {
            if (err.message.match(/Unencodable\smessage\swith\sa\sdelta\sof\s[0-9]+\./)) {
                const index = track.indexOf(message);

                throw new Error(`Unencodable message at index ${ index }.`);
            }

            throw err;
        }
    }

    dataView.setUint32(4, byteLength);

    return joinArrayBuffers(arrayBuffers);
};
