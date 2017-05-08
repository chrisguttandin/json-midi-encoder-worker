import { encode } from './midi-file-encoder';

addEventListener('message', ({ data: { json } }) => {
    try {
        postMessage({
            midiFile: encode(json)
        });
    } catch (err) {
        postMessage({
            err: {
                message: err.message
            }
        });
    }
});
