import { IBrokerEvent, IEncodeResponse, IErrorResponse } from './interfaces';
import { encode } from './midi-file-encoder';

export * from './interfaces';
export * from './types';

addEventListener('message', ({ data }: IBrokerEvent) => {
    try {
       if (data.method === 'encode') {
           const { id, params: { midiFile } } = data;

           const arrayBuffer = encode(midiFile);

           postMessage(<IEncodeResponse> {
               error: null,
               id,
               result: { arrayBuffer }
           }, [ arrayBuffer ]);
       } else {
           throw new Error(`The given method "${ (<any> data).method }" is not supported`);
       }
    } catch (err) {
        postMessage(<IErrorResponse> {
            error: {
                message: err.message
            },
            id: data.id,
            result: null
        });
    }
});
