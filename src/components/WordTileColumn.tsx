import WordTile from "./WordTile";
import type { Word } from "../types";
import WordTilePlace from "./WordTilePlace";

interface WordTileColumnProps {
    words: Word[];
    selectedIndex?: number;
    onTileSelected: (index: number) => void;
}

function WordTileColumn(props: WordTileColumnProps) {
    const {words, onTileSelected, selectedIndex} = props;

    const emptyIndecies: number[] = [];
    const disabledIndecies: number[] = [];
    //const [emptyIndecies, setEmptyIndecies] = useState<number[]>([]);
    //const [disabledIndecies, setDisabledIndecies] = useState<number[]>([]);

    const handleTileClick = (index: number) => {
/*         if (index === selectedIndex) {
            if (emptyIndecies.length > 1) {
                setDisabledIndecies([...disabledIndecies, index]);
            } else {
                setEmptyIndecies([...emptyIndecies, index]);
                setSelectedIndex(-1);
            }
            return;
        } */
        onTileSelected(index);
    }

    return (
        <div data-testid='word-tile-column' className="flex flex-col gap-2">
            {words.map((word, index) => <WordTilePlace key={word.id}>
                {emptyIndecies.indexOf(index) < 0 && <WordTile 
                    variant='text-only'
                    data-index={index}
                    word={word}
                    onClick={() => handleTileClick(index)}
                    active={index === selectedIndex}
                    disabled={disabledIndecies.indexOf(index) >= 0}
                />}
            </WordTilePlace>)}
        </div>
    )
}

export default WordTileColumn;