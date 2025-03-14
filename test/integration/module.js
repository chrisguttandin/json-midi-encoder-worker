import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { filenames } from '../helper/filenames';

describe('module', () => {
    for (const filename of filenames) {
        let id;
        let worker;

        afterEach(() => worker.terminate());

        beforeEach(() => {
            id = 89;

            worker = new Worker('base/src/module.js');
        });

        describe('with a json object', () => {
            let arrayBuffer;
            let json;

            beforeEach(async function () {
                this.timeout(50000);

                arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                json = await loadFixtureAsJson(`${filename}.json`);
            });

            it('should encode the json object', function (done) {
                this.timeout(50000);

                worker.addEventListener('message', ({ data }) => {
                    expect(new Uint8Array(data.result)).to.deep.equal(new Uint8Array(arrayBuffer));

                    expect(data).to.deep.equal({
                        id,
                        result: data.result
                    });

                    done();
                });

                worker.postMessage({ id, method: 'encode', params: { midiFile: json } });
            });
        });

        describe('with a binary file', () => {
            let arrayBuffer;

            beforeEach(async function () {
                this.timeout(50000);

                arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
            });

            it('should refuse to encode the file', function (done) {
                this.timeout(50000);

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            code: -32603,
                            message: 'The given JSON object seems to be invalid.'
                        },
                        id
                    });

                    done();
                });

                worker.postMessage({ id, method: 'encode', params: { midiFile: arrayBuffer } });
            });
        });
    }
});
