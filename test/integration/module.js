import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { filenames } from '../helper/filenames';

describe('module', () => {
    for (const filename of filenames) {
        let id;
        let worker;

        afterEach(() => worker.terminate());

        beforeEach(() => {
            id = 89;

            worker = new Worker(new URL('../../src/module', import.meta.url), { type: 'module' });
        });

        describe('with a json object', () => {
            let arrayBuffer;
            let json;

            beforeEach(async () => {
                arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                json = await loadFixtureAsJson(`${filename}.json`);
            });

            it('should encode the json object', () => {
                const { promise, resolve } = Promise.withResolvers();

                worker.addEventListener('message', ({ data }) => {
                    expect(new Uint8Array(data.result)).to.deep.equal(new Uint8Array(arrayBuffer));

                    expect(data).to.deep.equal({
                        id,
                        result: data.result
                    });

                    resolve();
                });

                worker.postMessage({ id, method: 'encode', params: { midiFile: json } });

                return promise;
            });
        });

        describe('with a binary file', () => {
            let arrayBuffer;

            beforeEach(async () => {
                arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
            });

            it('should refuse to encode the file', () => {
                const { promise, resolve } = Promise.withResolvers();

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            code: -32603,
                            message: 'The given JSON object seems to be invalid.'
                        },
                        id
                    });

                    resolve();
                });

                worker.postMessage({ id, method: 'encode', params: { midiFile: arrayBuffer } });

                return promise;
            });
        });
    }
});
