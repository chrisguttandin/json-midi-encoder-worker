import * as midiFileEncoder from '../../src/midi-file-encoder';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { filenames } from '../helper/filenames';

describe('midiFileEncoder', () => {
    afterEach((done) => {
        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 1000);
    });

    describe('encode()', () => {
        for (const filename of filenames) {
            describe('with a json object', () => {
                let arrayBuffer;
                let json;

                beforeEach(async function () {
                    this.timeout(20000);

                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                    json = await loadFixtureAsJson(`${filename}.json`);
                });

                it('should encode the json object', function () {
                    this.timeout(20000);

                    expect(new Uint8Array(midiFileEncoder.encode(json))).to.deep.equal(new Uint8Array(arrayBuffer));
                });
            });

            describe('with a binary file', () => {
                let arrayBuffer;

                beforeEach(async function () {
                    this.timeout(20000);

                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                });

                it('should refuse to encode the file', function () {
                    this.timeout(20000);

                    expect(() => {
                        midiFileEncoder.encode(arrayBuffer);
                    }).to.throw(Error, 'The given JSON object seems to be invalid.');
                });
            });
        }
    });
});
