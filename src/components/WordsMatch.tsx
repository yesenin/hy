import { useEffect, useState } from "react";
import WordTileColumn from "./WordTileColumn";
import type { DataSetItem, Word } from "../types";
import { sampleSize, shuffle } from "lodash-es";
import { DataService } from "../services";
import { WordMatchService } from "../services/WordsMatchService";


interface Slot {
    word: Word;
 }

function WordMatch() {
    const service = new WordMatchService();
    const [selectedArmenianIndex, setSelectedArmenianIndex] =  useState<number>(-1);
    const [selectedRussianIndex, setSelectedRussianIndex] =  useState<number>(-1);

    const [alertMessage, setAlertMessage] = useState<string>('');

    const [armenianSlots, setArmenianSlots] = useState<(Slot | null)[]>([]);
    const [russianSlots, setRussianSlots] = useState<(Slot | null)[]>([]);

    const [dataSet, setDataSet] = useState<DataSetItem[]>([]);

    const onArmenianSelected = (index: number) => {
        if (selectedArmenianIndex >= 0 && index === selectedArmenianIndex) {
            setSelectedArmenianIndex(-1);
            return;
        }
        setSelectedArmenianIndex(index);
    }

    const onRussianSelected = (index: number) => {
        if (selectedRussianIndex >= 0 && index === selectedRussianIndex) {
            setSelectedRussianIndex(-1);
            return;
        }
        setSelectedRussianIndex(index);
    }

    useEffect(() => {
        const dataService = new DataService();
        const sample = dataService.getSample();
        setDataSet(sample);
    }, []);

    useEffect(() => {
        service.addRoundItems(sampleSize(dataSet, 10));
        const initItems = service.getRandomItems(4);

        const armenian: Slot[] = initItems.map((item: DataSetItem) => (
            {
                word: {
                    id: item.id,
                    value: item.value,
                }
            }
        ));

        const russian: Slot[] = initItems.map((item: DataSetItem) => (
            {
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
        if (selectedArmenianIndex >= 0 && selectedRussianIndex >= 0) {
            checkMatch();
        }
    }, [selectedArmenianIndex, selectedRussianIndex]);

    const checkMatch = () => {
        const armenianWord = armenianSlots[selectedArmenianIndex]?.word;
        const russianWord = russianSlots[selectedRussianIndex]?.word;

        const isMatch = armenianWord?.id === russianWord?.id;

        if (isMatch) {
            setAlertMessage(`Correct! "${armenianWord?.value}" matches "${russianWord?.value}"`);
            setArmenianSlots(armenianSlots
                .map((slot: Slot | null, idx: number) => idx === selectedArmenianIndex ? null : slot));
            setRussianSlots(russianSlots
                .map((slot: Slot | null, idx: number) => idx === selectedRussianIndex ? null : slot));
            
        } else {
            setAlertMessage(`Incorrect! "${armenianWord?.value}" does not match "${russianWord?.value}"`);
            
        }

        setSelectedArmenianIndex(-1);
        setSelectedRussianIndex(-1);
    }

    const getEmptyIndecies = (slots: (Slot | null)[]): number[] => {
        return slots.reduce<number[]>((acc: number[], slot: Slot | null, idx: number) => {
            if (!slot) {
                acc.push(idx);
            }
            return acc;
        }, []);
    }

    const addNewWords = () => {
        const freeSlotCount = getEmptyIndecies(armenianSlots).length;
        const batch = sampleSize(dataSet, freeSlotCount);
        const armenianBatch = shuffle(batch).map(item => ({
            word: {
                id: item.id,
                value: item.value,
            }
        }));
        const russianBatch = shuffle(batch).map(item => ({
            word: {
                id: item.id,
                value: item.translation,
            }
        }));
        
        const freeArmenianSlots: number[] = getEmptyIndecies(armenianSlots);

        const freeRussianSlots: number[] = getEmptyIndecies(russianSlots);

        let nextArmenianSlots: (Slot | null)[] = [...armenianSlots];
        let nextRussianSlots: (Slot | null)[] = [...russianSlots];

        for (let i = 0; i < freeSlotCount; i++) {
            const armIndex = freeArmenianSlots.pop()!;
            const rusIndex = freeRussianSlots.pop()!;
            nextArmenianSlots[armIndex] = armenianBatch[i];
            nextRussianSlots[rusIndex] = russianBatch[i];
        }

        setArmenianSlots(nextArmenianSlots);
        setRussianSlots(nextRussianSlots);
    }

    return (
        <main>
            <h2>Word match</h2>
            <div className='flex gap-8'>
                <WordTileColumn
                    words={armenianSlots.map(slot => slot?.word || null)}
                    onTileSelected={onArmenianSelected}
                    selectedIndex={selectedArmenianIndex}
                    emptyIndecies={getEmptyIndecies(armenianSlots)}/>
                <WordTileColumn
                    words={russianSlots.map(slot => slot?.word || null)}
                    onTileSelected={onRussianSelected}
                    selectedIndex={selectedRussianIndex}
                    emptyIndecies={getEmptyIndecies(armenianSlots)}/>
            </div>
            <div>
                {alertMessage}
            </div>
            <div>
                {getEmptyIndecies(armenianSlots).length}
                <button
                    type='button'
                    disabled={getEmptyIndecies(armenianSlots).length === 0}
                    onClick={() => addNewWords()}>Add</button>
            </div>
        </main>
    )
}

export default WordMatch;