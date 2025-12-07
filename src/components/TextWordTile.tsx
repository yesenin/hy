import clsx from "clsx";
import type { Word } from "../types";

interface TextWordTileProps {
    word: Word;
    onClick?: () => void;
    active?: boolean;
    disabled?: boolean;
    withSound?: boolean;
}

function TextWordTile(props: TextWordTileProps) {
    const { onClick, active, disabled } = props;
    const { id, value } = props.word;
    const className = clsx(
        "p-4 border rounded", 
        disabled && "bg-red-200 text-yellow-500 cursor-not-allowed",
        !disabled && active ? "bg-yellow-100 text-red-200" : "bg-white text-black"
    );
    return (
        <div 
            data-testid="text-word-tile"
            data-word-id={id}
            data-active={active ? 'true' : 'false'}
            onClick={onClick}
            className={className}
        >{value}</div>
    );
}

export default TextWordTile;