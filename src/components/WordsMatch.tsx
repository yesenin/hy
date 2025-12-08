import { useEffect, useState } from "react";
import WordTileColumn from "./WordTileColumn";
import type { DataSetItem, Word } from "../types";
import { find, sampleSize, shuffle } from "lodash-es";
import { DataService } from "../services";
import { it } from "vitest";

const armenianWords= [
    {id: 1, value: 'բարեւ'},
    {id: 2, value: 'շնորհակալություն'},
    {id: 3, value: 'խնդրում եմ'},
];

const russianWords = [
    {id: 4, value: 'привет'},
    {id: 5, value: 'спасибо'},
    {id: 6, value: 'пожалуйста'},
];

const gameSet = {
    armenian: armenianWords,
    russian: russianWords,
    pairs: [
        {armenianId: 1, russianId: 4},
        {armenianId: 2, russianId: 5},
        {armenianId: 3, russianId: 6},
    ]
}

interface Slot {
    index: number;
    word?: Word | null;
 }

function WordMatch() {
    const [selectedArmenianSlot, setSelectedArmenianSlot] =  useState<Slot | null>(null);
    const [selectedRussianSlot, setSelectedRussianSlot] =  useState<Slot | null>(null);
    const [alertMessage, setAlertMessage] = useState<string>('');

    const [armenianSlots, setArmenianSlots] = useState<Slot[]>([]);
    const [russianSlots, setRussianSlots] = useState<Slot[]>([]);

    const [dataSet, setDataSet] = useState<DataSetItem[]>([]);

    const onArmenianSelected = (index: number) => {
        if (selectedArmenianSlot && index === selectedArmenianSlot.index) {
            setSelectedArmenianSlot(null);
            return;
        }
        setSelectedArmenianSlot(find(armenianSlots, {index}) || null);
    }

    const onRussianSelected = (index: number) => {
        if (selectedRussianSlot && index === selectedRussianSlot.index) {
            setSelectedRussianSlot(null);
            return;
        }
        setSelectedRussianSlot(find(russianSlots, {index}) || null);
    }

    useEffect(() => {
        const dataService = new DataService();
        const sample = dataService.getSample();
        setDataSet(sample);
    }, []);

    useEffect(() => {
        const innerSample: DataSetItem[] = sampleSize(dataSet, 5);

        const armenian: Slot[] = innerSample.map((item, index) => (
            {
                index,
                word: {
                    id: item.id,
                    value: item.value,
                }
            }
        ));

        const russian: Slot[] = innerSample.map((item, index) => (
            {
                index,
                word: {
                    id: item.id,
                    value: item.translation,
                }
            }
        ));

        setArmenianSlots(shuffle(armenian));
        setRussianSlots(shuffle(russian));
    }, [dataSet])

    useEffect(() => {
        if (selectedArmenianSlot && selectedRussianSlot) {
            checkMatch();
        }
    }, [selectedArmenianSlot, selectedRussianSlot]);

    const checkMatch = () => {
        const armenianWord = selectedArmenianSlot?.word;
        const russianWord = selectedRussianSlot?.word;

        const isMatch = armenianWord?.id === russianWord?.id;

        if (isMatch) {
            setAlertMessage(`Correct! "${armenianWord?.value}" matches "${russianWord?.value}"`);
            setArmenianSlots(armenianSlots
                .map(slot => slot.index === selectedArmenianSlot?.index ? {...slot, word: null} : slot));
            setRussianSlots(russianSlots
                .map(slot => slot.index === selectedRussianSlot?.index ? {...slot, word: null} : slot));
            
        } else {
            setAlertMessage(`Incorrect! "${armenianWord?.value}" does not match "${russianWord?.value}"`);
        }
        setSelectedArmenianSlot(null);
        setSelectedRussianSlot(null);
    }


    return (
        <main>
            <h2>Word match</h2>
            <div className='flex gap-8'>
                <WordTileColumn
                    words={armenianSlots.map(slot => slot.word || null)}
                    onTileSelected={onArmenianSelected}
                    selectedIndex={selectedArmenianSlot ? selectedArmenianSlot.index : -1}
                    emptyIndecies={[]}/>
                <WordTileColumn
                    words={russianSlots.map(slot => slot.word || null)}
                    onTileSelected={onRussianSelected}
                    selectedIndex={selectedRussianSlot ? selectedRussianSlot.index : -1}
                    emptyIndecies={[]}/>
            </div>
            <div>
                {alertMessage}
            </div>
        </main>
    )
}

export default WordMatch;