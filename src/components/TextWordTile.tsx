import clsx from "clsx";
import type { TileAnimation, Word } from "../types";
import './WordTile.css';

interface TextWordTileProps {
    word: Word;
    onClick?: () => void;
    active?: boolean;
    disabled?: boolean;
    withSound?: boolean;
    animation?: TileAnimation;
}

function TextWordTile(props: TextWordTileProps) {
    const { onClick, active, disabled, animation } = props;
    const { id, value } = props.word;
    const className = clsx(
        "tile p-4 border rounded", 
        {'bg-red-200 tile-wrong': animation && animation === 'wrong'},
        {'bg-green-200 tile-correct': animation && animation === 'correct'},
        {'bg-green-200 tile-leave': animation && animation === 'leave'},
        {'bg-blue-100 tile-enter': animation && animation === 'new'},
        {'tile-active': animation && animation === 'active' },
        disabled && "bg-red-200 text-gray-200 cursor-not-allowed",
        !disabled && active ? "bg-black text-white" : "bg-white text-black",
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