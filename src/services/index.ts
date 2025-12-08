import { sampleSize } from 'lodash-es';
import type { DataSetItem } from '../types';

const raw = [
    {
        id: "a2ff1050-f1cd-4ae6-b38b-0fb3ec5523c9",
        value: "ծխել",
        translation: "курить",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/93df79e2697a3902f2cfbcd8ecc39788.mp3",
        kind: "verb"
    },
    {
        id: "66f9e4bb-0b2a-4dee-9313-7cb2a00e735e",
        value: "վճարել",
        translation: "платить",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/8d800a138cfef230b1918e0946307100.mp3",
        kind: "verb"
    },
    {
        id: "7bd917e9-84e8-47a0-aea1-61431d7a654b",
        value: "տեսնել",
        translation: "видеть",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/4384e155abde7201a9f9ab8f1953a49f.mp3",
        kind: "verb"
    },
    {
        id: "51604479-cd40-491a-9e10-355f85b582a2",
        value: "բերել",
        translation: "приносить",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/008c1cbf36f2d220ac3213ab46987928.mp3",
        kind: "verb"
    },
    {
        id: "de4a49ce-c4e0-444f-84fb-581bad342f71",
        value: "տանել",
        translation: "относить",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/9b2fd52c54f9b306f55cc5fee8002bc3.mp3",
        kind: "verb"
    },
    {
        id: "81079910-510b-473a-bc22-9b8d927aa49e",
        value: "զբոսնել",
        translation: "гулять",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/3cb4f27067b8efbd0f8c9b87f4497fc8.mp3",
        kind: "verb"
    },
    {
        id: "38d0aeea-0710-4def-b3b7-59fdf785ec99",
        value: "նստել",
        translation: "сидеть",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/e09e730813f98e42797cfa5f3d032e09.mp3",
        kind: "verb"
    },
    {
        id: "d157c16d-854f-44f4-a5b4-9a73820dce43",
        value: "կանգնել",
        translation: "стоять",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/729e1d400acb5ac50c1b6fda87a1426f.mp3",
        kind: "verb"
    },
    {
        id: "efeff225-cfbf-4750-a303-e89c67d2ba5a",
        value: "քնել",
        translation: "спать",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/81eb4608339696f79a9a49dacbc4de47.mp3",
        kind: "verb"
    },
    {
        id: "c2749e80-071a-4736-a511-620d12dcefbd",
        value: "պառկել",
        translation: "лежать",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/9e5aeeb36690f1255b615028b5bac6c3.mp3",
        kind: "verb"
    },
    {
        id: "9a9c15f3-f724-46f0-97fa-9839f5b7287b",
        value: "հոգնել",
        translation: "уставать",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/7e8afc80a483bb69000de78bad579aa4.mp3",
        kind: "verb"
    },
    {
        id: "15ee9a21-a479-40ac-ab05-f646275b4864",
        value: "օգնել",
        translation: "помогать",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/1de496685933e2492ba6347a3c155460.mp3",
        kind: "verb"
    },
    {
        id: "2dbeed4f-1505-4732-a31b-d6444a83cddc",
        value: "առնել",
        translation: "брать, покупать",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/ea75ccc88813ed3d0dc54329bba319ec.mp3",
        kind: "verb"
    },
    {
        id: "183b0874-6651-414e-916d-47ecaed9e03a",
        value: "ծախել",
        translation: "продавать (разг.)",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/189d1653d56fe81193f1671a1e914139.mp3",
        kind: "verb"
    },
    {
        id: "1a4eb82f-e887-406c-b5ce-282dac8be61f",
        value: "հեռու",
        translation: "далеко",
        speechUrl: "https://yesenian01.blob.core.windows.net/speeches/b3bc65bd03487cfb6c152537b7e36aeb.mp3",
        kind: "adverb"
    }
];

export class DataService {
    getSample(take: number = 10): DataSetItem[] {
        return sampleSize(raw, take);
    }
}
