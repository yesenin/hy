import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TextWordTile from "../../components/TextWordTile";

describe('TextWordTile component', () => {
    it('Renders text', async () => {
        const word = { id: 1, value: 'Hello'};
        render(<TextWordTile word={word}/>);

        const element = await screen.findByTestId("text-word-tile");
        expect(element).not.toBeNull();
        expect(element).toBeInTheDocument();
    });
});