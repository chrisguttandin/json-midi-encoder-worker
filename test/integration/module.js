import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

    leche.withData({
        'MIDIOkFormat1-lyrics': [ 'MIDIOkFormat1-lyrics.mid', 'MIDIOkFormat1-lyrics.json' ],
        'MIDIOkFormat2': [ 'MIDIOkFormat2.mid', 'MIDIOkFormat2.json' ],
        'SubTractor 1': [ 'SubTractor 1.mid.txt', 'SubTractor 1.json' ],
        'SubTractor 2': [ 'SubTractor 2.mid', 'SubTractor 2.json' ],
        'because': [ 'because.mid', 'because.json' ],
        'scale': [ 'scale.mid', 'scale.json' ]
    }, (midiFilename, jsonFilename) => {

        let id;
        let worker;

        beforeEach(() => {
            id = 89;

            worker = new Worker('base/src/module.ts');
        });

        it('should parse the midi file', function (done) {
            this.timeout(6000);

            loadFixtureAsJson(jsonFilename, (err, json) => {
                expect(err).to.be.null;

                loadFixtureAsArrayBuffer(midiFilename, (err, arrayBuffer) => {
                    expect(err).to.be.null;

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
            this.timeout(6000);

            loadFixtureAsArrayBuffer(midiFilename, (err, arrayBuffer) => {
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
