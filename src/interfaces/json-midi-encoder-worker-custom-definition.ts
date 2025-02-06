import { IMidiFile } from 'midi-json-parser-worker';
import { IWorkerDefinition } from 'worker-factory';

export interface IJsonMidiEncoderWorkerCustomDefinition extends IWorkerDefinition {
    encode: {
        params: {
            midiFile: IMidiFile;
        };

        response: {
            result: { arrayBuffer: ArrayBuffer };

            transferables: ArrayBuffer[];
        };
    };
}
