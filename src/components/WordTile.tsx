import type { Word } from "../types";
import AudioWordTile from "./AudioWordTile";
import TextWordTile from "./TextWordTile";


interface WordTileProps {
    word: Word;
    onClick?: () => void;
    active?: boolean;
    disabled?: boolean;
    variant: 'text-with-sound' | 'text-only' | 'sound-only';
}

function WordTile(props: WordTileProps) {
    const { variant } = props;
    switch (variant) {
        case 'text-with-sound':
            return <TextWordTile {...props} withSound={true} />;
        case 'sound-only':
            return <AudioWordTile {...props} />;
        default:
            return <TextWordTile {...props} />;
    }
}

export default WordTile;