import { encode } from './midi-file-encoder';

self.addEventListener('message', ({ data: { json } }) => {

    try {
        self.postMessage({
            midiFile: encode(json)
        });
    } catch (err) {
        self.postMessage({
            err: {
                message: err.message
            }
        });
    }
});
