import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

    leche.withData([
        [ 'because' ],
        [ 'MIDIOkFormat1-lyrics' ],
        [ 'MIDIOkFormat2' ],
        [ 'minute_waltz' ],
        [ 'rachmaninov3' ],
        [ 'scale' ],
        [ 'SubTractor 1' ],
        [ 'SubTractor 2' ],
        [ 'test8bars' ]
    ], (filename) => {

        let id;
        let worker;

        beforeEach(() => {
            id = 89;

            worker = new Worker('base/src/module.js');
        });

        it('should parse the midi file', function (done) {
            this.timeout(10000);

            loadFixtureAsJson(filename + '.json', (err, json) => {
                expect(err).to.be.null;

                loadFixtureAsArrayBuffer(filename + '.mid', (rr, arrayBuffer) => {
                    expect(rr).to.be.null;

                    worker.addEventListener('message', ({ data }) => {
                        expect(new Uint8Array(data.result.arrayBuffer)).to.deep.equal(new Uint8Array(arrayBuffer));

                        expect(data).to.deep.equal({
                            error: null,
                            id,
                            result: {
                                arrayBuffer: data.result.arrayBuffer
                            }
                        });

                        done();
                    });

                    worker.postMessage({ id, method: 'encode', params: { midiFile: json } });
                });
            });
        });

        it('should refuse to encode a none json object', function (done) {
            this.timeout(10000);

            loadFixtureAsArrayBuffer(filename + '.mid', (err, arrayBuffer) => {
                expect(err).to.be.null;

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            message: 'The given JSON object seems to be invalid.'
                        },
                        id,
                        result: null
                    });

                    done();
                });

                worker.postMessage({ id, method: 'encode', params: { midiFile: arrayBuffer } });
            });
        });

    });

});
