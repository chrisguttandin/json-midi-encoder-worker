import { encode as encodeHeaderChunk } from './helper/encode-header-chunk';
import { encode as encodeTrackChunk } from './helper/encode-track-chunk';
import { joinArrayBuffers } from './helper/join-array-buffers';

export const encode = ({ division, format, tracks }) => {
    const arrayBuffers = [];

    try {
        arrayBuffers.push(encodeHeaderChunk(division, format, tracks));
    } catch (err) {
        throw new Error('The given JSON object seems to be invalid.');
    }

    for (let track of tracks) {
        try {
            arrayBuffers.push(encodeTrackChunk(track));
        } catch (err) {
            if (err.message.match(/Unencodable\sevent\sat\sposition\s[0-9]+\./)) {
                let index = tracks.indexOf(track);

                throw new Error(`${ err.message.slice(0, -1) } of the track at index ${ index }.`);
            }

            throw err;
        }
    }

    return joinArrayBuffers(arrayBuffers);
};
