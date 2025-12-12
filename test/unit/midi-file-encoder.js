import { beforeEach, describe, expect, it } from 'vitest';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { encode } from '../../src/midi-file-encoder';
import { filenames } from '../helper/filenames';

describe('midiFileEncoder', () => {
    describe('encode()', () => {
        for (const filename of filenames) {
            describe('with a json object', () => {
                let arrayBuffer;
                let json;

                beforeEach(async () => {
                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                    json = await loadFixtureAsJson(`${filename}.json`);
                });

                it('should encode the json object', () => {
                    expect(new Uint8Array(encode(json))).to.deep.equal(new Uint8Array(arrayBuffer));
                });
            });

            describe('with a binary file', () => {
                let arrayBuffer;

                beforeEach(async () => {
                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                });

                it('should refuse to encode the file', () => {
                    expect(() => {
                        encode(arrayBuffer);
                    }).to.throw(Error, 'The given JSON object seems to be invalid.');
                });
            });
        }
    });
});
