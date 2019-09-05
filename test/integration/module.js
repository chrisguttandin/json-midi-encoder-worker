import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

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

        let id;
        let worker;

        beforeEach(() => {
            id = 89;

            worker = new Worker('base/src/module.js');
        });

        describe('with a json object', () => {

            let arrayBuffer;
            let json;

            beforeEach(async function () {
                this.timeout(6000);

                arrayBuffer = await loadFixtureAsArrayBuffer(`${ filename }.mid`);
                json = await loadFixtureAsJson(`${ filename }.json`);
            });

            it('should encode the json object', function (done) {
                this.timeout(10000);

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

        describe('with a binary file', () => {

            let arrayBuffer;

            beforeEach(async function () {
                this.timeout(6000);

                arrayBuffer = await loadFixtureAsArrayBuffer(`${ filename }.mid`);
            });

            it('should refuse to encode the file', function (done) {
                this.timeout(10000);

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
