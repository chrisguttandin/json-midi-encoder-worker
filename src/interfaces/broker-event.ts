import { IEncodeRequest } from './encode-request';

export interface IBrokerEvent extends Event {

    data: IEncodeRequest;

}
