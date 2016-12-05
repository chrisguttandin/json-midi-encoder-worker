import * as midiFileEncoder from '../../src/midi-file-encoder';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('midiFileEncoder', () => {

    describe('encode()', () => {

        leche.withData({
            'SubTractor 1': [ 'SubTractor 1.mid.txt', 'SubTractor 1.json' ],
            'SubTractor 2': [ 'SubTractor 2.mid', 'SubTractor 2.json' ],
            'because': [ 'because.mid', 'because.json' ],
            'scale': [ 'scale.mid', 'scale.json' ]
        }, (midiFilename, jsonFilename) => {

            it('should encode the json object', function (done) {
                this.timeout(4000);

                loadFixtureAsArrayBuffer(midiFilename, (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    loadFixtureAsJson(jsonFilename, (err, json) => {
                        expect(err).to.be.null;

                        expect(new Uint8Array(midiFileEncoder.encode(json))).to.deep.equal(new Uint8Array(arrayBuffer));

                        done();
                    });
                });
            });

            it('should refuse to encode a none json object', function (done) {
                this.timeout(4000);

                loadFixtureAsArrayBuffer(midiFilename, (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    expect(() => {
                        midiFileEncoder.encode(arrayBuffer);
                    }).to.throw(Error, 'The given JSON object seems to be invalid.');

                    done();
                });
            });

        });

    });

});
