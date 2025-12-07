import { useEffect, useState } from "react";
import WordTileColumn from "./WordTileColumn";

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

function WordMatch() {
    const [selectedArmenianIndex, setSelectedArmenianIndex] =  useState<number>(-1);
    const [selectedRussianIndex, setSelectedRussianIndex] =  useState<number>(-1);

    const onArmenianSelected = (index: number) => {
        setSelectedArmenianIndex(index);
    }

    const onRussianSelected = (index: number) => {
        setSelectedRussianIndex(index);
    }

    useEffect(() => {
        if (selectedArmenianIndex >= 0 && selectedRussianIndex >= 0) {
            checkMatch();
        }
    }, [selectedArmenianIndex, selectedRussianIndex]);

    const checkMatch = () => {
        const armenianWord = gameSet.armenian[selectedArmenianIndex];
        const russianWord = gameSet.russian[selectedRussianIndex];

        const isMatch = gameSet.pairs.some(pair => 
            pair.armenianId === armenianWord.id && pair.russianId === russianWord.id
        );

        if (isMatch) {
            alert(`Correct! "${armenianWord.value}" matches "${russianWord.value}"`);
        } else {
            alert(`Incorrect! "${armenianWord.value}" does not match "${russianWord.value}"`);
        }

        setSelectedArmenianIndex(-1);
        setSelectedRussianIndex(-1);
    }


    return (
        <main>
            <h2>Word match</h2>
            <div className='flex gap-8'>
                <WordTileColumn
                    words={gameSet.armenian}
                    onTileSelected={onArmenianSelected}
                    selectedIndex={selectedArmenianIndex!}/>
                <WordTileColumn
                    words={gameSet.russian}
                    onTileSelected={onRussianSelected}
                    selectedIndex={selectedRussianIndex!}/>
            </div>
        </main>
    )
}

export default WordMatch;