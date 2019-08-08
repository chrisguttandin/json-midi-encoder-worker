import * as midiFileEncoder from '../../src/midi-file-encoder';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('midiFileEncoder', () => {

    afterEach((done) => {
        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 1000);
    });

    describe('encode()', () => {

        leche.withData([
            [ '98137' ],
            [ 'A_F_NO7_01' ],
            [ 'MIDIOkFormat1-lyrics' ],
            [ 'MIDIOkFormat2' ],
            [ 'SubTractor 1' ],
            [ 'SubTractor 2' ],
            [ 'TheEntertainer' ],
            [ 'because' ],
            [ 'californication' ],
            [ 'minute_waltz' ],
            [ 'rachmaninov3' ],
            [ 'scale' ],
            [ 'test' ],
            [ 'test8bars' ]
        ], (filename) => {

            it('should encode the json object', function (done) {
                this.timeout(10000);

                loadFixtureAsArrayBuffer(filename + '.mid', (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    loadFixtureAsJson(filename + '.json', (rr, json) => {
                        expect(rr).to.be.null;

                        expect(new Uint8Array(midiFileEncoder.encode(json))).to.deep.equal(new Uint8Array(arrayBuffer));

                        done();
                    });
                });
            });

            it('should refuse to encode a none json object', function (done) {
                this.timeout(10000);

                loadFixtureAsArrayBuffer(filename + '.mid', (err, arrayBuffer) => {
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
