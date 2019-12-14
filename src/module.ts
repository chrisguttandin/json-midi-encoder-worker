import { IBrokerEvent, IEncodeResponse, IErrorResponse } from './interfaces';
import { encode } from './midi-file-encoder';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

addEventListener('message', ({ data }: IBrokerEvent) => {
    try {
       if (data.method === 'encode') {
           const { id, params: { midiFile } } = data;

           const arrayBuffer = encode(midiFile);

           postMessage(<IEncodeResponse> {
               error: null,
               id,
               result: { arrayBuffer }
           }, [ <ArrayBuffer> arrayBuffer ]);
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
