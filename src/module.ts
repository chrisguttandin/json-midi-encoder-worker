import { TWorkerImplementation, createWorker } from 'worker-factory';
import { IJsonMidiEncoderWorkerCustomDefinition } from './interfaces';
import { encode } from './midi-file-encoder';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

createWorker<IJsonMidiEncoderWorkerCustomDefinition>(self, <TWorkerImplementation<IJsonMidiEncoderWorkerCustomDefinition>>{
    encode: ({ midiFile }) => {
        const arrayBuffer = encode(midiFile);

        return { result: { arrayBuffer }, transferables: [arrayBuffer] };
    }
});
