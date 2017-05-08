import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

    leche.withData({
        'SubTractor 1': [ 'SubTractor 1.mid.txt', 'SubTractor 1.json' ],
        'SubTractor 2': [ 'SubTractor 2.mid', 'SubTractor 2.json' ],
        'because': [ 'because.mid', 'because.json' ],
        'scale': [ 'scale.mid', 'scale.json' ]
    }, (midiFilename, jsonFilename) => {

        let worker;

        beforeEach(() => {
            worker = new Worker('base/src/module.ts');
        });

        it('should parse the midi file', function (done) {
            this.timeout(6000);

            loadFixtureAsJson(jsonFilename, (err, json) => {
                expect(err).to.be.null;

                loadFixtureAsArrayBuffer(midiFilename, (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    worker.addEventListener('message', ({ data: { midiFile } }) => {
                        expect(new Uint8Array(midiFile)).to.deep.equal(new Uint8Array(arrayBuffer));

                        done();
                    });

                    worker.postMessage({ json });
                });
            });
        });

        it('should refuse to encode a none json object', function (done) {
            this.timeout(6000);

            loadFixtureAsArrayBuffer(midiFilename, (err, arrayBuffer) => {
                expect(err).to.be.null;

                worker.addEventListener('message', ({ data: { err } }) => {
                    expect(err.message).to.equal('The given JSON object seems to be invalid.');

                    done();
                });

                worker.postMessage({ json: arrayBuffer });
            });
        });

    });

});
