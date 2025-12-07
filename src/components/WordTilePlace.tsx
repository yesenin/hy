interface WordTilePlaceProps {
    children?: React.ReactNode;
}

function WordTilePlace(props: WordTilePlaceProps) {
    const { children } = props;
    return (
        <div className="min-h-[3rem]">
            {children}
        </div>
    )
}

export default WordTilePlace;