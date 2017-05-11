import { IMidiFile } from 'midi-json-parser-worker';

export interface IEncodeRequest {

    id: number;

    method: 'encode';

    params: {

        midiFile: IMidiFile;

    };

}
