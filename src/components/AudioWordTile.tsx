import clsx from "clsx";
import type { Word } from "../types";

interface AudioWordTileProps {
    word: Word;
    onClick?: () => void;
    active?: boolean;
    disabled?: boolean;
}

function AudioWordTile(props: AudioWordTileProps) {
    const { onClick, active, disabled } = props;
    const { id, value } = props.word;
    const className = clsx(
        "p-4 border rounded", 
        disabled && "bg-red-200 text-yellow-500 cursor-not-allowed",
        !disabled && active ? "bg-blue-500 text-green" : "bg-white text-black"
    );
    return (
        <button 
            data-test-id="audio-word-tile"
            data-word-id={id}
            data-active={active ? 'true' : 'false'}
            onClick={onClick}
            className={className}
        >{value}</button>
    );
}

export default AudioWordTile;