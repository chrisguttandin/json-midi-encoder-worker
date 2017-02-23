import { IMidiEvent } from 'midi-json-parser-worker';
import { createArrayBufferWithDataView } from './create-array-buffer-with-data-view';

export const encode = (division: number, format: number, tracks: IMidiEvent[][]) => {
    const { arrayBuffer, dataView } = createArrayBufferWithDataView(14);

    // Write MThd as number.
    dataView.setUint32(0, 1297377380);
    dataView.setUint32(4, 6);
    dataView.setUint16(8, format);
    dataView.setUint16(10, tracks.length);
    dataView.setUint16(12, division);

    return arrayBuffer;
};
