import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WordTileColumn from "../../components/WordTileColumn";

describe('WordTileColumn tests', () => {
    it('Renders tiles', async () => {
        const words = [
            { id: 1, value: 'Anton' },
            { id: 2, value: 'Yesenin' },
        ];
        render(<WordTileColumn words={words} onTileSelected={() => null}/>);

        const columnElement = await screen.findByTestId("word-tile-column");
        expect(columnElement).toBeInTheDocument();

        const tiles = await within(columnElement).findAllByTestId('text-word-tile');
        expect(tiles.length).toBe(2);
        expect(tiles[0]).toHaveTextContent('Anton');
        expect(tiles[1]).toHaveTextContent('Yesenin');
    });
});